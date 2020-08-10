import React from "react";
import {
  useLocation,
  useHistory
} from "react-router"; import LoadDatabase from "../LoadDatabase";

import {
  FormMepContactValues,
  FormMepContactValuesKeys
} from "../forms/connected/FormMepContact";
import { RouteFormMepContactQueryParamsKey } from "./RouteFormMepContact";
import {
  ConnectedFormWrite,
  FormikFormWrite,
  FormWriteValues
} from "../forms/connected/FormWrite";

import URLS from "../consts/urls";
import {
  isNonEmptyStringArray,
  parseQueryParams,
  stringifyQueryParams
} from "../utils";

export type RouteFormWriteLocationState = FormMepContactValues[FormMepContactValuesKeys.Meps];

export enum RouteFormWriteQueryParamsKey {
  MepIds = "mep_ids",
  MailSubject = "mail_subject",
  MailBody = "mail_body"
}

export type RouteFormWriteQueryParams = {
  [RouteFormWriteQueryParamsKey.MepIds]: string[]
  [RouteFormWriteQueryParamsKey.MailSubject]?: string
  [RouteFormWriteQueryParamsKey.MailBody]?: string
};

export const RouteFormWrite = () => {
  const history = useHistory();
  const {
    search,
    state: mepsState,
    ...locationRest
  }= useLocation<RouteFormWriteLocationState | undefined>();
  // retrieve mep ids from query param and load data from the database if needed
  const {
    mep_ids: mepIdsQueryParam,
    mail_subject: mailSubjectQueryParam,
    mail_body: mailBodyQueryParam,
    ...queryParamsRest
  } = parseQueryParams(search);

  const onBack = ({ meps, mailSubject, mailBody }: FormWriteValues) => {
    const mepIds = Object.keys(meps);
    history.push({
      pathname: URLS.MEPS,
      search: `?${stringifyQueryParams({
        ...queryParamsRest,
        [RouteFormWriteQueryParamsKey.MailSubject]: mailSubject,
        [RouteFormWriteQueryParamsKey.MailBody]: mailBody,
        [RouteFormMepContactQueryParamsKey.MepIds]: mepIds
      })}`,
      state: mepIds
    });
  };
  const onSubmit = ({ meps, mailBody, mailSubject } : FormWriteValues) => {
    const mepIds = Object.keys(meps);
    // replace the current entry so that the URL is updated for link sharing
    history.replace({
      ...locationRest,
      search: `?${stringifyQueryParams({
        ...queryParamsRest,
        [RouteFormWriteQueryParamsKey.MailSubject]: mailSubject,
        [RouteFormWriteQueryParamsKey.MailBody]: mailBody,
        [RouteFormWriteQueryParamsKey.MepIds]: mepIds
      })}`,
      state: meps
    });
  };

  const mailSubject = typeof mailSubjectQueryParam === "string"
    ? mailSubjectQueryParam
    : "";
  const mailBody = typeof mailBodyQueryParam === "string"
    ? mailBodyQueryParam
    : "";

  // use the meps from the router location state if available
  if (mepsState) return (
    <FormikFormWrite
      meps={mepsState}
      mailSubject={mailSubject}
      mailBody={mailBody}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
  // otherwise load them from the database
  return (
    <LoadDatabase>
      <ConnectedFormWrite
        mepIds={(isNonEmptyStringArray(mepIdsQueryParam)
          ? mepIdsQueryParam
          : []
        ) as string[]}
        mailSubject={mailSubject}
        mailBody={mailBody}
        onSubmit={onSubmit}
        onBack={onBack}
      />
    </LoadDatabase>
  );
};

export default RouteFormWrite;
