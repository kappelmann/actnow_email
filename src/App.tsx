import React from "react";

import LoadDatabase from "./LoadDatabase";
import FormMepContact from "./forms/connected/FormMepContact";

export const App = () => {
  return (
    <LoadDatabase>
      <FormMepContact />
    </LoadDatabase>
  );
};

export default App;
