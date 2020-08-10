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
  MepIds = "mep_ids"
}

export type RouteFormWriteQueryParams = {
  [RouteFormWriteQueryParamsKey.MepIds]: string[]
};

export const RouteFormWrite = () => {
  const history = useHistory();
  const {
    search,
    state: mepsState
  }= useLocation<RouteFormWriteLocationState | undefined>();
  // retrieve mep ids from query param and load data from the database if needed
  const {
    mep_ids: mepIdsQueryParam,
    ...queryParamsRest
  } = parseQueryParams(search);

  const onBack = (meps : RouteFormWriteLocationState) => {
    const mepIds = Object.keys(meps);
    history.push({
      pathname: URLS.MEPS,
      search: `?${stringifyQueryParams({
        ...queryParamsRest,
        [RouteFormMepContactQueryParamsKey.MepIds]: mepIds
      })}`,
      state: mepIds
    });
  };
  const onSubmit = ({ meps, mailBody, mailSubject } : FormWriteValues) => {
    // TODO: fix duplication here with sorting and also database queries
    // TODO: store email content in URL and de-serialise on load
    const sortedMepIds = Object.keys(meps).sort((mepId1, mepId2) =>
      meps[mepId1].name.localeCompare(meps[mepId2].name));
    window.location.href = `mailto:?bcc=${sortedMepIds.map((mepId) => meps[mepId].email).join(",")}
      &subject=${encodeURIComponent(mailSubject ?? "")}
      &body=${encodeURIComponent(mailBody ?? "")}`;
  };

  // use the meps from the router location state if available
  if (mepsState) return <FormikFormWrite meps={mepsState} onSubmit={onSubmit} onBack={onBack} />;
  // otherwise load them from the database
  return (
    <LoadDatabase>
      <ConnectedFormWrite
        mepIds={(isNonEmptyStringArray(mepIdsQueryParam)
          ? mepIdsQueryParam
          : []
        ) as string[]}
        onSubmit={onSubmit}
        onBack={onBack}
      />
    </LoadDatabase>
  );
};

export default RouteFormWrite;
