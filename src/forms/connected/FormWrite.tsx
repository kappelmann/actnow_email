import React, {
  useEffect,
  useContext, useState
} from "react";
import {
  Formik,
  FormikProps
} from "formik";
import { useTranslation } from "react-i18next";

import BootstrapForm from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import {
  FormMepContactValuesMep,
  FormMepContactValuesMepsKeys
} from "../connected/FormMepContact";
import ExplanationJumbotron from "../../components/ExplanationJumbotron";
import FieldTextArea from "../../fields/FieldTextArea";
import FieldSearch from "../../fields/FieldSearch";
import { FieldSelectWithLabel } from "../../fields/FieldSelect";

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
  arrayIndexToObject,
  isNonEmptyStringArray,
  sortMeps
} from "../../utils";

export const CONTROL_ID = "form-write";

export enum FormWriteValuesKeys {
  Meps = "meps",
  MailSubject = "mailSubject",
  MailBody = "mailBody"
}

export type FormWriteValues = {
  [FormWriteValuesKeys.Meps]: Record<string, FormMepContactValuesMep>,
  [FormWriteValuesKeys.MailSubject]: string,
  [FormWriteValuesKeys.MailBody]: string
};

export type FormWritePropsBase = {
  onBack: (values : FormWriteValues) => any
}

export type FormWriteProps = FormWritePropsBase & FormikProps<FormWriteValues>;

export const FormWrite = ({
  handleReset,
  handleSubmit,
  setFieldValue,
  onBack,
  values: {
    meps,
    ...valuesRest
  }
} : FormWriteProps) => {
  const { t } = useTranslation();
  const sortedMepIds = React.useMemo(() => sortMeps(meps), [meps, Object.keys(meps).length]);

  return (
    <BootstrapForm onReset={handleReset} onSubmit={handleSubmit}>
      <ExplanationJumbotron
        heading={t("Almost Done...")}
        text={t("Write mail instructions")}
        closable={true}
      />
      <FieldSearch
        label={t("E-mail subject")}
        controlId={`${CONTROL_ID}-mail-subject`}
        name={FormWriteValuesKeys.MailSubject}
      />
      <FieldTextArea
        label={t("E-mail body")}
        controlId={`${CONTROL_ID}-mail-body`}
        name={FormWriteValuesKeys.MailBody}
        rows={12}
      />
      <FieldSelectWithLabel
        label={t("Your selections")}
        controlId={`${CONTROL_ID}-selected`}
        placeholder={t("No selection go back")}
        noOptionsMessage={() => t("Missing selection instructions")}
        options={[]}
        searchable={false}
        name={FormWriteValuesKeys.Meps}
        multiple={true}
        value={sortedMepIds}
        getOptionLabel={(mepId) => meps[mepId].name}
        onChange={(mepIds) => {
          const newSelection = isNonEmptyStringArray(mepIds)
            ? (mepIds as string []).reduce((acc, mepId) => ({
              ...acc,
              [mepId]: meps[mepId]
            }), {})
            : {};
          setFieldValue(FormWriteValuesKeys.Meps, newSelection);
        }}
        onBlur={() => {}}
      />
      <Button block variant="primary" type="submit">
        {t("Open e-mail client and create link")}
      </Button>
      <Button block variant="secondary" onClick={() => onBack({ meps, ...valuesRest })}>
        {t("Back")}
      </Button>
    </BootstrapForm>
  );
};

export type FormikFormWriteProps = FormWritePropsBase & FormWriteValues & {
  onSubmit: (values : FormWriteValues) => any
};

export const FormikFormWrite = ({
  meps,
  mailSubject,
  mailBody,
  onSubmit,
  ...rest
}: FormikFormWriteProps) => (
  <Formik
    initialValues={{
      [FormWriteValuesKeys.Meps]: meps,
      [FormWriteValuesKeys.MailSubject]: mailSubject,
      [FormWriteValuesKeys.MailBody]: mailBody
    }}
    onSubmit={onSubmit}
  >
    {(props) => <FormWrite {...rest} {...props} />}
  </Formik>
);

export type ConnectedFormWriteProps = Omit<FormikFormWriteProps, "meps"> & {
  mepIds: string[]
};

export const ConnectedFormWrite = ({
  mepIds,
  ...rest
} : ConnectedFormWriteProps) => {
  const database = useContext(ContextDatabase);
  const [meps, setMeps] = useState<FormikFormWriteProps["meps"]>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    execStatement({
      database,
      sql: SELECT_MEPS({
        [SelectMepsParamsKeys.MepIds]: mepIds
      })
    })
    .then((result) => {
      const mepsData = resultToObjects(result) as FormMepContactValuesMep[];
      const meps = arrayIndexToObject(mepsData, FormMepContactValuesMepsKeys.MepId);
      setMeps(meps);
    })
    .catch(setError);
  }, [database, mepIds]);


  if (error) return <Alert variant={"danger"}>{error.toString()}</Alert>;
  // TODO: loading indicator
  return meps ? <FormikFormWrite meps={meps} {...rest} /> : null;
};

export default ConnectedFormWrite;
