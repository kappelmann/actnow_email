export const execSql = ({ db, sql }) => {
  if (db) {
    try {
      const results = db.exec(sql);
      return Promise.resolve(results);
    } catch (error) {
      // exec throws an error when the SQL statement is invalid
      return Promise.reject(error);
    }
  } else {
    Promise.reject("Cannot execute statement. Database undefined.");
  }
}
