import React from "react";
import {
  useHistory,
  useLocation
} from "react-router";

import LoadDatabase from "../../LoadDatabase";
import FormMepContact from "../../forms/connected/FormMepContact";
import {
  QueryParamsKeys
} from "./QueryParams";

import URLS from "../../consts/urls";
import {
  isNonEmptyStringArray,
  parseQueryParams,
  stringifyQueryParams
} from "../../utils";

export const RouteFormMepContact = () => {
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
    <LoadDatabase>
      <FormMepContact
        initialToIds={isNonEmptyStringArray(toIdsQueryParam) ? toIdsQueryParam as string[] : []}
        initialCcIds={isNonEmptyStringArray(ccIdsQueryParam) ? ccIdsQueryParam as string[] : []}
        initialBccIds={isNonEmptyStringArray(bccIdsQueryParam) ? bccIdsQueryParam as string[] : []}
        onSubmit={({ to, cc, bcc }, { setSubmitting }) => {
          const toIds = Object.keys(to);
          const ccIds = Object.keys(cc);
          const bccIds = Object.keys(bcc);
          const search = `?${stringifyQueryParams({
            ...queryParamsRest,
            [QueryParamsKeys.ToIds]: toIds,
            [QueryParamsKeys.CcIds]: ccIds,
            [QueryParamsKeys.BccIds]: bccIds
          })}`;
          // first replace the current entry so that navigating using the browsers' back button works
          history.replace({
            ...locationRest,
            search
          });
          // then go to the new route
          history.push({
            pathname: `${URLS.MAILTO}/${URLS.MEPS}`,
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

export default RouteFormMepContact;
