export type FieldValueBase = string | number | FieldValueBase[] | { [key: string]: FieldValueBase };
export type FieldValue = FieldValueBase | undefined;
