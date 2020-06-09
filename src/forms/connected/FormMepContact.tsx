import React, {
  useContext,
  useEffect,
  useState
} from "react";
import { Column } from "react-table";
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

import ExplanationJumbotron from "../../components/ExplanationJumbotron";

import FieldCountries from "../../fields/connected/FieldCountries";
import FieldEuFractions from "../../fields/connected/FieldEuFractions";
import FieldNationalParties from "../../fields/connected/FieldNationalParties";
import FieldTable from "../../fields/tables/FieldTable";
import TableGlobalFilter from "../../fields/tables/TableGlobalFilter";

import ContextDatabase from "../../contexts/ContextDatabase";

import {
  SELECT_MEPS,
  SELECT_MEP_IDS,
  SelectMepsGeneralParamsKeys
} from "../../database/sqls";
import { execStatement } from "../../database/utils";

import { tableColumns } from  "../../utils";

export const CONTROL_ID = "form-mep-contact";

export enum FormMepContactValuesKeys {
  Meps = "meps",
  EuFractions = "euFractions",
  Countries = "countries",
  NationalParties = "parties"
}

export enum FormMepContactValuesMepsKeys {
  MepId = "mep_id",
  Name = "name",
  NationalParty = "party",
  EuFraction = "eu_fraction",
  Email = "email"
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

export type FormMepContactPropsBase = {
  initialMepIds?: string[]
};

export type FormMepContactProps = FormMepContactPropsBase &
  FormikProps<FormMepContactValues> &
  Pick<FormMepContactValues, FormMepContactValuesKeys.Meps> & {
  filteredMepIds: Set<string>
};

export const FormMepContact = ({
  handleReset,
  handleSubmit,
  initialMepIds,
  filteredMepIds,
  meps,
  values: {
    countries,
    euFractions,
    parties: nationalParties,
    meps: selectedMeps
  }
} : FormMepContactProps) => {
  console.log(selectedMeps);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const { t } = useTranslation();
  const globalFilterRef = React.createRef<HTMLInputElement>();
  // initial selection must be set before first render if there are initial mep ids given
  const [initialSelection, setInitialSelection] = useState<Record<string, boolean> | undefined>(initialMepIds ? undefined : {});

  useEffect(() => {
    if (initialMepIds) {
      // create the final list fo selections for the table.
      // sadly, react-table expects the indices according to the passed data list and not given by the mep_id
      const remainingIds = new Set(initialMepIds);
      const initialSelection = meps.reduce((acc, { mep_id }, index) => {
        for (const remainingId of Array.from(remainingIds.keys())) {
          if (remainingId == mep_id) {
            remainingIds.delete(remainingId);
            return { ...acc, [index]: true };
          }
        }
        return acc;
      }, {});
      setInitialSelection(initialSelection);
    }
  }, [meps]);

  const globalFilter = React.useCallback((rows) => (
    rows.filter(({ values: { mep_id }) => filteredMepIds.has(mep_id))
  ), [filteredMepIds]);

  return (
    <>
      <ExplanationJumbotron
        closable={true}
        heading={t("Make a Change")}
        text={t("Meps instructions")}
      />
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
                  params={{ countries, nationalParties }}
                />
              </Col>
              <Col>
                <FieldCountries
                  controlId={`${CONTROL_ID}-select-countries`}
                  name={FormMepContactValuesKeys.Countries}
                  multiple={true}
                  params={{ euFractions, nationalParties }}
                />
              </Col>
            </Row>
            <FieldNationalParties
              controlId={`${CONTROL_ID}-select-national-parties`}
              name={FormMepContactValuesKeys.NationalParties}
              multiple={true}
              params={{ countries, euFractions }}
            />
          </div>
        </Collapse>
        {initialSelection &&
          <FieldTable
            name={FormMepContactValuesKeys.Meps}
            columns={tableColumns(t, Object.values(FormMepContactValuesMepsKeys)) as Column<FormMepContactValuesMep>[] /*FIXME: can this be typed automatically?*/}
            hiddenColumns={[FormMepContactValuesMepsKeys.MepId]}
            data={meps}
            initialSelection={initialSelection}
            globalFilter={globalFilter}
            globalFilterRef={globalFilterRef}
            entriesPerPageControlId={`${CONTROL_ID}-entries-per-page-meps`}
            goToPageControlId={`${CONTROL_ID}-go-to--page-meps`}
          />
        }
        <Button block variant="primary" type="submit" disabled={selectedMeps.length === 0}>
          {t("Create e-mail links")}
        </Button>
      </BootstrapForm>
    </>
  );
};

export type ConnectedFormMepContactProps = FormMepContactPropsBase & FormikProps<FormMepContactValues>

export const ConnectedFormMepContact = (props : ConnectedFormMepContactProps) => {
  const {
    values: {
      [FormMepContactValuesKeys.EuFractions]: selectedEuFractions,
      [FormMepContactValuesKeys.Countries]: selectedCountries,
      [FormMepContactValuesKeys.NationalParties]: selectedNationalParties
    }
  } = props;

  const database = useContext(ContextDatabase);
  const [meps, setMeps] = useState<FormMepContactValues[FormMepContactValuesKeys.Meps] | undefined>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    execStatement({
      database,
      sql: SELECT_MEPS({})
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
  }, [database]);

  const [filteredMepIds, setFilteredMepIds] = useState<Set<string> | undefined>();

  useEffect(() => {
    execStatement({
      database,
      sql: SELECT_MEP_IDS({
        [SelectMepsGeneralParamsKeys.Countries]: selectedCountries,
        [SelectMepsGeneralParamsKeys.EuFractions]: selectedEuFractions,
        [SelectMepsGeneralParamsKeys.NationalParties]: selectedNationalParties,
      })
    })
    .then((result) => {
      const values = result?.values ?? [];
      const filteredMepIds = new Set<string>(values.map((entry) => (entry[0] as string)));
      setFilteredMepIds(filteredMepIds);
    })
    .catch(setError);
  }, [database, selectedCountries, selectedEuFractions, selectedNationalParties]);

  // TODO loading indicator
  return (
    <>
      {error && <Alert variant={"danger"}>{error.toString()}</Alert>}
      {meps && filteredMepIds && <FormMepContact meps={meps} filteredMepIds={filteredMepIds} {...props} />}
    </>
  );
};

export type FormikConnectedFormMepContactProps = FormMepContactPropsBase & {
  onSubmit: (values : FormMepContactValues) => any
}

export const FormikConnectedFormMepContact = ({
  onSubmit,
  ...rest
} : FormikConnectedFormMepContactProps) =>  (
  <Formik
    initialValues={INITIAL_VALUES}
    onSubmit={(values) => onSubmit(values)}
  >
    {(props) => <ConnectedFormMepContact {...props} {...rest} />}
  </Formik>
);

export default FormikConnectedFormMepContact;
