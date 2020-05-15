import React from "react";
import { useTranslation } from "react-i18next";

export const FormWrite = () => {
  const { t } = useTranslation();
  return (
    <p>{`${t("Here is your e-mail link")}:`}</p>
  );
};

export default FormWrite;
