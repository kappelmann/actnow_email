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
import Toast from "react-bootstrap/Toast";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import QRCode from "qrcode.react";
import copy from "copy-to-clipboard";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faShare,
  faCopy
} from "@fortawesome/free-solid-svg-icons";

import {
  FormMepContactValuesMep,
  FormMepContactValuesMepsKeys
} from "../connected/FormMepContact";
import ExplanationJumbotron from "../../components/ExplanationJumbotron";
import FieldTextArea from "../../fields/FieldTextArea";
import FieldText from "../../fields/FieldText";
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
  stringifyQueryParamsCommas,
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
  submitForm,
  setFieldValue,
  onBack,
  values: {
    meps,
    mailSubject,
    mailBody,
    ...valuesRest
  }
} : FormWriteProps) => {
  const [copyLink, setCopyLink] = useState(false);
  const { t } = useTranslation();
  const sortedMepIds = React.useMemo(() => sortMeps(meps), [meps, Object.keys(meps).length]);

  // we need to wait for the URL to change before we can copy it
  useEffect(() => {
    if (copyLink) {
      copy(window.location.href);
    }
  }, [window.location.href]);

  const onSubmit = (event : React.FormEvent<HTMLFormElement>) => {
    handleSubmit(event);
    // open the mail client
    window.location.href = `mailto:?${stringifyQueryParamsCommas({
      bcc: sortedMepIds.map((mepId) => meps[mepId].email),
      subject: mailSubject,
      body: mailBody
    })}`;
  };

  return (
    <BootstrapForm onReset={handleReset} onSubmit={onSubmit}>
      <ExplanationJumbotron
        heading={t("Almost Done...")}
        text={t("Write mail instructions")}
        closable={true}
      />
      <FieldSelectWithLabel
        label={t("E-mail recipients")}
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
      <FieldText
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
      <Button block variant="primary" type="submit">
        <FontAwesomeIcon icon={faEnvelope}/>
        {` ${t("Open e-mail client")}`}
      </Button>
      <Button
        block
        variant="primary"
        onClick={() => {
          submitForm();
          setCopyLink(true);
        }}
      >
        <FontAwesomeIcon icon={faShare}/>
        {` ${t("Create link and copy to clipboard")}`}
      </Button>
      <Toast
        style={{
          position: "fixed",
          top: 0,
          right: 0
        }}
        onClose={() => setCopyLink(false)}
        show={copyLink}
        autohide
      >
        <Toast.Body>
          {`${t("Link copied to clipboard")} `}
          <FontAwesomeIcon icon={faCopy}/>
        </Toast.Body>
      </Toast>
      <Row className="justify-content-center m-3">
        <QRCode
          size={192}
          value={window.location.href}
        />
      </Row>
      <Button
        block
        variant="secondary"
        onClick={() => onBack({
          meps,
          mailSubject,
          mailBody,
          ...valuesRest
        })}>
        {t("Back to recipient selection")}
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
