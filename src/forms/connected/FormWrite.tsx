import React, {
  useEffect,
  useContext,
  useState
} from "react";
import {
  Formik,
  FormikProps
} from "formik";
import { useTranslation } from "react-i18next";
import EmailValidator from "email-validator";

import BootstrapForm from "react-bootstrap/Form";
import Collapse from "react-bootstrap/Collapse";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { QRCode } from "react-qr-svg";
import * as clipboard from "clipboard-polyfill/text";

import ExpandButton from "../../components/ExpandButton";
import Toast from "../../components/Toast";
import ShareBar from "../../components/ShareBar";

import URLS from "../../consts/urls";

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
import FieldMeps from "../../fields/FieldMeps";
import {
  ConnectedFieldSelect as FieldSelect,
  ConnectedFieldSelectWithLabel as FieldSelectWithLabel
} from "../../fields/FieldSelect";
import FieldTextArea from "../../fields/FieldTextArea";
import {
  ConnectedFieldTextWithLabel,
  FieldText
} from "../../fields/FieldText";
import FieldCheckbox from "../../fields/FieldCheckbox";

import ContextDatabase from "../../contexts/ContextDatabase";
import {
  SELECT_MEPS,
  SelectMepsParamsKeys
} from "../../database/sqls";
import {
  execStatement,
  resultToObjects
} from "../../database/utils";

import { shortenLink } from "../../clients/shortLinkClient";

import {
  arrayIndexToObject,
  stringifyQueryParamsCommas,
  sortMeps
} from "../../utils";
// import MAIL_TYPES from "../../consts/mailTypes";

export const CONTROL_ID = "form-write";

export enum FormWriteValuesKeys {
  ToData = "toData",
  CcData = "ccData",
  BccData = "bccData",
  To = "to",
  Cc = "cc",
  Bcc = "bcc",
  MailSubject = "mailSubject",
  MailBody = "mailBody",
  ShortAlias = "shortAlias",
  Open = "open"
}

export type FormWriteValues = {
  [FormWriteValuesKeys.ToData]: Record<string, FormMepContactValuesMep> | undefined,
  [FormWriteValuesKeys.CcData]: Record<string, FormMepContactValuesMep> | undefined,
  [FormWriteValuesKeys.BccData]: Record<string, FormMepContactValuesMep> | undefined,
  [FormWriteValuesKeys.To]: string[] | undefined,
  [FormWriteValuesKeys.Cc]: string[] | undefined,
  [FormWriteValuesKeys.Bcc]: string[] | undefined,
  [FormWriteValuesKeys.MailSubject]: string | undefined,
  [FormWriteValuesKeys.MailBody]: string | undefined,
  [FormWriteValuesKeys.ShortAlias]: string | undefined,
  [FormWriteValuesKeys.Open]: boolean | undefined
};

export type FormWritePropsBase = {
  onBack?: (values : FormWriteValues) => any,
  updateLink: (values : FormWriteValues) => Promise<any>,
  initialOpen?: boolean
}

export type FormWriteProps = FormWritePropsBase & FormikProps<FormWriteValues>;

