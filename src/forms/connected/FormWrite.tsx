import React, {
  useEffect,
  useContext,
  useState
} from "react";
import ReactDOMServer from "react-dom/server";
import FileSaver from "file-saver";
import {
  Formik,
  FormikProps
} from "formik";
import { useTranslation } from "react-i18next";

import BootstrapForm from "react-bootstrap/Form";
import Collapse from "react-bootstrap/Collapse";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import QRCode from "../../components/QRCode";
import * as clipboard from "clipboard-polyfill/text";

import ExpandButton from "../../components/ExpandButton";
import Toast from "../../components/Toast";
import ShareBar from "../../components/ShareBar";

import URLS from "../../consts/urls";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faEnvelope,
  faFeather,
  faLink,
  faSave,
  faShareAltSquare
} from "@fortawesome/free-solid-svg-icons";

import {
  FormMepContactValuesMep,
  FormMepContactValuesMepsKeys
} from "../connected/FormMepContact";
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
  const [isLinkCreating, setIsLinkCreating] = useState(false);
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

  const onSubmit = () => {
    handleSubmit();
    openMailClient();
  };

  const createLink = () => {
    setIsLinkCreating(true);
    return updateLink(values)
    .then(() => (
      shortenLink(window.location.href, shortAlias)
      .then(({ data }) => {
        const { status, message, shorturl } = data;
        let url : string;
        if (status === "success") {
          url = shorturl as string;
          setError(undefined);
          if (data?.url) {
            const { keyword } = data?.url;
            setFieldValue(FormWriteValuesKeys.ShortAlias, keyword);
          }
        } else if (message.endsWith("already exists in database or is reserved")) {
          url = `${URLS.SHORTEN_LINK_DOMAIN}/${shortAlias}`;
          setError(Error(t("Alias already exists", { alias: shortAlias })));
        } else {
          throw new Error(message);
        }
        setUrl(url);
        copyToClipboard(url);
        return url;
      }))
      .catch((error) => {
        setError(error);
        setUrl(window.location.href);
        return window.location.href;
      })
    )
    .finally(() => setIsLinkCreating(false));
  };

  const copyToClipboard = (url : string) => (
    clipboard.writeText(url)
    .then(() => setShowCopyToast(true))
    .catch(() => window.prompt(t("Select and copy the URL"), url))
  );

  return (
    <BootstrapForm onReset={handleReset} onSubmit={onSubmit}>
      <h2>
        {t("Create your e-mail template")}{" "}
        <FontAwesomeIcon icon={faFeather}/>
      </h2>
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
          noOptionsMessage: () => t("Enter valid e-mail address"),
          options: [],
          formatCreateLabel: () => `${t("Press enter to add address")}...`,
          creatable: true,
          multiple: true,
          placeholder: `${t("Enter more addresses here")}...`
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
                <Col md={3} className="mb-3">
                  <ExpandButton
                    initialValue={open}
                    onClick={setOpen}
                    label={t("Add e-mail addresses")}
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
      <Button
        block
        className="mb-3"
        variant="primary"
        onClick={onSubmit}
      >
        <FontAwesomeIcon icon={faEnvelope}/>
        {` ${t("Send via e-mail client")}`}
      </Button>
      <hr/>
      <h2>
        {t("Share template")}{" "}
        <FontAwesomeIcon icon={faShareAltSquare}/>
      </h2>
      <Row className="align-items-center">
        <Col xs={12} md>
          <ConnectedFieldTextWithLabel
            disabled={isLinkCreating}
            controlId={`${CONTROL_ID}-short-alias`}
            label={t("Short link")}
            name={FormWriteValuesKeys.ShortAlias}
            placeholder={`${t("(Optional) Enter custom link")}...`}
            tooltip={t("shortAliasTooltip")}
            inputGroupChildren={
              <InputGroup.Text>
                {`${URLS.SHORTEN_LINK_DOMAIN}/`}
              </InputGroup.Text>
            }
          />
        </Col>
        <Col xs={12} md>
          <FieldCheckbox
            // safe cast unless i18n is not initialised
            label={t("Open e-mail client on link visit") as string}
            tooltip={t("Check to automatically open e-mail client with template on link visit")}
            name={FormWriteValuesKeys.Open}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} md className=" mb-3 mb-md-0">
          <Button
            block
            variant="primary"
            disabled={isLinkCreating}
            onClick={createLink}
          >
            <FontAwesomeIcon icon={faLink}/>
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
        <Col xs={12} md>
          <FieldText
            name={`${CONTROL_ID}-url`}
            value={url}
            placeholder={`${t("Link will be shown here")}...`}
            onBlur={handleBlur}
            onChange={() => {}}
            disabled={true}
            inputGroupChildren={
              <Button
                disabled={!url}
                onClick={() => copyToClipboard(url)}
                variant="secondary"
              >
                <FontAwesomeIcon icon={faCopy}/>
              </Button>
            }
          />
        </Col>
      </Row>
      <ShareBar disabled={isLinkCreating} url={createLink} />
      {error && <Alert variant={"danger"}>{error.toString()}</Alert>}
      {url && url.length <= 4296 && // 4296 is the max. number of characters that a QR-code can encode
        <>
          <Row className="justify-content-center m-3">
            <Col md={4} xs={8}>
              <QRCode value={url} />
            </Col>
          </Row>
          <Button
            block
            variant="secondary"
            onClick={() => {
              // we somehow need to access the svg's html code, and I am not aware of any easier way than this:
              // get the component's html as a string, create a html object and attach the component's html,
              // and then find the svg inside this element and save the html again as a string
              const htmlStringAll = ReactDOMServer.renderToString(<QRCode value={url} />);
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = htmlStringAll;
              const htmlStringSvg = tempDiv.querySelector("svg")?.outerHTML;
              if (!htmlStringSvg) {
                setError(new Error(t("Could not create SVG image")));
                return;
              }
              FileSaver.saveAs(
                new Blob([htmlStringSvg], {type: "image/svg+xml;charset=utf-8"}
                ), `${url.substring(url.lastIndexOf("/") + 1)}.svg`
              );
            }}
          >
            <FontAwesomeIcon icon={faSave}/>
            {` ${t("Save QR code")}`}
          </Button>
        </>
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

export type ConnectedFormWriteProps = Omit<FormikFormWriteProps, "toData" | "ccData" | "bccData"> & {
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
