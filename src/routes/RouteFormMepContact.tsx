import React from "react";
import { useHistory } from "react-router-dom";

import LoadDatabase from "../LoadDatabase";
import FormMepContact from "../forms/connected/FormMepContact";
import Urls from "../consts/urls";


export const RouteFormMepContact = () => {
  const history = useHistory();
  return (
    <LoadDatabase>
      <FormMepContact
        onSubmit={() => history.push(Urls.Mailto)}
        // onSubmit={(values) => history.push(Urls.Mailto)}
      />
    </LoadDatabase>
  );
};

export default RouteFormMepContact;
