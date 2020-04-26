import React, {
  useEffect,
  useState
} from "react";
import Form from "react-bootstrap/Form";
import Select, {
  Option
} from "./Select";

import { execSql } from "./db";
import {
  SELECT_COUNTRIES,
  SELECT_EU_FRACTIONS,
  SELECT_NATIONAL_PARTIES
} from "./consts/sqls";

export type MepSearchFormProps = {
  countries: Option[],
  euFractions: Option[],
  nationalParties: Option[]
}

export const MepSearchForm = ({
  countries,
  euFractions,
  nationalParties
} : MepSearchFormProps) => (
  <Form>
    <Form.Group controlId="mepSearchForm.countriesSelect">
      <Form.Label>Select Countries</Form.Label>
      <Select
        isMulti={true}
        options={countries}
      />
    </Form.Group>
    <Form.Group controlId="mepSearchForm.nationalPartiesSelect">
      <Form.Label>Select National Parties</Form.Label>
      <Select
        isMulti={true}
        options={nationalParties}
      />
    </Form.Group>
    <Form.Group controlId="mepSearchForm.euFractionsSelect">
      <Form.Label>Select EU Fractions</Form.Label>
      <Select
        isMulti={true}
        options={euFractions}
      />
    </Form.Group>
  </Form>
);

export const ConnectedMepSearchForm = ({
  db
}) => {
  const [countries, setCountries] = useState([]);
  const [euFractions, setEuFractions] = useState([]);
  const [nationalParties, setNationalParties] = useState([]);

  useEffect(() => {
    execSql({db, sql: SELECT_COUNTRIES})
    .then((result) =>{
      if (result && result.length === 1) {
        const countries = result[0].values.map((entry) => ({
          label: entry[0],
          value: entry[0]
        }))
        setCountries(countries);
      }
    })
    .catch(console.error);

    execSql({db, sql: SELECT_NATIONAL_PARTIES})
    .then((result) =>{
      if (result && result.length === 1) {
        const nationalParties = result[0].values.map((entry) => ({
          label: entry[0],
          value: entry[0]
        }))
        setNationalParties(nationalParties);
      }
    })
    .catch(console.error);

    execSql({db, sql: SELECT_EU_FRACTIONS})
    .then((result) =>{
      if (result && result.length === 1) {
        const euFractions = result[0].values.map((entry) => ({
          label: entry[0],
          value: entry[0]
        }))
        setEuFractions(euFractions);
      }
    })
    .catch(console.error);
  }, [db]);

  return (
    <MepSearchForm
      countries={countries}
      euFractions={euFractions}
      nationalParties={nationalParties}
    />
  );
};

export default ConnectedMepSearchForm;
