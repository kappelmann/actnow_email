import { Column } from "react-table";
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
import Collapse from "react-bootstrap/Collapse";
import BootstrapForm from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinusSquare,
  faPlusSquare
} from "@fortawesome/free-solid-svg-icons";


import FieldCountries from "../../fields/connected/FieldCountries";
import FieldEuFractions from "../../fields/connected/FieldEuFractions";
import FieldNationalParties from "../../fields/connected/FieldNationalParties";
import FieldTable from "../../fields/tables/FieldTable";
import TableGlobalFilter from "../../fields/tables/TableGlobalFilter";

import ContextDatabase from "../../contexts/ContextDatabase";

import { SELECT_MEPS } from "../../database/sqls";
import { execStatement } from "../../database/utils";

import { tableColumns } from  "../../utils";

export const CONTROL_ID = "form-mep-contact";

export enum FormMepContactValuesKeys {
  Meps = "meps",
  EuFractions = "eu_fractions",
  Countries = "countries",
  NationalParties = "national_parties"
}

export enum FormMepContactValuesMepsKeys {
  MepId = "mep_id",
  Name = "name",
  EuFraction = "eu_fraction",
  Country = "country",
  NationalParty = "national_party"
}

export type FormMepContactValuesMep = Record<FormMepContactValuesMepsKeys, string>;

export type FormMepContactValues = {
  [FormMepContactValuesKeys.Meps]: FormMepContactValuesMep[],
  [FormMepContactValuesKeys.EuFractions]?: string[],
  [FormMepContactValuesKeys.Countries]?: string[],
  [FormMepContactValuesKeys.NationalParties]?: string[]
};

const INITIAL_VALUES : FormMepContactValues = {
  [FormMepContactValuesKeys.Meps]: []
};

export type FormMepContactProps = FormikProps<FormMepContactValues> &
  Pick<FormMepContactValues, FormMepContactValuesKeys.Meps>;

export const FormMepContact = ({
  handleReset,
  handleSubmit,
  meps,
  values: {
    countries,
    eu_fractions,
    national_parties
  }
} : FormMepContactProps) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const { t } = useTranslation();
  const globalFilterRef = React.createRef<HTMLInputElement>();
  return (
    <BootstrapForm onReset={handleReset} onSubmit={handleSubmit}>
      <Row className="align-items-center">
        <Col md={10}>
          <TableGlobalFilter ref={globalFilterRef} controlId={`${CONTROL_ID}-filter-meps`}/>
        </Col>
        <Col>
          <Button
            block
            variant="secondary"
            onClick={() => setOptionsOpen(!optionsOpen)}
            aria-expanded={optionsOpen}
          >
            <FontAwesomeIcon icon={optionsOpen ? faMinusSquare : faPlusSquare} fixedWidth />
            {t("Options")}
          </Button>
        </Col>
      </Row>
      <Collapse in={optionsOpen}>
        <div>
          <Row>
            <Col>
              <FieldEuFractions
                controlId={`${CONTROL_ID}-select-eu-fractions`}
                name={FormMepContactValuesKeys.EuFractions}
                multiple={true}
                params={{ countries, national_parties }}
              />
            </Col>
            <Col>
              <FieldCountries
                controlId={`${CONTROL_ID}-select-countries`}
                name={FormMepContactValuesKeys.Countries}
                multiple={true}
                params={{ eu_fractions, national_parties }}
              />
            </Col>
          </Row>
          <FieldNationalParties
            controlId={`${CONTROL_ID}-select-national-parties`}
            name={FormMepContactValuesKeys.NationalParties}
            multiple={true}
            params={{ countries, eu_fractions }}
          />
        </div>
      </Collapse>
      <Button block variant="primary" type="submit">
        {t("Submit")}
      </Button>
      <FieldTable
        name={FormMepContactValuesKeys.Meps}
        columns={tableColumns(t, Object.values(FormMepContactValuesMepsKeys)) as Column<FormMepContactValuesMep>[] /*FIXME: can this be typed automatically?*/}
        hiddenColumns={[FormMepContactValuesMepsKeys.MepId]}
        data={meps}
        globalFilterRef={globalFilterRef}
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
      [FormMepContactValuesKeys.EuFractions]: selectedEuFractions,
      [FormMepContactValuesKeys.Countries]: selectedCountries,
      [FormMepContactValuesKeys.NationalParties]: selectedNationalParties
    }
  } = props;

  const database = useContext(ContextDatabase);
  const [meps, setMeps] = useState<FormMepContactValues[FormMepContactValuesKeys.Meps]>([]);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    execStatement({
      database,
      sql: SELECT_MEPS({
        [FormMepContactValuesKeys.Countries]: selectedCountries,
        [FormMepContactValuesKeys.EuFractions]: selectedEuFractions,
        [FormMepContactValuesKeys.NationalParties]: selectedNationalParties,
      })
    })
    .then((result) => {
      const columns = result?.columns ?? [];
      const values = result?.values ?? [];
      const meps = values.map((entry) => (
        columns.reduce((acc, column, index) => ({
          ...acc,
          [column]: entry[index]
        }), {})
      ));
      setMeps(meps as FormMepContactValues[FormMepContactValuesKeys.Meps]);
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

export type FormikConnectedFormMepContactProps = {
  onSubmit: (values : FormMepContactValues) => any
}

export const FormikConnectedFormMepContact = ({
  onSubmit
} : FormikConnectedFormMepContactProps) =>  (
  <Formik
    initialValues={INITIAL_VALUES}
    onSubmit={(values, { setSubmitting }) => {
      onSubmit(values);
      setSubmitting(false);
    }}
  >
    {(props) =>
      <ConnectedFormMepContact {...props} />
    }
  </Formik>
);

export default FormikConnectedFormMepContact;
