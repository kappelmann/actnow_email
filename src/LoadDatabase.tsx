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
import { SQL_JS } from "./consts/urls";
import { getDatabase } from "./client";

export type LoadDatabaseProps = {
  children: React.ReactNode
};

export const LoadDatabase = ({ children } : LoadDatabaseProps) => {
  const [db, setDb] = useState<Database>();
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<any>();

  useEffect(() => {
    initSqlJs({
      // we need to to load the wasm binary asynchronously.
      locateFile: file => `${SQL_JS}/${file}`
    })
    .then(loadDb)
    .catch(setError);
  }, []);

  const loadDb = (SQL : SqlJsStatic) => {
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
      const uInt8Db = new Uint8Array(data);
      // create the database
      const db = new SQL.Database(uInt8Db);
      setDb(db);
    })
    .catch(setError);
  };

  if (error) return <Alert variant={"danger"}>{error.toString()}</Alert>;
  if (!db) return <ProgressBar now={progress} label={`${progress}%`} />;
  return (
    <ContextDatabase.Provider value={db}>
      {children}
    </ContextDatabase.Provider>
  );
};

export default LoadDatabase;
