import React, {
  useEffect,
  useContext,
  useState
} from "react";
import {
  Formik,
  FormikProps,
  FormikHelpers
} from "formik";
import { useTranslation } from "react-i18next";

import BootstrapForm from "react-bootstrap/Form";
import Toast from "../../components/Toast";
import ShareBar from "../../components/ShareBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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
import MAIL_TYPES from "../../consts/mailTypes";

export const CONTROL_ID = "form-write";
export const WINDOW_HREF_UPDATE_DELAY = 200;

export enum FormWriteValuesKeys {
  Meps = "meps",
  MailType = "mailType",
  MailSubject = "mailSubject",
  MailBody = "mailBody"
}

export type FormWriteValues = {
  [FormWriteValuesKeys.Meps]: Record<string, FormMepContactValuesMep>,
  [FormWriteValuesKeys.MailType]: string,
  [FormWriteValuesKeys.MailSubject]: string,
  [FormWriteValuesKeys.MailBody]: string
};

export type FormWritePropsBase = {
  onBack: (values : FormWriteValues) => any
}

export type FormWriteProps = FormWritePropsBase & FormikProps<FormWriteValues>;

export const FormWrite = ({
  handleBlur,
  handleReset,
  handleSubmit,
  submitForm,
  setFieldValue,
  onBack,
  values: {
    meps,
    mailType,
    mailSubject,
    mailBody,
    ...valuesRest
  }
} : FormWriteProps) => {
  const [showCopyToast, setShowCopyToast] = useState(false);
  const { t } = useTranslation();
  const sortedMepIds = React.useMemo(() => sortMeps(meps), [meps, Object.keys(meps).length]);
  const [allMeps] = useState(meps);
  const [allSortedMepIds] = useState(sortedMepIds);

  const shareUrl = window.location.href;

  const onSubmit = (event : React.FormEvent<HTMLFormElement>) => {
    handleSubmit(event);
    // open the mail client
    window.location.href = `mailto:?${stringifyQueryParamsCommas({
      [mailType.toLowerCase()]: sortedMepIds.map((mepId) => meps[mepId].email),
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
      <Row>
        <Col md={2}>
          <FieldSelectWithLabel
            label={t("Type")}
            controlId={`${CONTROL_ID}-selected`}
            name={FormWriteValuesKeys.MailType}
            options={Object.values(MAIL_TYPES)}
            value={mailType}
            multiple={false}
            searchable={false}
            getOptionLabel={(option) => option}
            onChange={(option) => {
              setFieldValue(FormWriteValuesKeys.MailType, option);
            }}
            onBlur={handleBlur}
          />
        </Col>
        <Col>
          <FieldSelectWithLabel
            label={t("Recipients")}
            controlId={`${CONTROL_ID}-selected`}
            noOptionsMessage={() => t("Missing selection instructions")}
            options={allSortedMepIds}
            searchable={false}
            name={FormWriteValuesKeys.Meps}
            multiple={true}
            isClearable={false}
            value={sortedMepIds}
            getOptionLabel={(mepId) => allMeps[mepId].name}
            onChange={(mepIds) => {
              const newSelection = isNonEmptyStringArray(mepIds)
                ? (mepIds as string []).reduce((acc, mepId) => ({
                  ...acc,
                  [mepId]: allMeps[mepId]
                }), {})
                : {};
              setFieldValue(FormWriteValuesKeys.Meps, newSelection);
            }}
            onBlur={handleBlur}
          />
        </Col>
      </Row>
      <FieldText
        label={t("Subject")}
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
          setShowCopyToast(true);
          // wait for the winow location to update
          setTimeout(() => {
            copy(window.location.href);
          }, WINDOW_HREF_UPDATE_DELAY);
        }}
      >
        <FontAwesomeIcon icon={faShare}/>
        {` ${t("Create link and copy to clipboard")}`}
      </Button>
      <Toast
        onClose={() => setShowCopyToast(false)}
        show={showCopyToast}
      >
        {`${t("Link copied to clipboard")} `}
        <FontAwesomeIcon icon={faCopy}/>
      </Toast>
      <ShareBar
        url={() => {
          submitForm();
          // wait for the winow location to update
          return new Promise((resolve) => setTimeout(resolve, WINDOW_HREF_UPDATE_DELAY))
          .then(() => window.location.href);
        }}
      />
      <Row className="justify-content-center m-3">
        <QRCode
          size={192}
          value={shareUrl}
        />
      </Row>
      <Button
        block
        variant="secondary"
        onClick={() => onBack({
          meps,
          mailType,
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
  onSubmit: (values : FormWriteValues, actions : FormikHelpers<FormWriteValues>) => any
};

export const FormikFormWrite = ({
  meps,
  mailType,
  mailSubject,
  mailBody,
  onSubmit,
  ...rest
}: FormikFormWriteProps) => {
  const mailTypeUpper = mailType.toUpperCase();
  return (
    <Formik
      initialValues={{
        [FormWriteValuesKeys.Meps]: meps,
        [FormWriteValuesKeys.MailType]: mailTypeUpper in MAIL_TYPES ? (MAIL_TYPES as Record<string,string>)[mailTypeUpper] : MAIL_TYPES.BCC,
        [FormWriteValuesKeys.MailSubject]: mailSubject,
        [FormWriteValuesKeys.MailBody]: mailBody
      }}
      onSubmit={onSubmit}
    >
      {(props) => <FormWrite {...rest} {...props} />}
    </Formik>
  );
};

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
