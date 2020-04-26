import React, {
  useEffect,
  useState
} from "react";
import initSqlJs from "sql.js";
import Alert from "react-bootstrap/Alert";

import MepSearchForm from "./MepSearchForm";
import Results from "./Results";
import { getDb } from "./client";
import { execSql } from "./db";
import { SQL_JS } from "./consts/urls";

export const App = () => {
  const [db, setDb] = useState();
  const [error, setError] = useState();
  const [results, setResults] = useState([]);
  const [sql, setSql] = useState("select * from meps;");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (!db) {
      initSqlJs({
        // we need to to load the wasm binary asynchronously.
        locateFile: file => `${SQL_JS}/${file}`
      })
      .then(loadDb)
      .catch(setError);
    }
    else if (sql) {
      exec(sql)
    }
  }, [db, sql]);

  const loadDb = (SQL : any) => {
    // load the database from the server
    getDb()
    .then(({ data }) => {
      // convert the data to the right format
      const uInt8Db = new Uint8Array(data);
      // create the database
      const db = new SQL.Database(uInt8Db);
      setDb(db);
    })
    .catch(setError);
  };

  const exec = (sql : string) => {
    execSql({db, sql})
    .then((results) => {
      setResults(results);
      // reset errors
      setError(undefined);
    })
    .catch(setError);
  };

  if (!db) return <pre>Loading...</pre>;
  else return (
    <>
      <MepSearchForm db={db}/>
      <textarea
        onChange={e => setSql(e.target.value)}
        placeholder="Enter some SQL."
        value={sql}
      />
      {error && <Alert variant={'warning'}>{error.toString()}</Alert>}
      {results && results.length > 0 // results contains one object per select statement in the query
        && results.map((result, index) => <Results key={index} {...result} />)
      }
    </>
  );
};

export default App;
