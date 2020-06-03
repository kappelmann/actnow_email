import React, {
  useEffect,
  useContext,
  useState
} from "react";
import { useTranslation } from "react-i18next";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import {
  FormMepContactValuesKeys,
  FormMepContactValues
} from "../connected/FormMepContact";
import ExplanationJumbotron from "../../components/ExplanationJumbotron";

import ContextDatabase from "../../contexts/ContextDatabase";
import {
  SELECT_MEPS,
  SelectMepsParamsKeys
} from "../../database/sqls";

import { execStatement } from "../../database/utils";

export type FormWritePropsBase = {
  onBack: (meps : FormMepContactValues[FormMepContactValuesKeys.Meps]) => void
}

export type FormWriteProps = FormWritePropsBase & Pick<FormMepContactValues, FormMepContactValuesKeys.Meps>

export const FormWrite = ({
  meps,
  onBack
} : FormWriteProps) => {
  const { t } = useTranslation();
  return (
    <>
      <ExplanationJumbotron
        heading={t("Get Ready For Action")}
        text={t("Click link instructions")}
      />
      <a href={`mailto:${meps.map(({ email }) => email).join(",")}`}>
        <Button block variant="link">
          {t("Here is your e-mail link")}
        </Button>
      </a>
      <Button block variant="primary" onClick={() => onBack(meps)}>
        {t("Back")}
      </Button>
    </>
  );
};

export type ConnectedFormWriteProps = FormWritePropsBase & {
  mepIds: string[]
}

export const ConnectedFormWrite = ({
  mepIds,
  onBack
}: ConnectedFormWriteProps) => {
  const database = useContext(ContextDatabase);
  const [error, setError] = useState<Error>();
  const [meps, setMeps] = useState<FormWriteProps[FormMepContactValuesKeys.Meps]>();

  useEffect(() => {
    execStatement({
      database,
      sql: SELECT_MEPS({
        [SelectMepsParamsKeys.MepIds]: mepIds
      })
    })
    .then((result) => {
      const columns = result?.columns ?? [];
      const values = result?.values ?? [];
      const meps = values.map((entry) => (
        columns.reduce((acc, column, index) => ({
          ...acc,
          [column]: entry[index]
        }), {})
      ));
      setMeps(meps as FormWriteProps[FormMepContactValuesKeys.Meps]);
    })
    .catch(setError);
  }, [database, mepIds]);

  // TODO: loading indicator
  return (
    <>
      {error && <Alert variant={"danger"}>{error.toString()}</Alert>}
      {meps && <FormWrite meps={meps} onBack={onBack}/>}
    </>
  );
};

export default ConnectedFormWrite;
