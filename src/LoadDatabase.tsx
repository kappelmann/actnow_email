import React, {
  useEffect,
  useState
} from "react";
import initSqlJs, {
  Database,
  SqlJsStatic
} from "sql.js";
import Alert from "react-bootstrap/Alert";
import ProgressBar from "react-bootstrap/ProgressBar";

import ContextDatabase from "./contexts/ContextDatabase";
import Url from "./consts/urls";
import { getDatabase } from "./client";

export type LoadDatabaseProps = {
  children: React.ReactNode
};

export const LoadDatabase = ({ children } : LoadDatabaseProps) => {
  const [database, setDatabase] = useState<Database>();
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    initSqlJs({
      // we need to to load the wasm binary asynchronously.
      locateFile: (file : string) => `${Url.SqlJs}/${file}`
    })
    .then(loadDatabase)
    .catch(setError);
  }, []);

  const loadDatabase = (SQL: SqlJsStatic) => {
    // load the database from the server
    getDatabase({
      onDownloadProgress: ({ loaded, total, lengthComputable }) => {
        if (lengthComputable) {
          setProgress(Math.round((loaded * 100) / total));
        } else {
          console.info("Cannot compute progress of database download.");
        }
      }
    })
    .then(({ data }) => {
      // convert the data to the right format
      const uInt8Database = new Uint8Array(data);
      // create the database
      const database = new SQL.Database(uInt8Database);
      setDatabase(database);
    })
    .catch(setError);
  };

  if (error) return <Alert variant={"danger"}>{error.toString()}</Alert>;
  if (!database) return <ProgressBar now={progress} label={`${progress}%`} />;
  return (
    <ContextDatabase.Provider value={database}>
      {children}
    </ContextDatabase.Provider>
  );
};

export default LoadDatabase;