export const FormWrite = ({
  handleBlur,
  handleReset,
  handleSubmit,
  setFieldValue,
  onBack,
  updateLink,
  values,
  initialOpen
} : FormWriteProps) => {
  const {
    toData = {},
    ccData = {},
    bccData = {},
    to = [],
    cc = [],
    bcc = [],
    mailSubject = "",
    mailBody = "",
    shortAlias
  } = values;

  const [showCopyToast, setShowCopyToast] = useState(false);
  const { t } = useTranslation();
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<Error>();
  const [toMeps] = useState(toData);
  const [ccMeps] = useState(ccData);
  const [bccMeps] = useState(bccData);

  const hasToData = Object.keys(toMeps).length > 0;
  const hasCcData = Object.keys(ccMeps).length > 0;
  const hasBccData = Object.keys(bccMeps).length > 0;

  const [toOpen, setToOpen] = useState(!hasToData || to.length > 0);
  const [ccOpen, setCcOpen] = useState(!hasCcData || cc.length > 0);
  const [bccOpen, setBccOpen] = useState(!hasBccData || bcc.length > 0);

  const openMailClient = () => {
    window.location.href = `mailto:?${stringifyQueryParamsCommas({
      // TODO: fix for types other than meps
      to: [...sortMeps(toData).map((mepId) => toData[mepId].email), ...to],
      cc: [...sortMeps(ccData).map((mepId) => ccData[mepId].email), ...cc],
      bcc: [...sortMeps(bccData).map((mepId) => bccData[mepId].email), ...bcc],
      subject: mailSubject,
      body: mailBody
    })}`;
  };

  React.useEffect(() => {
    if (initialOpen) openMailClient();
  }, []);

  const onSubmit = (event : React.FormEvent<HTMLFormElement>) => {
    handleSubmit(event);
    openMailClient();
  };

  return (
    <BootstrapForm onReset={handleReset} onSubmit={onSubmit}>
      <ExplanationJumbotron
        heading={`${t("Almost Done")}...`}
        text={t("Write mail instructions")}
        closable={true}
      />
      {[
        {
          hasSelection: hasToData,
          label: t("To"),
          controlId: `${CONTROL_ID}-to-selected`,
          options: toMeps,
          valueSelection: toData,
          nameSelection: FormWriteValuesKeys.ToData,
          name: FormWriteValuesKeys.To,
          open: toOpen,
          setOpen: setToOpen
        },
        {
          hasSelection: hasCcData,
          label: t("Cc"),
          controlId: `${CONTROL_ID}-cc-selected`,
          options: ccMeps,
          valueSelection: ccData,
          nameSelection: FormWriteValuesKeys.CcData,
          name: FormWriteValuesKeys.Cc,
          open: ccOpen,
          setOpen: setCcOpen
        },
        {
          hasSelection: hasBccData,
          label: t("Bcc"),
          controlId: `${CONTROL_ID}-bcc-selected`,
          options: bccMeps,
          valueSelection: bccData,
          nameSelection: FormWriteValuesKeys.BccData,
          name: FormWriteValuesKeys.Bcc,
          open: bccOpen,
          setOpen: setBccOpen
        }
      ].map(({hasSelection, label, controlId, options, valueSelection, nameSelection, name, open, setOpen}, key) => {
        const selectCommonProps = {
          name,
          noOptionsMessage: () => t("Enter more e-mail addresses here"),
          options: [],
          isValidNewOption: EmailValidator.validate,
          formatCreateLabel: () => `${t("Add e-mail")}...`,
          creatable: true,
          multiple: true
        };

        return (
          <React.Fragment key={key}>
            {hasSelection &&
              <Row className="align-items-end" >
                <Col>
                  <FieldMeps
                    label={label}
                    controlId={controlId}
                    noOptionsMessage={() => t("Missing selection instructions")}
                    options={options}
                    value={valueSelection}
                    name={nameSelection}
                    multiple={true}
                    isClearable={false}
                    onChange={(selection) => setFieldValue(nameSelection, selection)}
                    onBlur={handleBlur}
                  />
                </Col>
                <Col md={2} className="mb-3">
                  <ExpandButton
                    initialValue={open}
                    onClick={setOpen}
                    label={`${label} ${t("Recipients")}`}
                  />
                </Col>
              </Row>
            }
            <Collapse in={open} className="mb-3">
              <div>
                {hasSelection
                  ? <FieldSelect {...selectCommonProps}/>
                  : <FieldSelectWithLabel label={label} controlId={controlId} {...selectCommonProps} />
                }
              </div>
            </Collapse>
          </React.Fragment>
        );
      })}
      <ConnectedFieldTextWithLabel
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
      <Button className="mb-3" block variant="primary" type="submit">
        <FontAwesomeIcon icon={faEnvelope}/>
        {` ${t("Open e-mail client")}`}
      </Button>
      <ConnectedFieldTextWithLabel
        controlId={`${CONTROL_ID}-short-alias`}
        label={t("Short alias")}
        name={FormWriteValuesKeys.ShortAlias}
        placeholder={`${t("(Optional) Enter custom alias")}...`}
      />
      <Row className="mt-3 mb-3 align-items-center">
        <Col xs={12} md className="mb-3 mb-md-0">
          <FieldCheckbox
            label={t("Open e-mail client on link visit")}
            name={FormWriteValuesKeys.Open}
          />
        </Col>
        <Col xs={12} md>
          <Button
            block
            variant="primary"
            onClick={() => (
              updateLink(values)
              .then(() => (
                shortenLink(window.location.href, shortAlias)
                .then(({ data }) => {
                  const { status, message, shorturl } = data;
                  if (status === "success") {
                    setUrl(shorturl as string);
                    setError(undefined);
                  } else if (message.endsWith("already exists in database or is reserved")) {
                    setUrl(`${URLS.SHORTEN_LINK_DOMAIN}/${shortAlias}`);
                    setError(Error(t("Alias already exists.", { alias: shortAlias })));
                  } else {
                    throw new Error(message);
                  }
                }))
              .catch((error) => {
                setError(error);
                setUrl(window.location.href);
              })
              )
            )}
          >
            <FontAwesomeIcon icon={faShare}/>
            {` ${t("Create link")}`}
          </Button>
          <Toast
            onClose={() => setShowCopyToast(false)}
            show={showCopyToast}
          >
            {`${t("Link copied to clipboard")} `}
            <FontAwesomeIcon icon={faCopy}/>
          </Toast>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md>
          <FieldText
            name={`${CONTROL_ID}-url`}
            value={url}
            placeholder={`${t("Link will be shown here")}...`}
            onBlur={handleBlur}
            onChange={() => {}}
            disabled={true}
          />
        </Col>
        <Col xs={12} md>
          <Button
            disabled={url.length === 0}
            variant="secondary"
            block
            onClick={() => (
              url &&
              clipboard.writeText(url)
              .then(() => setShowCopyToast(true))
              .catch(() => window.prompt(t("Select and copy the URL"), url))
            )}
          >
            <FontAwesomeIcon icon={faCopy} />
            {` ${t("Copy link")}`}
          </Button>
        </Col>
      </Row>
      <ShareBar
        url={() => (
          updateLink(values)
          .then(() => (
            shortenLink(window.location.href, shortAlias)
            .then(({ data }) => {
              const { status, message, shorturl } = data;
              if (status === "success") {
                const newUrl = shorturl as string;
                setUrl(newUrl);
                setError(undefined);
                return newUrl;
              } else if (message.endsWith("already exists in database or is reserved")) {
                const newUrl = `${URLS.SHORTEN_LINK_DOMAIN}/${shortAlias}`;
                setUrl(newUrl);
                setError(Error(t("Alias already exists.", { alias: shortAlias })));
                return newUrl;
              } else {
                throw new Error(message);
              }
            })
            .catch((error) => {
              setError(error);
              setUrl(window.location.href);
              return window.location.href;
            })
          ))
        )}
      />
      {error && <Alert variant={"danger"}>{error.toString()}</Alert>}
      {url && url.length <= 4296 && // 4296 is the max. number of characters that a QR-code can encode
        <Row md={4} xs={8} className="justify-content-center m-3">
          <QRCode value={url} />
        </Row>
      }
      {onBack &&
        <Button
          block
          variant="secondary"
          onClick={() => onBack(values)}>
          {t("Back to recipient selection")}
        </Button>
      }
    </BootstrapForm>
  );
};

