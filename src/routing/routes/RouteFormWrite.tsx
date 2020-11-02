import React from "react";
import {
  useLocation,
  useHistory
} from "react-router";
import LoadDatabase from "../../LoadDatabase";
import { FormikHelpers } from "formik";

import {
  FormMepContactValues,
  FormMepContactValuesKeys
} from "../../forms/connected/FormMepContact";
import { QueryParamsKeys } from "./QueryParams";
import {
  ConnectedFormWrite,
  FormikFormWrite,
  FormWriteValuesKeys,
  FormWriteValues
} from "../../forms/connected/FormWrite";

import {
  isNonEmptyStringArray,
  parseQueryParams,
  stringifyQueryParams
} from "../../utils";

export const WINDOW_HREF_UPDATE_DELAY = 200;

export type RouteFormWriteLocationState = {
  [FormWriteValuesKeys.ToData]: FormMepContactValues[FormMepContactValuesKeys.To],
  [FormWriteValuesKeys.CcData]: FormMepContactValues[FormMepContactValuesKeys.Cc],
  [FormWriteValuesKeys.BccData]: FormMepContactValues[FormMepContactValuesKeys.Bcc]
};

export type RouteFormWriteProps = {
  backUrl?: string;
};

export const RouteFormWrite = ({
  backUrl
} : RouteFormWriteProps) => {
  const history = useHistory();
  const {
    search,
    state,
    ...locationRest
  } = useLocation<RouteFormWriteLocationState | undefined>();

  // retrieve ids from query param
  const {
    to_ids: toIdsQueryParam,
    cc_ids: ccIdsQueryParam,
    bcc_ids: bccIdsQueryParam,
    to: toQueryParam,
    cc: ccQueryParam,
    bcc: bccQueryParam,
    mail_subject: mailSubjectQueryParam,
    mail_body: mailBodyQueryParam,
    short_alias: shortAliasQueryParam,
    open: openQueryParam,
    ...queryParamsRest
  } = parseQueryParams(search);

  const onBack = ({
    // FIXME: default values are kind of ugly here
    toData = {},
    ccData = {},
    bccData = {},
    to = [],
    cc = [],
    bcc = [],
    mailSubject = "",
    mailBody = "",
    shortAlias = "",
    open = false
  } : FormWriteValues) => {
    const [toIds, ccIds, bccIds] = [toData, ccData, bccData].map(Object.keys);
    history.push({
      pathname: backUrl,
      search: `?${stringifyQueryParams({
        ...queryParamsRest,
        [QueryParamsKeys.ToIds]: toIds,
        [QueryParamsKeys.CcIds]: ccIds,
        [QueryParamsKeys.BccIds]: bccIds,
        [QueryParamsKeys.To]: to,
        [QueryParamsKeys.Cc]: cc,
        [QueryParamsKeys.Bcc]: bcc,
        [QueryParamsKeys.MailSubject]: mailSubject,
        [QueryParamsKeys.MailBody]: mailBody,
        [QueryParamsKeys.ShortAlias]: shortAlias,
        [QueryParamsKeys.Open]: open
      })}`
    });
  };

  const updateLink = ({
    // FIXME: also fix here
    toData = {},
    ccData = {},
    bccData = {},
    to = [],
    cc = [],
    bcc = [],
    mailSubject = "",
    mailBody = "",
    shortAlias = "",
    open = false
  } : FormWriteValues) => {
    const [toIds, ccIds, bccIds] = [toData, ccData, bccData].map(Object.keys);
    // replace the current entry so that the URL is updated for link sharing
    history.replace({
      ...locationRest,
      search: `?${stringifyQueryParams({
        ...queryParamsRest,
        [QueryParamsKeys.ToIds]: toIds,
        [QueryParamsKeys.CcIds]: ccIds,
        [QueryParamsKeys.BccIds]: bccIds,
        [QueryParamsKeys.To]: to,
        [QueryParamsKeys.Cc]: cc,
        [QueryParamsKeys.Bcc]: bcc,
        [QueryParamsKeys.MailSubject]: mailSubject,
        [QueryParamsKeys.MailBody]: mailBody,
        [QueryParamsKeys.ShortAlias]: shortAlias,
        [QueryParamsKeys.Open]: open
      })}`,
      state
    });
    return new Promise((resolve) => setTimeout(resolve, WINDOW_HREF_UPDATE_DELAY));
  };

  const onSubmit = (
    values : FormWriteValues,
    { setSubmitting } : FormikHelpers<FormWriteValues>
  ) => {
    updateLink(values);
    setSubmitting(false);
  };

  const open = typeof openQueryParam === "string" ? openQueryParam === "true" || openQueryParam === "" : undefined;

  const sharedProps = {
    to: isNonEmptyStringArray(toQueryParam) ? toQueryParam as string[] : undefined,
    cc: isNonEmptyStringArray(ccQueryParam) ? ccQueryParam as string[] : undefined,
    bcc: isNonEmptyStringArray(bccQueryParam) ? bccQueryParam as string[] : undefined,
    mailSubject: typeof mailSubjectQueryParam === "string" ? mailSubjectQueryParam : undefined,
    mailBody: typeof mailBodyQueryParam === "string" ? mailBodyQueryParam : undefined,
    shortAlias: typeof shortAliasQueryParam === "string" ? shortAliasQueryParam : undefined,
    open,
    onSubmit,
    onBack: backUrl !== undefined ? onBack : undefined,
    updateLink
  };

  // TODO decouple from Meps
  // use the meps from the router location state if available
  if (state) return (
    <FormikFormWrite
      {...state}
      {...sharedProps}
      initialOpen={false}
    />
  );
  // otherwise load them from the database
  return (
    <LoadDatabase>
      <ConnectedFormWrite
        toIds={(isNonEmptyStringArray(toIdsQueryParam) ? toIdsQueryParam as string[] : undefined)}
        ccIds={(isNonEmptyStringArray(ccIdsQueryParam) ? ccIdsQueryParam as string[] : undefined)}
        bccIds={(isNonEmptyStringArray(bccIdsQueryParam) ? bccIdsQueryParam as string[] : undefined)}
        {...sharedProps}
        initialOpen={open}
      />
    </LoadDatabase>
  );
};

export default RouteFormWrite;
