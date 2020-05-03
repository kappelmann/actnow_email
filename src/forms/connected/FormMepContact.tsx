import React, {
  useContext,
  useEffect,
  useState
} from "react";
import {
  Formik,
  FormikProps
} from "formik";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import BootstrapForm from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";

import { FieldSelectOptionsType } from "../../fields/FieldSelect";
import FieldCountries from "../../fields/connected/FieldCountries";
import FieldEuFractions from "../../fields/connected/FieldEuFractions";
import FieldNationalParties from "../../fields/connected/FieldNationalParties";
import FieldTable from "../../fields/tables/FieldTable";

import ContextDatabase from "../../contexts/ContextDatabase";
import { SELECT_MEPS } from "../../consts/sqls";
import { execStatement } from "../../database";
import { tableColumnsFromSqlEntries } from "../../utils";

export const CONTROL_ID = "form-mep-contact";

export type FormMepContactValues = {
  countries: FieldSelectOptionsType,
  euFractions: FieldSelectOptionsType,
  nationalParties: FieldSelectOptionsType,
  meps: FieldSelectOptionsType
}

const INITIAL_VALUES : FormMepContactValues = {
  countries: undefined,
  euFractions: undefined,
  nationalParties: undefined,
  meps: undefined
};

export type FormMepContactProps = FormikProps<FormMepContactValues> & {
  meps: { [key: string]: string }[]
};

export const FormMepContact = ({
  handleReset,
  handleSubmit,
  meps
} : FormMepContactProps) => {
  const { t } = useTranslation();
  return (
    <BootstrapForm onReset={handleReset} onSubmit={handleSubmit}>
      <FieldCountries
        controlId={`${CONTROL_ID}-select-countries`}
        isMulti={true}
      />
      <FieldNationalParties
        controlId={`${CONTROL_ID}-select-national-parties`}
        isMulti={true}
      />
      <FieldEuFractions
        controlId={`${CONTROL_ID}-select-eu-fractions`}
        isMulti={true}
      />
      <Button block variant="primary" type="submit">
        Submit
      </Button>
      <FieldTable
        globalFilterControlId={`${CONTROL_ID}-select-mep`}
        columns={tableColumnsFromSqlEntries(t, SELECT_MEPS.columns)}
        data={meps}
      />
    </BootstrapForm>
  );
};

export type ConnectedFormMepContactProps = FormikProps<FormMepContactValues>

export const ConnectedFormMepContact = (props : ConnectedFormMepContactProps) => {
  const {
    values: {
      countries: selectedCountries,
      euFractions: selectedEuFractions,
      nationalParties: selectedNationalParties
    }
  } = props;

  const database = useContext(ContextDatabase);
  const [meps, setMeps] = useState<{ [key: string]: string }[]>([]);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    execStatement({
      database,
      sql: SELECT_MEPS.sql({
        countries: (selectedCountries as Readonly<{label : string}[]>)?.map(({ label }) => label)
      })
    })
    .then(({ values }) => {
      const meps = values.map((entry) => (
        SELECT_MEPS.columns.reduce((acc, { accessor }, index) => ({
          ...acc,
          [accessor]: entry[index]
        }), {})
      ));
      setMeps(meps);
    })
    .catch(setError);
  }, [database, selectedCountries, selectedEuFractions, selectedNationalParties]);

  return (
    <>
      {error && <Alert variant={"danger"}>{error.toString()}</Alert>}
      <FormMepContact meps={meps} {...props} />
    </>
  );
};

export const FormikConnectedFormMepContact = () =>  (
  <Formik
    initialValues={INITIAL_VALUES}
    onSubmit={(values, { setSubmitting }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 500);
    }}
  >
    {(props) =>
      <ConnectedFormMepContact {...props} />
    }
  </Formik>
);

export default FormikConnectedFormMepContact;
