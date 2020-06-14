import React, {
  useEffect,
  useContext, useState
} from "react";
import { useTranslation } from "react-i18next";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import {
  FormMepContactValuesKeys,
  FormMepContactValues,
  FormMepContactValuesMep,
  FormMepContactValuesMepsKeys
} from "../connected/FormMepContact";
import ExplanationJumbotron from "../../components/ExplanationJumbotron";
import { FieldSelectWithLabel } from "../../fields/FieldSelect";

import ContextDatabase from "../../contexts/ContextDatabase";
import {
  SELECT_MEPS,
  SelectMepsParamsKeys
} from "../../database/sqls";

import {
  execStatement,
  resultToObjects
} from "../../database/utils";
import {
  arrayIndexToObject,
  isNonEmptyStringArray
} from "../../utils";

export const CONTROL_ID = "form-write";

export type FormWritePropsBase = {
  onBack: (meps : FormMepContactValues[FormMepContactValuesKeys.Meps]) => void
}

export type FormWriteProps = FormWritePropsBase & Pick<FormMepContactValues, FormMepContactValuesKeys.Meps>

export const FormWrite = ({
  meps,
  onBack
} : FormWriteProps) => {
  const [selection, setSelection] = useState(meps);
  const { t } = useTranslation();
  return (
    <>
      <ExplanationJumbotron
        heading={t("Almost Done...")}
        text={t("Click link instructions")}
      />
      <a href={`mailto:${Object.values(selection).map(({ email }) => email).join(",")}`}>
        <Button block variant="link">
          {t("Here is your e-mail link")}
        </Button>
      </a>
      <FieldSelectWithLabel
        label={t("Your selections")}
        controlId={`${CONTROL_ID}-selected`}
        placeholder={t("No selection go back")}
        noOptionsMessage={() => t("Missing selection instructions")}
        options={[]}
        searchable={false}
        name={"selections"}
        multiple={true}
        value={Object.keys(selection).sort((mepId1, mepId2) => selection[mepId1].name.localeCompare(selection[mepId2].name))}
        getOptionLabel={(mepId) => selection[mepId].name}
        onChange={(mepIds) => {
          const newSelection = isNonEmptyStringArray(mepIds)
            ? (mepIds as string []).reduce((acc, mepId) => ({
              ...acc,
              [mepId]: selection[mepId]
            }), {})
            : {};
          setSelection(newSelection);
        }}
        onBlur={() => {}}
      />
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
      const meps = resultToObjects(result) as FormMepContactValuesMep[];
      setMeps(arrayIndexToObject(meps, FormMepContactValuesMepsKeys.MepId));
    })
    .catch(setError);
  }, [database, mepIds]);


  if (error) return <Alert variant={"danger"}>{error.toString()}</Alert>;

  // TODO: loading indicator
  return meps ? <FormWrite meps={meps} onBack={onBack}/> : null;
};

export default ConnectedFormWrite;
