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
import { faPen } from "@fortawesome/free-solid-svg-icons";

import ExplanationJumbotron from "../../components/ExplanationJumbotron";
import ExpandButton from "../../components/ExpandButton";

import FieldCountries from "../../fields/connected/FieldCountries";
import FieldEuFractions from "../../fields/connected/FieldEuFractions";
import FieldMeps from "../../fields/FieldMeps";
import FieldNationalParties from "../../fields/connected/FieldNationalParties";
import FieldCommittees from "../../fields/connected/FieldCommittees";
import FieldRoles from "../../fields/connected/FieldRoles";
import FieldSelect from "../../fields/FieldSelect";
import FieldText from "../../fields/FieldText";
import FieldTable from "../../fields/tables/FieldTable";

import ContextDatabase from "../../contexts/ContextDatabase";

import {
  SELECT_MEPS,
  SelectMepsParamsKeys
} from "../../database/sqls";
import {
  execStatement,
  resultToObjects
} from "../../database/utils";

import {
  tableColumns,
  arrayIndexToObject
} from  "../../utils";

import RECIPIENTS_TYPES from "../../consts/recipientsTypes";

export const CONTROL_ID = "form-mep-contact";

export enum FormMepContactValuesKeys {
  To = "to",
  Cc = "cc",
  Bcc = "bcc",
  RecipientsType = "recipientsType",
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
  [FormMepContactValuesKeys.To]: Record<string, FormMepContactValuesMep>,
  [FormMepContactValuesKeys.Cc]: Record<string, FormMepContactValuesMep>,
  [FormMepContactValuesKeys.Bcc]: Record<string, FormMepContactValuesMep>,
  [FormMepContactValuesKeys.RecipientsType]?: string,
  [FormMepContactValuesKeys.EuFractions]?: string[],
  [FormMepContactValuesKeys.Countries]?: string[],
  [FormMepContactValuesKeys.NationalParties]?: string[],
  [FormMepContactValuesKeys.Committees]?: string[],
  [FormMepContactValuesKeys.Roles]?: string[],
  [FormMepContactValuesKeys.Filter]?: string
};

const INITIAL_VALUES : FormMepContactValues = {
  [FormMepContactValuesKeys.To]: {},
  [FormMepContactValuesKeys.Cc]: {},
  [FormMepContactValuesKeys.Bcc]: {}
};

export type FormMepContactPropsBase = {
  initialToIds?: string[],
  initialCcIds?: string[],
  initialBccIds?: string[]
};

export type FormMepContactProps = FormMepContactPropsBase & FormikProps<FormMepContactValues> & {
  mepsData: FormMepContactValuesMep[]
};

export const FormMepContact = ({
  handleBlur,
  handleReset,
  handleSubmit,
  setFieldValue,
  initialToIds,
  initialCcIds,
  initialBccIds,
  mepsData,
  values: {
    countries,
    euFractions,
    parties: nationalParties,
    committees,
    roles,
    to,
    cc,
    bcc,
    recipientsType
  }
} : FormMepContactProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const meps = arrayIndexToObject(mepsData, FormMepContactValuesMepsKeys.MepId);

    // add the the initial selections to the already existing selections
    const update = (selections : typeof to, initialIds : typeof initialToIds, key : string) => {
      if (!initialIds) return;

      const newData = initialIds.reduce((acc, mepId) => ({
        ...acc,
        ...(mepId in meps) && { [mepId]: meps[mepId] }
      }), selections);
      setFieldValue(key, newData);
    };
    update(to, initialToIds, FormMepContactValuesKeys.To);
    update(cc, initialCcIds, FormMepContactValuesKeys.Cc);
    update(bcc, initialBccIds, FormMepContactValuesKeys.Bcc);
  }, [initialToIds, initialCcIds, initialBccIds]);

  const selected = Object.keys(to).length + Object.keys(cc).length + Object.keys(bcc).length !== 0;

  return (
    <>
      <ExplanationJumbotron
        closable={true}
        heading={t("Contact MEPs")}
        text={t("MEPs instructions")}
      />
      {/*TODO: where is this type error coming from?*/}
      <BootstrapForm onReset={handleReset} onSubmit={handleSubmit}>
        <Row className="align-items-end">
          <Col md={10}>
            <FieldText
              label={t("Search")}
              controlId={`${CONTROL_ID}-search`}
              placeholder={t("entryWithCount", { count : mepsData.length })}
              name={FormMepContactValuesKeys.Filter}
            />
          </Col>
          <Col>
            <ExpandButton
              className="mb-3"
              onClick={setFiltersOpen}
              label={t("Filters")}
            />
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
        <FieldSelect
          label={t("Recipients type")}
          controlId={`${CONTROL_ID}-recipients-type`}
          options={Object.values(RECIPIENTS_TYPES)}
          getOptionLabel={t}
          defaultValue={RECIPIENTS_TYPES.BCC}
          name={FormMepContactValuesKeys.RecipientsType}
        />
        <FieldTable
          name={recipientsType === RECIPIENTS_TYPES.TO
            ? FormMepContactValuesKeys.To
            : recipientsType === RECIPIENTS_TYPES.CC
              ? FormMepContactValuesKeys.Cc
              : FormMepContactValuesKeys.Bcc}
          columns={tableColumns(t, Object.values(FormMepContactValuesMepsKeys))}
          getRowId={(mep) => mep[FormMepContactValuesMepsKeys.MepId]}
          hiddenColumns={[FormMepContactValuesMepsKeys.MepId]}
          data={mepsData}
          entriesPerPageControlId={`${CONTROL_ID}-entries-per-page-meps`}
          paginationControlId={`${CONTROL_ID}-pagination-meps`}
        />
        {/* TODO: note if nothing is selected !selected && t("Select MEPs in the table above") */}
        {0 < Object.keys(to).length && <FieldMeps
          label={t("To")}
          controlId={`${CONTROL_ID}-to`}
          options={to}
          value={to}
          name={FormMepContactValuesKeys.To}
          multiple={true}
          onChange={(selection) => setFieldValue(FormMepContactValuesKeys.To, selection)}
          onBlur={handleBlur}
        />}
        {0 < Object.keys(cc).length && <FieldMeps
          label={t("Cc")}
          controlId={`${CONTROL_ID}-cc`}
          options={cc}
          value={cc}
          name={FormMepContactValuesKeys.Cc}
          multiple={true}
          onChange={(selection) => setFieldValue(FormMepContactValuesKeys.Cc, selection)}
          onBlur={handleBlur}
        />}
        {0 < Object.keys(bcc).length && <FieldMeps
          label={t("Bcc")}
          controlId={`${CONTROL_ID}-bcc`}
          options={bcc}
          value={bcc}
          name={FormMepContactValuesKeys.Bcc}
          multiple={true}
          onChange={(selection) => setFieldValue(FormMepContactValuesKeys.Bcc, selection)}
          onBlur={handleBlur}
        />}
        <Button
          block
          variant="primary"
          type="submit"
          disabled={!selected}
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
