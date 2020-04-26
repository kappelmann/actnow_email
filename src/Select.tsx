import React, { useState } from 'react';
import ReactSelect, {
  ValueType
} from 'react-select';

export type Option = {
  value: string,
  label: string
}

export type SelectProps = {
  isMulti?: boolean
  options: Option[]
}

export const Select = ({
  isMulti = false,
  options
} : SelectProps) => {
  const [selectedOption, setSelectedOption] = useState<ValueType<Option>>();

  return (
    <ReactSelect
      isMulti={isMulti}
      value={selectedOption}
      onChange={setSelectedOption}
      options={options}
    />
  );
}

export default Select;
