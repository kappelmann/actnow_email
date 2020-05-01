import { Database } from "sql.js";

export type execSqlType = {
  database: Database,
  sql: string
}

export const execSql = ({
  database,
  sql
} : execSqlType) => {
  try {
    const results = database.exec(sql);
    return Promise.resolve(results);
  } catch (error) {
    // exec throws an error when the SQL statement is invalid
    return Promise.reject(error);
  }
};


export type execStatementType = {
  database: Database,
  sql: string
}

export const execStatement = ({
  database,
  sql
} : execStatementType) => {
  try {
    const results = database.exec(sql);
    if (results.length > 1) {
      console.warn("Passed multiple statements to execStatement. Only returning first result");
    }
    return Promise.resolve(results[0]);
  } catch (error) {
    // exec throws an error when the SQL statement is invalid
    return Promise.reject(error);
  }
};
