import React from "react";
import {
  useHistory,
  useLocation
} from "react-router";

import LoadDatabase from "../../LoadDatabase";
import FormMepsSelect from "../../forms/connected/FormMepsSelect";

import DatabaseLocations from "../../databases/databaseLocations";
import { PATHS } from "../../routing/Router";
import {
  isNonEmptyStringArray,
  createQueryParams,
  parseQueryParams,
  stringifyQueryParams
} from "../../utils";

export const RouteFormMepsSelect = () => {
  const {
    search,
    ...locationRest
  } = useLocation();
  const history = useHistory();

  // get the ids from the query params
  const {
    to_ids: toIdsQueryParam,
    cc_ids: ccIdsQueryParam,
    bcc_ids: bccIdsQueryParam,
    ...queryParamsRest
  } = parseQueryParams(search);

  return (
    <LoadDatabase databaseLocation={DatabaseLocations.MEPS}>
      <FormMepsSelect
        initialToIds={isNonEmptyStringArray(toIdsQueryParam) ? toIdsQueryParam as string[] : []}
        initialCcIds={isNonEmptyStringArray(ccIdsQueryParam) ? ccIdsQueryParam as string[] : []}
        initialBccIds={isNonEmptyStringArray(bccIdsQueryParam) ? bccIdsQueryParam as string[] : []}
        onSubmit={({ to, cc, bcc }, { setSubmitting }) => {
          const [toIds, ccIds, bccIds] = [to, cc, bcc].map(Object.keys);
          const search = `?${stringifyQueryParams({
            ...queryParamsRest,
            ...createQueryParams({ toIds, ccIds, bccIds })
          })}`;
          // first replace the current entry so that navigating using the browser's back button works
          history.replace({
            ...locationRest,
            search
          });
          // then go to the new route
          history.push({
            pathname: PATHS.MEPS_MAILTO,
            search,
            state: {
              toData: to,
              ccData: cc,
              bccData: bcc
            }
          });
          setSubmitting(false);
        }}
      />
    </LoadDatabase>
  );
};

export default RouteFormMepsSelect;
