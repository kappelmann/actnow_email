import React, {
  useContext,
  useEffect,
  useState
} from "react";
import Alert from "react-bootstrap/Alert";

import FieldSelect from "../FieldSelect";
import ContextDatabase from "../../contexts/ContextDatabase";
import { execStatement } from "../../databases/utils";

// options are retrieved from the database
export type FieldConnectedSelectProps = {
  controlId: string,
  label: string,
  sql: string,
  name: string,
  multiple?: boolean
};

// Retrieves the options from the database with the given query.
// Chooses the first column of the returned result set.
export const FieldConnectedSelect = ({
  sql,
  ...rest
} : FieldConnectedSelectProps) => {
  const database = useContext(ContextDatabase);
  const [options, setOptions] = useState<string[]>([]);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    execStatement({ database, sql })
    .then((result) => {
      const values = result?.values ?? [];
      const options = values.map((entry) => entry[0]);
      setOptions(options as string[]);
    })
    .catch(setError);
  }, [database, sql]);

  return (
    <>
      {error && <Alert variant={"danger"}>{error.toString()}</Alert>}
      <FieldSelect
        options={options}
        {...rest}
      />
    </>
  );
};

export default FieldConnectedSelect;
