import React from "react";
import Table from "react-bootstrap/Table";

export const Results = ({ columns, values }) => (
  <Table bordered hover responsive striped>
    <thead>
      <tr>
        {columns.map((columnName, index) =>
          <td key={index}>{columnName}</td>
        )}
      </tr>
    </thead>
    <tbody>
      {values.map((row, index) => // values is an array of arrays representing the results of the query
        <tr key={index}>
          {row.map((value, index) =>
            <td key={index}>{value}</td>
          )}
        </tr>
      )}
    </tbody>
  </Table>
);

export default Results;
