import React from "react";
import {
  useLocation,
  useHistory
} from "react-router";
import LoadDatabase from "../LoadDatabase";
import { FormikHelpers } from "formik";

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
  MailType = "mail_type",
  MailSubject = "mail_subject",
  MailBody = "mail_body"
}

export type RouteFormWriteQueryParams = {
  [RouteFormWriteQueryParamsKey.MepIds]: string[]
  [RouteFormWriteQueryParamsKey.MailType]?: string
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
    mail_type: mailTypeQueryParam,
    mail_subject: mailSubjectQueryParam,
    mail_body: mailBodyQueryParam,
    ...queryParamsRest
  } = parseQueryParams(search);

  const onBack = ({ meps, mailType, mailSubject, mailBody }: FormWriteValues) => {
    const mepIds = Object.keys(meps);
    history.push({
      pathname: URLS.MEPS,
      search: `?${stringifyQueryParams({
        ...queryParamsRest,
        [RouteFormWriteQueryParamsKey.MailType]: mailType,
        [RouteFormWriteQueryParamsKey.MailSubject]: mailSubject,
        [RouteFormWriteQueryParamsKey.MailBody]: mailBody,
        [RouteFormMepContactQueryParamsKey.MepIds]: mepIds
      })}`,
      state: mepIds
    });
  };
  const onSubmit = (
    { meps, mailType, mailBody, mailSubject } : FormWriteValues,
    { setSubmitting } : FormikHelpers<FormWriteValues>
  ) => {
    const mepIds = Object.keys(meps);
    // replace the current entry so that the URL is updated for link sharing
    history.replace({
      ...locationRest,
      search: `?${stringifyQueryParams({
        ...queryParamsRest,
        [RouteFormWriteQueryParamsKey.MailType]: mailType,
        [RouteFormWriteQueryParamsKey.MailSubject]: mailSubject,
        [RouteFormWriteQueryParamsKey.MailBody]: mailBody,
        [RouteFormWriteQueryParamsKey.MepIds]: mepIds
      })}`,
      state: meps
    });
    setSubmitting(false);
  };

  // TODO make those arguments optional rather than passing the empty string
  const mailType = typeof mailTypeQueryParam === "string"
    ? mailTypeQueryParam
    : "";
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
      mailType={mailType}
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
        mailType={mailType}
        mailSubject={mailSubject}
        mailBody={mailBody}
        onSubmit={onSubmit}
        onBack={onBack}
      />
    </LoadDatabase>
  );
};

export default RouteFormWrite;
