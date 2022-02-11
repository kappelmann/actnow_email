import React from "react";
import {
  useLocation,
  useHistory
} from "react-router";
import LoadDatabase from "../../LoadDatabase";
import { FormikHelpers } from "formik";

import { Recipients } from "../../fields/FieldSelectRecipients";
import {
  ConnectedFormWrite,
  ConnectedFormWriteProps,
  FormikFormWrite,
  FormWriteValuesKeys,
  FormWriteValues
} from "../../forms/connected/FormWrite";

import { DatabaseLocation } from "../../databases/databaseLocations";
import {
  isNonEmptyStringArray,
  createQueryParams,
  parseQueryParams,
  stringifyQueryParams
} from "../../utils";

export const WINDOW_HREF_UPDATE_DELAY = 200;

export type RouteFormWriteLocationState = {
  [FormWriteValuesKeys.ToData]: Recipients,
  [FormWriteValuesKeys.CcData]: Recipients,
  [FormWriteValuesKeys.BccData]: Recipients
};

export type RouteFormWriteDatabaseData = {
  databaseLocation: DatabaseLocation,
  idRow: ConnectedFormWriteProps["idRow"],
  sql: ConnectedFormWriteProps["sql"]
};

export type RouteFormWriteProps = & {
  backUrl?: string,
  databaseData?: RouteFormWriteDatabaseData
};

export const RouteFormWrite = ({
  backUrl,
  databaseData
} : RouteFormWriteProps) => {
  const history = useHistory();
  const {
    search,
    state,
    ...locationRest
  } = useLocation<RouteFormWriteLocationState | undefined>();

  // retrieve data from query params
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
    toData = {},
    ccData = {},
    bccData = {},
    ...valuesRest
  } : FormWriteValues) => {
    const [toIds, ccIds, bccIds] = [toData, ccData, bccData].map(Object.keys);
    history.push({
      pathname: backUrl,
      search: `?${stringifyQueryParams({
        ...queryParamsRest,
        ...createQueryParams({ ...valuesRest, toIds, ccIds, bccIds })
      })}`
    });
  };

  const updateLink = ({
    toData = {},
    ccData = {},
    bccData = {},
    ...valuesRest
  } : FormWriteValues) => {
    const [toIds, ccIds, bccIds] = [toData, ccData, bccData].map(Object.keys);
    // replace the current entry so that the URL is updated for link sharing
    history.replace({
      ...locationRest,
      search: `?${stringifyQueryParams({
        ...queryParamsRest,
        ...createQueryParams({ ...valuesRest, toIds, ccIds, bccIds })
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

  const open = openQueryParam === undefined
    || (typeof openQueryParam === "string" && (openQueryParam === "" || openQueryParam === "true"));

  const sharedProps = {
    to: isNonEmptyStringArray(toQueryParam) ? toQueryParam as string[] : [],
    cc: isNonEmptyStringArray(ccQueryParam) ? ccQueryParam as string[] : [],
    bcc: isNonEmptyStringArray(bccQueryParam) ? bccQueryParam as string[] : [],
    mailSubject: typeof mailSubjectQueryParam === "string" ? mailSubjectQueryParam : "",
    mailBody: typeof mailBodyQueryParam === "string" ? mailBodyQueryParam : "",
    shortAlias: typeof shortAliasQueryParam === "string" ? shortAliasQueryParam : "",
    open,
    onSubmit,
    onBack: backUrl !== undefined ? onBack : undefined,
    updateLink
  };

  // only initially open if it is forced by the query param
  const initialOpen = openQueryParam !== undefined && open;

  // load from database if we do not have any data in the state
  if (databaseData && !state) {
    const { databaseLocation, idRow, sql } = databaseData;
    return (
      <LoadDatabase databaseLocation={databaseLocation}>
        <ConnectedFormWrite
          toIds={(isNonEmptyStringArray(toIdsQueryParam) ? toIdsQueryParam as string[] : undefined)}
          ccIds={(isNonEmptyStringArray(ccIdsQueryParam) ? ccIdsQueryParam as string[] : undefined)}
          bccIds={(isNonEmptyStringArray(bccIdsQueryParam) ? bccIdsQueryParam as string[] : undefined)}
          idRow={idRow}
          sql={sql}
          {...sharedProps}
          initialOpen={initialOpen}
        />
      </LoadDatabase>
    );
  }

  const data = state || { toData: {}, ccData: {}, bccData: {}};
  return (
    <FormikFormWrite
      {...data}
      {...sharedProps}
      // only initially open if we are not navigating within the app, i.e. there is no state
      initialOpen={!state && initialOpen}
    />
  );
};

export default RouteFormWrite;
