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
  // get the meps from the router location state
  const {
    pathname,
    search,
    state: mepIdsState
  } = useLocation<RouteFormMepContactLocationState | undefined>();
  const history = useHistory();

  const { mep_ids: mepIdsQueryParam } = parseQueryParam(search);

  return (
    <LoadDatabase>
      <FormMepContact
        initialMepIds={mepIdsState ?? (
          // if there are no meps in the state, get the ids form the query param
          isNonEmptyStringArray(mepIdsQueryParam)
            ? mepIdsQueryParam
            : []
          ) as string[]
        }
        onSubmit={({ meps }: FormMepContactValues) => {
          const mepIds = Object.keys(meps);
          // first replace the current entry so that navigating using the browsers' back button works
          history.replace({
            pathname,
            search: `?${stringifyQueryParam({
              [RouteFormMepContactQueryParamsKey.MepIds]: mepIds
            })}`,
            state: mepIds
          });
          // then go to the new route
          history.push({
            pathname: Urls.Mailto,
            search: `?${stringifyQueryParam({
              [RouteFormWriteQueryParamsKey.MepIds]: mepIds
            })}`,
            state: meps
          });
        }}
      />
    </LoadDatabase>
  );
};

export default RouteFormMepContact;
