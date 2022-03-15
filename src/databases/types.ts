export enum Type {
  Integer = "INTEGER",
  Text = "TEXT"
}

export type Column = {
  Name: string;
  Type: Type;
  Null: boolean;
  PrimaryKey: boolean;
  Default: null;
};

export type Table<Columns extends string> = {
  Name: string;
  Columns: Record<Columns, Column>
};

export type SqlEntry<P extends object> = (params : P) => string;
