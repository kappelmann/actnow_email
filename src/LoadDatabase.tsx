import React, {
  useEffect,
  useState
} from "react";
import initSqlJs, {
  Database,
  SqlJsStatic
} from "sql.js";
import {
  useHistory,
  useLocation
} from "react-router";
import Alert from "react-bootstrap/Alert";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useTranslation } from "react-i18next";

import ContextDatabase from "./contexts/ContextDatabase";
import URLS from "./consts/urls";
import {
  getDatabase,
  getDatabaseConfig
} from "./client";
import {
  parseQueryParams,
  stringifyQueryParams
} from "./utils";


export type LoadDatabaseProps = {
  children: React.ReactNode
};

export const LoadDatabase = ({
  children
} : LoadDatabaseProps) => {
  const [database, setDatabase] = useState<Database>();
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<Error>();
  const { t } = useTranslation();
  // get the query params, which should include a version parameter
  const {
    search,
    ...locationRest
  } = useLocation();
  const {
    version,
    ...queryParamsRest
  } = parseQueryParams(search);
  const history = useHistory();

  useEffect(() => {
    const hasVersion = typeof version === "string" && version;
    if (!hasVersion) {
      // if no version is specified, we load the config from the server
      // which will include a link to the newest version
      getDatabaseConfig({})
      .then(({ data }) => {
        const { version } = data;
        if (!version) {
          setError(t("Could not load database version from server"));
          return;
        }

        // let's reload the page with the version as a query param
        history.replace({
          search: stringifyQueryParams({
            ...queryParamsRest,
            version,
          }),
          ...locationRest
        });
      })
      .catch(setError);
      return;
    }

    // load SqlJs
    initSqlJs({
      // we need to to load the wasm binary asynchronously.
      locateFile: (file : string) => `${URLS.SQL_JS}/${file}`
    })
    .then(loadDatabase)
    .catch(setError);
  }, [version]);

  const loadDatabase = (SQL: SqlJsStatic) => {
    // load the database from the server
    getDatabase({
      onDownloadProgress: ({ loaded, total, lengthComputable }) => {
        if (lengthComputable) {
          setProgress(Math.round((loaded * 100) / total));
        } else {
          console.info("Cannot compute progress of database download.");
        }
      },
      // we already checked if the version is existing in useEffect
      version: version as string
    })
    .then(({ data }) => {
      // convert the data to the right format
      const uInt8Database = new Uint8Array(data);
      // create the database
      const database = new SQL.Database(uInt8Database);
      setDatabase(database);
    })
    .catch((error) => {
      if (error.response?.status === 404) {
        setError(t("Could not find specified database version"));
      } else {
        setError(error);
      }
    });
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
