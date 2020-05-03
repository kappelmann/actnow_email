import {
  Column,
  Table
} from "./consts/sqls";

export const accessorsFromEntries = (entries : Column[] | Table[]) => {
  return (entries as (Column | Table)[]).map(({ accessor }) => accessor).join(",");
};

export const tableColumnsFromSqlEntries = (t : (display : string) => string, entries : Column[]) => {
  return entries.map(({ accessor, display }) => ({
    Header: t(display),
    accessor
  }));
};

