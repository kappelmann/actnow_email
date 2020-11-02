// Note: adapted from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/d1e5d808965b05cb549ed0b8c71f90ed6f464ebf/types/sql.js/module.d.ts
// latest version form sql.js does not seem to be supported
declare module "sql.js" {
  export type ValueType = number | string | Uint8Array | null;
  export type ParamsObject = Record<string, ValueType>;
  export type ParamsCallback = (obj: ParamsObject) => void;
  export type Config = Partial<typeof Module>;

  export interface QueryResults {
    columns: string[];
    values: ValueType[][];
  }

  export class Database {
    constructor();
    constructor(data?: Buffer | null);
    constructor(data?: Uint8Array | null);
    constructor(data?: number[] | null);

    run(sql: string): Database;
    run(sql: string, params: ParamsObject): Database;
    run(sql: string, params: ValueType[]): Database;

    exec(sql: string, params: ParamsObject): QueryResults[];

    each(sql: string, callback: ParamsCallback, done: () => void): void;
    each(sql: string, params: ParamsObject, callback: ParamsCallback, done: () => void): void;
    each(sql: string, params: ValueType[], callback: ParamsCallback, done: () => void): void;

    prepare(sql: string): Statement;
    prepare(sql: string, params: ParamsObject): Statement;
    prepare(sql: string, params: ValueType[]): Statement;

    export(): Uint8Array;

    close(): void;

    getRowsModified(): number;

    create_function(name: string, func: Function): void;
  }

  export class Statement {
    bind(): boolean;
    bind(values: ParamsObject): boolean;
    bind(values: ValueType[]): boolean;

    step(): boolean;

    get(): ValueType[];
    get(params: ParamsObject): ValueType[];
    get(params: ValueType[]): ValueType[];

    getColumnNames(): string[];

    getAsObject(): ParamsObject;
    getAsObject(params: ParamsObject): ParamsObject;
    getAsObject(params: ValueType[]): ParamsObject;

    run(): void;
    run(values: ParamsObject): void;
    run(values: ValueType[]): void;

    reset(): void;

    freemem(): void;

    free(): boolean;
  }

  export interface SqlJsStatic {
    Database: typeof Database;
    Statement: typeof Statement;
  }

  export interface InitSqlJsStatic extends Function {
    (config?: Config): Promise<SqlJsStatic>;
    readonly default: this;
  }
  let initSqlJs : InitSqlJsStatic;
}
