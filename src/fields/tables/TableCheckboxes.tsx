import React, {
  forwardRef,
  useEffect,
  useRef
} from "react";
import Form from "react-bootstrap/Form";
import {
  TableToggleCommonProps,
  UseRowSelectInstanceProps,
  UseRowSelectRowProps,
  UseTableCellProps
} from "react-table";

const IndeterminateCheckbox = ({ indeterminate, ...rest } : TableToggleCommonProps, ref : React.Ref<HTMLInputElement> | null) => {
  const defaultRef = useRef(null);
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    if ((resolvedRef as any)?.current) {
      (resolvedRef as any).current.indeterminate = indeterminate;
    }
  }, [resolvedRef, indeterminate]);

  return (
    <Form.Control
      type="checkbox"
      ref={resolvedRef}
      {...rest}
    />
  );
};

const IndeterminateCheckboxWithForwardRef = forwardRef(IndeterminateCheckbox);

// The header can use the table's getToggleAllRowsSelectedProps method
// to render a checkbox
export const HeaderCheckbox = <D extends object>({ getToggleAllRowsSelectedProps } : UseRowSelectInstanceProps<D>) => (
  <IndeterminateCheckboxWithForwardRef {...getToggleAllRowsSelectedProps()} />
);

// The cell can use the individual row's getToggleRowSelectedProps method
// to the render a checkbox
export const RowCheckbox = <D extends object>({ row } : UseTableCellProps<D>) => (
  <IndeterminateCheckboxWithForwardRef {...(row as any as UseRowSelectRowProps<D>).getToggleRowSelectedProps()} />
);
