import {
  Database,
  ParamsObject,
  QueryExecResult
} from "sql.js";

export const tableColumn = (table: string, column: string) => {
  return `${table}.${column}`;
};

export type TableColumn = {
  table:  string,
  column: string
}

export const columns = (tableColumns: TableColumn[]) => {
  return tableColumns.map(({ table, column }) => tableColumn(table, column)).join(",");
};

export const tables = (tables: string[]) => {
  return tables.join(",");
};

export const quoteJoin = (values: string[]) => {
  return values.map((value) => `'${value}'`).join(",");
};

export type execSqlType = {
  database: Database,
  sql: string,
  params?: ParamsObject
}

export const execSql = ({
  database,
  sql,
  params = {}
} : execSqlType) : Promise<QueryExecResult[]> => {
  try {
    const results = database.exec(sql, params);
    return Promise.resolve(results);
  } catch (error) {
    // exec throws an error when the SQL statement is invalid
    return Promise.reject(error);
  }
};

export type execStatementType = {
  database: Database,
  sql: string,
  params?: ParamsObject
}

export const execStatement = ({
  database,
  sql,
  params = {}
} : execStatementType) : Promise<QueryExecResult | undefined> => {
  try {
    const results = database.exec(sql, params);
    if (results.length > 1) {
      console.warn("Passed multiple statements to execStatement. Only returning first result");
    }
    return Promise.resolve(results.length > 0 ? results[0] : undefined);
  } catch (error) {
    // exec throws an error when the SQL statement is invalid
    return Promise.reject(error);
  }
};

export const resultToObjects = (result?: QueryExecResult) => {
  const columns = result?.columns ?? [];
  const values = result?.values ?? [];
  return values.map((entry) => (
    columns.reduce((acc, column, index) => ({
      ...acc,
      [column]: entry[index]
    }), {})
  ));
};
