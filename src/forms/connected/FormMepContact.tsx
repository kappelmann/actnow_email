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

import FieldCountries from "../../fields/connected/FieldCountries";
import FieldEuFractions from "../../fields/connected/FieldEuFractions";
import FieldNationalParties from "../../fields/connected/FieldNationalParties";
import FieldTable from "../../fields/tables/FieldTable";

import ContextDatabase from "../../contexts/ContextDatabase";
import { SELECT_MEPS } from "../../consts/sqls";
import { execStatement } from "../../database";
import { tableColumnsFromSqlEntries } from "../../utils";

export const CONTROL_ID = "form-mep-contact";

export enum VALUES {
  COUNTRIES = "countries",
  NATIONAL_PARTIES = "nationalParties",
  EU_FRACTIONS = "euFractions",
  MEPS = "meps"
}

// TODO fix this somehow
export type MepValue = {
  [key : string]: string
};

export type FormMepContactValues = {
  [VALUES.COUNTRIES]: string[] | undefined,
  [VALUES.NATIONAL_PARTIES]: string[] | undefined,
  [VALUES.EU_FRACTIONS]: string[] | undefined,
  [VALUES.MEPS]: MepValue[] | undefined
}

const INITIAL_VALUES : FormMepContactValues = {
  [VALUES.COUNTRIES]: undefined,
  [VALUES.NATIONAL_PARTIES]: undefined,
  [VALUES.EU_FRACTIONS]: undefined,
  [VALUES.MEPS]: undefined
};

export type FormMepContactProps = FormikProps<FormMepContactValues> & {
  meps: MepValue[]
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
        name={VALUES.COUNTRIES}
        multiple={true}
      />
      <FieldNationalParties
        controlId={`${CONTROL_ID}-select-national-parties`}
        name={VALUES.NATIONAL_PARTIES}
        multiple={true}
      />
      <FieldEuFractions
        controlId={`${CONTROL_ID}-select-eu-fractions`}
        name={VALUES.EU_FRACTIONS}
        multiple={true}
      />
      <Button block variant="primary" type="submit">
        Submit
      </Button>
      <FieldTable
        name={VALUES.MEPS}
        columns={tableColumnsFromSqlEntries(t, SELECT_MEPS.columns)}
        data={meps}
        globalFilterControlId={`${CONTROL_ID}-filter-meps`}
        entriesPerPageControlId={`${CONTROL_ID}-entries-per-page-meps`}
        goToPageControlId={`${CONTROL_ID}-go-to--page-meps`}
      />
    </BootstrapForm>
  );
};

export type ConnectedFormMepContactProps = FormikProps<FormMepContactValues>

export const ConnectedFormMepContact = (props : ConnectedFormMepContactProps) => {
  const {
    values: {
      [VALUES.COUNTRIES]: selectedCountries,
      [VALUES.EU_FRACTIONS]: selectedEuFractions,
      [VALUES.NATIONAL_PARTIES]: selectedNationalParties
    }
  } = props;

  const database = useContext(ContextDatabase);
  const [meps, setMeps] = useState<MepValue[]>([]);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    execStatement({
      database,
      sql: SELECT_MEPS.sql({
        countries: selectedCountries,
        euFractions: selectedEuFractions,
        nationalParties: selectedNationalParties,
      })
    })
    .then((result) => {
      const values = result?.values || [];
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
