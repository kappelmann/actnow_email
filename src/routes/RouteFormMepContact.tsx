import React from "react";
import {
  useHistory,
  useLocation
} from "react-router";

import LoadDatabase from "../LoadDatabase";
import FormMepContact, {
  FormMepContactValues
} from "../forms/connected/FormMepContact";
import { RouteFormWriteQueryParamsKey } from "./RouteFormWrite";

import Urls from "../consts/urls";
import {
  isNonEmptyStringArray,
  parseQueryParam,
  stringifyQueryParam
} from "../utils";

export enum RouteFormMepContactQueryParamsKey {
  MepIds = "mep_ids"
}

export type RouteFormWriteQueryParams = {
  [RouteFormMepContactQueryParamsKey.MepIds]: string[]
};

export type RouteFormMepContactLocationState = string[];

export const RouteFormMepContact = () => {
  const {
    search,
    state: mepIdsState
  } = useLocation<RouteFormMepContactLocationState | undefined>();
  // use the meps from the router location state
  const history = useHistory();

  const { mep_ids: mepIdsQueryParam } = parseQueryParam(search);

  return (
    <LoadDatabase>
      <FormMepContact
        initialMepIds={mepIdsState ?? (isNonEmptyStringArray(mepIdsQueryParam)
          ? mepIdsQueryParam
          : []
        ) as string[]}
        onSubmit={({ meps }: FormMepContactValues) => history.push({
          pathname: Urls.Mailto,
          search: `?${stringifyQueryParam({
            [RouteFormWriteQueryParamsKey.MepIds]: meps.map(({ mep_id }) => mep_id)
          })}`,
          state: meps
        })}
      />
    </LoadDatabase>
  );
};

export default RouteFormMepContact;
