import React, {
  useContext,
  useEffect,
  useState
} from "react";
import {
  Formik,
  FormikProps,
  FormikHelpers
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
  faPlusSquare,
  faPen
} from "@fortawesome/free-solid-svg-icons";

import ExplanationJumbotron from "../../components/ExplanationJumbotron";

import FieldCountries from "../../fields/connected/FieldCountries";
import FieldEuFractions from "../../fields/connected/FieldEuFractions";
import FieldNationalParties from "../../fields/connected/FieldNationalParties";
import FieldCommittees from "../../fields/connected/FieldCommittees";
import FieldRoles from "../../fields/connected/FieldRoles";
import FieldText from "../../fields/FieldText";
import { FieldSelectWithLabel } from "../../fields/FieldSelect";
import FieldTable from "../../fields/tables/FieldTable";

import ContextDatabase from "../../contexts/ContextDatabase";

import { SELECT_MEPS, SelectMepsParamsKeys } from "../../database/sqls";
import {
  execStatement,
  resultToObjects
} from "../../database/utils";

import {
  tableColumns,
  arrayIndexToObject,
  isNonEmptyStringArray,
  sortMeps
} from  "../../utils";

export const CONTROL_ID = "form-mep-contact";

export enum FormMepContactValuesKeys {
  Meps = "meps",
  EuFractions = "euFractions",
  Countries = "countries",
  NationalParties = "parties",
  Committees = "committees",
  Roles = "roles",
  Filter = "filter"
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
  [FormMepContactValuesKeys.Meps]: Record<string, FormMepContactValuesMep>,
  [FormMepContactValuesKeys.EuFractions]?: string[],
  [FormMepContactValuesKeys.Countries]?: string[],
  [FormMepContactValuesKeys.NationalParties]?: string[],
  [FormMepContactValuesKeys.Committees]?: string[],
  [FormMepContactValuesKeys.Roles]?: string[],
  [FormMepContactValuesKeys.Filter]?: string
};

const INITIAL_VALUES : FormMepContactValues = {
  [FormMepContactValuesKeys.Meps]: {}
};

export type FormMepContactPropsBase = {
  initialMepIds?: string[]
};

export type FormMepContactProps = FormMepContactPropsBase & FormikProps<FormMepContactValues> & {
  mepsData: FormMepContactValuesMep[]
};