export type FormikFormWriteProps = FormWritePropsBase & FormWriteValues & {
  onSubmit: (values : FormWriteValues) => any
};

export const FormikFormWrite = ({
  toData,
  ccData,
  bccData,
  to,
  cc,
  bcc,
  mailSubject,
  mailBody,
  shortAlias,
  open,
  onSubmit,
  ...rest
} : FormikFormWriteProps) => {
  return (
    <Formik
      initialValues={{
        [FormWriteValuesKeys.ToData]: toData,
        [FormWriteValuesKeys.CcData]: ccData,
        [FormWriteValuesKeys.BccData]: bccData,
        [FormWriteValuesKeys.To]: to,
        [FormWriteValuesKeys.Cc]: cc,
        [FormWriteValuesKeys.Bcc]: bcc,
        [FormWriteValuesKeys.MailSubject]: mailSubject,
        [FormWriteValuesKeys.MailBody]: mailBody,
        [FormWriteValuesKeys.ShortAlias]: shortAlias,
        [FormWriteValuesKeys.Open]: open
      }}
      onSubmit={onSubmit}
    >
      {(props) => <FormWrite {...rest} {...props} />}
    </Formik>
  );
};

export type ConnectedFormWriteProps = Omit<FormikFormWriteProps, "meps"> & {
  toIds?: string[],
  ccIds?: string[],
  bccIds?: string[]
};

export const ConnectedFormWrite = ({
  toIds,
  ccIds,
  bccIds,
  ...rest
} : ConnectedFormWriteProps) => {
  const database = useContext(ContextDatabase);
  const [toData, setToData] = useState<FormikFormWriteProps["toData"]>();
  const [ccData, setCcData] = useState<FormikFormWriteProps["ccData"]>();
  const [bccData, setBccData] = useState<FormikFormWriteProps["bccData"]>();
  const [error, setError] = useState<Error>();

  const loadSelection = (ids: string[] | undefined, setSelection: (selections : FormikFormWriteProps["toData"]) => any) => {
    if (!ids) {
      setSelection({});
      return;
    }

    execStatement({
      database,
      sql: SELECT_MEPS({
        [SelectMepsParamsKeys.MepIds]: ids
      })
    })
    .then((result) => {
      const mepsData = resultToObjects(result) as FormMepContactValuesMep[];
      const meps = arrayIndexToObject(mepsData, FormMepContactValuesMepsKeys.MepId);
      setSelection(meps);
    })
    .catch(setError);
  };

  useEffect(() => {
    loadSelection(toIds, setToData);
  }, [database, toIds]);

  useEffect(() => {
    loadSelection(ccIds, setCcData);
  }, [database, ccIds]);

  useEffect(() => {
    loadSelection(bccIds, setBccData);
  }, [database, bccIds]);

  if (error) return <Alert variant={"danger"}>{error.toString()}</Alert>;
  // TODO: loading indicator
  return toData && ccData && bccData
    ? <FormikFormWrite {...{ toData, ccData, bccData }} {...rest} />
    : null;
};

export default ConnectedFormWrite;
