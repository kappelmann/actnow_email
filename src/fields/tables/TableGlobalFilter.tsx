import React, {
  useRef
} from "react";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";

export type TableGlobalFilter = {
  controlId: string,
  value?: string,
  placeholder?: string,
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
};

export const TableGlobalFilter = ({
  controlId,
  value = "",
  placeholder,
  onChange = () => { console.warn("rendering global filter for table without onChange"); }
} : TableGlobalFilter, ref : React.Ref<HTMLInputElement>) => {
  const defaultRef = useRef(null);
  const resolvedRef = ref ?? defaultRef;

  const { t } = useTranslation();

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{t("Search")}</Form.Label>
      {ref ?
        <Form.Control ref={resolvedRef} /> :
        <Form.Control
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      }
    </Form.Group>
  );
};

const TableGlobalFilterWithRef = React.forwardRef(TableGlobalFilter);

export default TableGlobalFilterWithRef;