export const FormMepContact = ({
  handleBlur,
  handleReset,
  handleSubmit,
  setFieldValue,
  initialMepIds,
  mepsData,
  values: {
    countries,
    euFractions,
    parties: nationalParties,
    committees,
    roles,
    meps: selectedMeps
  }
} : FormMepContactProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { t } = useTranslation();
  const sortedMepIds = React.useMemo(() => sortMeps(selectedMeps), [selectedMeps, Object.keys(selectedMeps).length]);

  useEffect(() => {
    if (!initialMepIds) return;
    const meps = arrayIndexToObject(mepsData, FormMepContactValuesMepsKeys.MepId);

    // add the the initial selections to the already existing selection
    const newSelection = initialMepIds.reduce((acc, mepId) => ({
      ...acc,
      ...(mepId in meps) && { [mepId]: meps[mepId] }
    }), selectedMeps);
    setFieldValue(FormMepContactValuesKeys.Meps, newSelection);
  }, [initialMepIds]);

  return (
    <>
      <ExplanationJumbotron
        closable={true}
        heading={t("Contact MEPs")}
        text={t("MEPs instructions")}
      />
      <BootstrapForm onReset={handleReset} onSubmit={handleSubmit}>
        <Row className="align-items-center">
          <Col md={10}>
            <FieldText
              label={t("Search")}
              controlId={`${CONTROL_ID}-search`}
              placeholder={t("entryWithCount", { count : mepsData.length })}
              name={FormMepContactValuesKeys.Filter}
            />
          </Col>
          <Col>
            <Button
              block
              variant="secondary"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="mb-3-md"
              aria-expanded={filtersOpen}
            >
              <FontAwesomeIcon icon={filtersOpen ? faMinusSquare : faPlusSquare} fixedWidth />
              {` ${t("Filters")}`}
            </Button>
          </Col>
        </Row>
        <Collapse in={filtersOpen}>
          <div>
            <Row>
              <Col xs={12} md>
                <FieldCountries
                  controlId={`${CONTROL_ID}-select-countries`}
                  name={FormMepContactValuesKeys.Countries}
                  multiple={true}
                  params={{ euFractions, nationalParties, committees, roles }}
                />
              </Col>
              <Col xs={12} md>
                <FieldNationalParties
                  controlId={`${CONTROL_ID}-select-national-parties`}
                  name={FormMepContactValuesKeys.NationalParties}
                  multiple={true}
                  params={{ countries, euFractions, committees, roles }}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md>
                <FieldEuFractions
                  controlId={`${CONTROL_ID}-select-eu-fractions`}
                  name={FormMepContactValuesKeys.EuFractions}
                  multiple={true}
                  params={{ countries, nationalParties, committees, roles }}
                />
              </Col>
              <Col xs={12} md>
                <FieldRoles
                  controlId={`${CONTROL_ID}-select-roles`}
                  name={FormMepContactValuesKeys.Roles}
                  multiple={true}
                  params={{ countries, nationalParties, euFractions, committees }}
                />
              </Col>
            </Row>
            <FieldCommittees
              controlId={`${CONTROL_ID}-select-committees`}
              name={FormMepContactValuesKeys.Committees}
              multiple={true}
              params={{ countries, nationalParties, euFractions, roles }}
            />
          </div>
        </Collapse>
        <FieldTable
          name={FormMepContactValuesKeys.Meps}
          columns={tableColumns(t, Object.values(FormMepContactValuesMepsKeys))}
          getRowId={(mep) => mep[FormMepContactValuesMepsKeys.MepId]}
          hiddenColumns={[FormMepContactValuesMepsKeys.MepId]}
          data={mepsData}
          entriesPerPageControlId={`${CONTROL_ID}-entries-per-page-meps`}
          paginationControlId={`${CONTROL_ID}-pagination-meps`}
        />
        <FieldSelectWithLabel
          label={t("Selected MEPs")}
          controlId={`${CONTROL_ID}-selected-meps`}
          placeholder={t("Select MEPs in the table above")}
          noOptionsMessage={() => t("Select MEPs in the table above")}
          options={[]}
          searchable={false}
          name={FormMepContactValuesKeys.Meps}
          multiple={true}
          value={sortedMepIds}
          getOptionLabel={(mepId) => selectedMeps[mepId].name}
          onChange={(mepIds) => {
            const newSelection = isNonEmptyStringArray(mepIds)
              ? (mepIds as string []).reduce((acc, mepId) => ({
                ...acc,
                [mepId]: selectedMeps[mepId]
              }), {})
              : {};
            setFieldValue(FormMepContactValuesKeys.Meps, newSelection);
          }}
          onBlur={handleBlur}
        />
        <Button
          block
          variant="primary"
          type="submit"
          disabled={Object.keys(selectedMeps).length === 0}
        >
          <FontAwesomeIcon icon={faPen}/>
          {` ${t("Create e-mail link and template")}`}
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
      [FormMepContactValuesKeys.NationalParties]: selectedNationalParties,
      [FormMepContactValuesKeys.Committees]: selectedCommittees,
      [FormMepContactValuesKeys.Roles]: selectedRoles,
      [FormMepContactValuesKeys.Filter]: filter
    }
  } = props;

  const database = useContext(ContextDatabase);
  const [mepsData, setMepsData] = useState<FormMepContactProps["mepsData"]>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    execStatement({
      database,
      sql: SELECT_MEPS({
        [SelectMepsParamsKeys.Countries]: selectedCountries,
        [SelectMepsParamsKeys.EuFractions]: selectedEuFractions,
        [SelectMepsParamsKeys.NationalParties]: selectedNationalParties,
        [SelectMepsParamsKeys.Committees]: selectedCommittees,
        [SelectMepsParamsKeys.Roles]: selectedRoles,
        [SelectMepsParamsKeys.Filter]: filter
      })
    })
    .then((result) => setMepsData(resultToObjects(result) as FormMepContactValuesMep[]))
    .catch(setError);
  }, [
    database,
    selectedEuFractions,
    selectedCountries,
    selectedNationalParties,
    selectedCommittees,
    selectedRoles,
    filter
  ]);

  if (error) return <Alert variant={"danger"}>{error.toString()}</Alert>;
  // TODO loading indicator
  return mepsData ? <FormMepContact mepsData={mepsData} {...props} /> : null;
};

export type FormikConnectedFormMepContactProps = FormMepContactPropsBase & {
  onSubmit: (values : FormMepContactValues, actions : FormikHelpers<FormMepContactValues>) => any
}

export const FormikConnectedFormMepContact = ({
  onSubmit,
  ...rest
} : FormikConnectedFormMepContactProps) =>  (
  <Formik
    initialValues={INITIAL_VALUES}
    onSubmit={onSubmit}
  >
    {(props) => <ConnectedFormMepContact {...props} {...rest} />}
  </Formik>
);

export default FormikConnectedFormMepContact;
