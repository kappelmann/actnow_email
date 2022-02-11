import React, {
  useContext,
  useEffect,
  useState
} from "react";
import useThrottledEffect  from "use-throttled-effect";
import {
  Formik,
  FormikProps,
  FormikHelpers
} from "formik";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import BootstrapForm from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import ReactCountryFlag from "react-country-flag";

import ExplanationJumbotron from "../../components/ExplanationJumbotron";

import FieldCountries from "../../fields/connected/FieldCountries";
import FieldEuFractions from "../../fields/connected/FieldEuFractions";
import FieldSelectRecipients from "../../fields/FieldSelectRecipients";
import FieldNationalParties from "../../fields/connected/FieldNationalParties";
import FieldCommittees from "../../fields/connected/FieldCommittees";
import FieldRoles from "../../fields/connected/FieldRoles";
import FieldSelect from "../../fields/FieldSelect";
import FieldTable from "../../fields/tables/FieldTable";

import ContextDatabase from "../../contexts/ContextDatabase";

import {
  SELECT_MEPS,
  SelectMepsParamsKeys
} from "../../databases/meps/sqls";
import {
  execStatement,
  resultToObjects
} from "../../databases/utils";

import {
  tableColumns,
  arrayIndexToObject
} from  "../../utils";

import RECIPIENTS_TYPES from "../../consts/recipientsTypes";

export const CONTROL_ID = "form-meps-select";
export const FILTER_THROTTLE_MS = 1000;

export enum FormMepsSelectValuesKeys {
  To = "to",
  Cc = "cc",
  Bcc = "bcc",
  RecipientsType = "recipientsType",
  EuFractions = "euFractions",
  Countries = "countries",
  NationalParties = "parties",
  Committees = "committees",
  Roles = "roles"
}

export enum FormMepsSelectValuesMepsKeys {
  // Note: we sadly cannot do "MepsColumns.MepId" because computed values are not permitted
  MepId = "mep_id",
  Name = "name",
  NationalParty = "party",
  EuFraction = "eu_fraction",
  Email = "email",
  Committees = "committees"
}

export type FormMepsSelectValuesMep = Record<FormMepsSelectValuesMepsKeys, string>;

export type FormMepsSelectValues = {
  [FormMepsSelectValuesKeys.To]: Record<string, FormMepsSelectValuesMep>,
  [FormMepsSelectValuesKeys.Cc]: Record<string, FormMepsSelectValuesMep>,
  [FormMepsSelectValuesKeys.Bcc]: Record<string, FormMepsSelectValuesMep>,
  [FormMepsSelectValuesKeys.RecipientsType]?: string,
  [FormMepsSelectValuesKeys.EuFractions]?: string[],
  [FormMepsSelectValuesKeys.Countries]?: string[],
  [FormMepsSelectValuesKeys.NationalParties]?: string[],
  [FormMepsSelectValuesKeys.Committees]?: string[],
  [FormMepsSelectValuesKeys.Roles]?: string[]
};

const INITIAL_VALUES : FormMepsSelectValues = {
  [FormMepsSelectValuesKeys.To]: {},
  [FormMepsSelectValuesKeys.Cc]: {},
  [FormMepsSelectValuesKeys.Bcc]: {}
};

export type FormMepsSelectPropsBase = {
  initialToIds?: string[],
  initialCcIds?: string[],
  initialBccIds?: string[]
};

export type FormMepsSelectProps = FormMepsSelectPropsBase & FormikProps<FormMepsSelectValues> & {
  mepsData: FormMepsSelectValuesMep[]
};

