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
  FormWrite,
  ConnectedFormWrite
} from "../forms/connected/FormWrite";

import Urls from "../consts/urls";
import {
  isNonEmptyStringArray,
  parseQueryParam,
  stringifyQueryParam
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

  const onBack = (meps : RouteFormWriteLocationState) => {
    const mepIds = meps.map(({ mep_id }) => mep_id);
    history.push({
      pathname: Urls.Meps,
      search: `?${stringifyQueryParam({
        [RouteFormMepContactQueryParamsKey.MepIds]: mepIds
      })}`,
      state: mepIds
    });
  };

  // use the meps from the router location state
  if (mepsState) return <FormWrite meps={mepsState} onBack={onBack} />;

  // retrieve mep ids from query param and load data from the database
  const { mep_ids: mepIdsQueryParam } = parseQueryParam(search);

  return (
    <LoadDatabase>
      <ConnectedFormWrite
        mepIds={(isNonEmptyStringArray(mepIdsQueryParam)
          ? mepIdsQueryParam
          : []
        ) as string[]}
        onBack={onBack}
      />
    </LoadDatabase>
  );
};

export default RouteFormWrite;
