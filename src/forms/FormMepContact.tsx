import React, {
  useContext,
  useEffect,
  useState
} from "react";
import { Formik } from "formik";
import BootstrapForm from "react-bootstrap/Form";
import FieldSelect, { FieldSelectOptionsType }  from "../fields/FieldSelect";

import ContextDatabase from "../contexts/ContextDatabase";
import { execStatement } from "../database";
import {
  SELECT_COUNTRIES,
  SELECT_EU_FRACTIONS,
  SELECT_NATIONAL_PARTIES
} from "../consts/sqls";
export const CONTROLL_ID = "form-mep-contact";

export type MepContactFormProps = {
  countries: FieldSelectOptionsType,
  euFractions: FieldSelectOptionsType,
  nationalParties: FieldSelectOptionsType
}

export type FormMepContactValues = {
  countries: FieldSelectOptionsType;
}

const initialValues: FormMepContactValues = {
  countries: []
};

export const MepContactForm = ({
  countries,
  euFractions,
  nationalParties
} : MepContactFormProps) => (
  <Formik
    initialValues={initialValues}
    onSubmit={(values, { setSubmitting }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 500);
    }}
  >
    {({ handleReset, handleSubmit }) => (
      <BootstrapForm onReset={handleReset} onSubmit={handleSubmit}>
        <FieldSelect
          controllId={`${CONTROLL_ID}-select-countries`}
          name="countries"
          label="Select countries"
          isMulti={true}
          options={countries}
        />
        <FieldSelect
          controllId={`${CONTROLL_ID}-select-national-parties`}
          name="national-parties"
          label="Select national parties"
          isMulti={true}
          options={nationalParties}
        />
        <FieldSelect
          controllId={`${CONTROLL_ID}-select-eu-fractions`}
          name="eu-fractions"
          label="Select EU fractions"
          isMulti={true}
          options={euFractions}
        />
      </BootstrapForm>
    )}
  </Formik>
);

export const ConnectedMepContactForm = () => {
  const database = useContext(ContextDatabase);
  const [countries, setCountries] = useState<FieldSelectOptionsType>();
  const [euFractions, setEuFractions] = useState<FieldSelectOptionsType>();
  const [nationalParties, setNationalParties] = useState<FieldSelectOptionsType>(); 

  // TODO clean and merge queries
  useEffect(() => {
    execStatement({database, sql: SELECT_COUNTRIES})
    .then(({ values }) => {
      const countries = values.map((entry) => ({
        label: entry[0] as string,
        value: entry[0] as string
      }));
      setCountries(countries);
    })
    .catch(console.error);

    execStatement({database, sql: SELECT_NATIONAL_PARTIES})
    .then(({ values } ) => {
      const nationalParties = values.map((entry) => ({
        label: entry[0] as string,
        value: entry[0] as string
      }));
      setNationalParties(nationalParties);
    })
    .catch(console.error);

    execStatement({database, sql: SELECT_EU_FRACTIONS})
    .then(({ values }) =>{
      const euFractions = values.map((entry) => ({
        label: entry[0] as string,
        value: entry[0] as string
      }));
      setEuFractions(euFractions);
    })
    .catch(console.error);
  }, [database]);

  return (
    <MepContactForm
      countries={countries}
      euFractions={euFractions}
      nationalParties={nationalParties}
    />
  );
};

  // useEffect(() => {
    // if (sql) {
      // exec(sql);
    // }
  // }, [sql]);

// import { execSql } from "./db";
  // const exec = (sql : string) => {
    // if (db) {
      // execSql({db, sql})
      // .then((results) => {
        // setResults(results);
        // // reset errors
        // setError(undefined);
      // })
      // .catch(setError);
    // }
  // };
// {results && results.length > 0 // results contains one object per select statement in the query
          // && results.map((result, index) => <Results key={index} {...result} />)
        // }


export default ConnectedMepContactForm;