export const FormMepsSelect = ({
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
    to = {},
    cc = {},
    bcc = {},
    recipientsType
  }
} : FormMepsSelectProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    const meps = arrayIndexToObject(mepsData, FormMepsSelectValuesMepsKeys.MepId);

    // add the the initial selections to the already existing selections
    const update = (selections : typeof to, initialIds : typeof initialToIds, key : string) => {
      if (!initialIds) return;

      const newData = initialIds.reduce((acc, mepId) => ({
        ...acc,
        ...(mepId in meps) && { [mepId]: meps[mepId] }
      }), selections);
      setFieldValue(key, newData);
    };
    update(to, initialToIds, FormMepsSelectValuesKeys.To);
    update(cc, initialCcIds, FormMepsSelectValuesKeys.Cc);
    update(bcc, initialBccIds, FormMepsSelectValuesKeys.Bcc);
  }, [initialToIds, initialCcIds, initialBccIds]);

  const selected = Object.keys(to).length + Object.keys(cc).length + Object.keys(bcc).length !== 0;

  return (
    <>
      <ExplanationJumbotron
        closable={true}
        heading={<h1>{t("Contact MEPs")} <ReactCountryFlag countryCode="EU"/></h1>}
        body={t("MEPs instructions")}
      />
      <BootstrapForm onReset={handleReset} onSubmit={handleSubmit}>
        <FieldCommittees
          controlId={`${CONTROL_ID}-select-committees`}
          name={FormMepsSelectValuesKeys.Committees}
          multiple={true}
          params={{ countries, nationalParties, euFractions, roles }}
        />
        <Row>
          <Col xs={12} md>
            <FieldRoles
              controlId={`${CONTROL_ID}-select-roles`}
              name={FormMepsSelectValuesKeys.Roles}
              multiple={true}
              params={{ countries, nationalParties, euFractions, committees }}
            />
          </Col>
          <Col xs={12} md>
            <FieldCountries
              controlId={`${CONTROL_ID}-select-countries`}
              name={FormMepsSelectValuesKeys.Countries}
              multiple={true}
              params={{ euFractions, nationalParties, committees, roles }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md>
            <FieldNationalParties
              controlId={`${CONTROL_ID}-select-national-parties`}
              name={FormMepsSelectValuesKeys.NationalParties}
              multiple={true}
              params={{ countries, euFractions, committees, roles }}
            />
          </Col>
          <Col xs={12} md>
            <FieldEuFractions
              controlId={`${CONTROL_ID}-select-eu-fractions`}
              name={FormMepsSelectValuesKeys.EuFractions}
              multiple={true}
              params={{ countries, nationalParties, committees, roles }}
            />
          </Col>
        </Row>
        <FieldSelect
          label={t("Recipients type")}
          controlId={`${CONTROL_ID}-recipients-type`}
          options={Object.values(RECIPIENTS_TYPES)}
          getOptionLabel={t}
          defaultValue={RECIPIENTS_TYPES.BCC}
          name={FormMepsSelectValuesKeys.RecipientsType}
        />
        <FieldTable
          name={recipientsType === RECIPIENTS_TYPES.TO
            ? FormMepsSelectValuesKeys.To
            : recipientsType === RECIPIENTS_TYPES.CC
              ? FormMepsSelectValuesKeys.Cc
              : FormMepsSelectValuesKeys.Bcc}
          columns={tableColumns(t, Object.values(FormMepsSelectValuesMepsKeys))}
          getRowId={(mep) => mep[FormMepsSelectValuesMepsKeys.MepId]}
          hiddenColumns={[FormMepsSelectValuesMepsKeys.MepId]}
          data={mepsData}
          entriesPerPageControlId={`${CONTROL_ID}-entries-per-page-meps`}
          paginationControlId={`${CONTROL_ID}-pagination-meps`}
        />
        {0 < Object.keys(to).length &&
          <FieldSelectRecipients
            label={t("To")}
            controlId={`${CONTROL_ID}-to`}
            options={to}
            value={to}
            name={FormMepsSelectValuesKeys.To}
            multiple={true}
            onChange={(selection) => setFieldValue(FormMepsSelectValuesKeys.To, selection)}
            onBlur={handleBlur}
            searchable={false}
          />
        }
        {0 < Object.keys(cc).length &&
          <FieldSelectRecipients
            label={t("Cc")}
            controlId={`${CONTROL_ID}-cc`}
            options={cc}
            value={cc}
            name={FormMepsSelectValuesKeys.Cc}
            multiple={true}
            onChange={(selection) => setFieldValue(FormMepsSelectValuesKeys.Cc, selection)}
            onBlur={handleBlur}
            searchable={false}
          />
        }
        {0 < Object.keys(bcc).length &&
          <FieldSelectRecipients
            label={t("Bcc")}
            controlId={`${CONTROL_ID}-bcc`}
            options={bcc}
            value={bcc}
            name={FormMepsSelectValuesKeys.Bcc}
            multiple={true}
            onChange={(selection) => setFieldValue(FormMepsSelectValuesKeys.Bcc, selection)}
            onBlur={handleBlur}
            searchable={false}
          />
        }
        <Button
          block
          variant="primary"
          disabled={!selected}
          onClick={() => handleSubmit()}
        >
          <FontAwesomeIcon icon={faPen}/>
          {` ${t("Create e-mail template")}`}
        </Button>
      </BootstrapForm>
    </>
  );
};

export type ConnectedFormMepsSelectProps = FormMepsSelectPropsBase & FormikProps<FormMepsSelectValues>

export const ConnectedFormMepsSelect = (props : ConnectedFormMepsSelectProps) => {
  const {
    values: {
      [FormMepsSelectValuesKeys.EuFractions]: selectedEuFractions,
      [FormMepsSelectValuesKeys.Countries]: selectedCountries,
      [FormMepsSelectValuesKeys.NationalParties]: selectedNationalParties,
      [FormMepsSelectValuesKeys.Committees]: selectedCommittees,
      [FormMepsSelectValuesKeys.Roles]: selectedRoles
    }
  } = props;

  const database = useContext(ContextDatabase);
  const [mepsData, setMepsData] = useState<FormMepsSelectProps["mepsData"]>();
  const [throttleMs, setThrottleMs] = useState(0);
  const [error, setError] = useState<Error>();

  useThrottledEffect(() => {
    setThrottleMs(FILTER_THROTTLE_MS);
    execStatement({
      database,
      sql: SELECT_MEPS({
        [SelectMepsParamsKeys.Countries]: selectedCountries,
        [SelectMepsParamsKeys.EuFractions]: selectedEuFractions,
        [SelectMepsParamsKeys.NationalParties]: selectedNationalParties,
        [SelectMepsParamsKeys.Committees]: selectedCommittees,
        [SelectMepsParamsKeys.Roles]: selectedRoles
      })
    })
    .then((result) => setMepsData(resultToObjects(result) as FormMepsSelectValuesMep[]))
    .catch(setError);
  }, throttleMs, [
    database,
    selectedEuFractions,
    selectedCountries,
    selectedNationalParties,
    selectedCommittees,
    selectedRoles
  ]);

  if (error) return <Alert variant={"danger"}>{error.toString()}</Alert>;
  return !mepsData
    ? <Spinner animation="border" role="status" />
    : <FormMepsSelect mepsData={mepsData} {...props} />;
};

export type FormikConnectedFormMepsSelectProps = FormMepsSelectPropsBase & {
  onSubmit: (values : FormMepsSelectValues, actions : FormikHelpers<FormMepsSelectValues>) => void | Promise<any>;
}

export const FormikConnectedFormMepsSelect = ({
  onSubmit,
  ...rest
} : FormikConnectedFormMepsSelectProps) =>  (
  <Formik
    initialValues={INITIAL_VALUES}
    onSubmit={onSubmit}
  >
    {(props) => <ConnectedFormMepsSelect {...props} {...rest} />}
  </Formik>
);

export default FormikConnectedFormMepsSelect;
