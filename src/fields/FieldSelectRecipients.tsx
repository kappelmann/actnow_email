import React from "react";

import {
  FieldSelectWithLabel,
  FieldSelectWithLabelProps
} from "./FieldSelect";

import {
  isNonEmptyStringArray,
  sortRecipients
} from  "../utils";

export enum RecipientKeys {
  Name = "name",
  Email = "email"
}

export type Recipient = Record<RecipientKeys, string>;
export type Recipients = Record<string, Recipient>;

export type FieldSelectRecipientsProps = Omit<FieldSelectWithLabelProps<string>, "options" | "creatable" | "getOptionLabel" | "onChange" | "value"> & {
  options: Recipients;
  value: Recipients;
  onChange: (selection : Recipients) => any;
};

export const FieldSelectRecipients = ({
  options,
  value,
  onChange,
  ...rest
} : FieldSelectRecipientsProps) => {

  const sortedOptionIds = React.useMemo(() => sortRecipients(options), [options, Object.keys(options).length]);
  const sortedValueIds = React.useMemo(() => sortRecipients(value), [value, Object.keys(value).length]);

  return (
    <FieldSelectWithLabel
      options={sortedOptionIds}
      value={sortedValueIds}
      getOptionLabel={(recipientId) => options[recipientId].name}
      onChange={(recipientIds) => {
        const recipients = isNonEmptyStringArray(recipientIds)
          ? (recipientIds as string []).reduce((acc, recipientId) => ({
            ...acc,
            [recipientId]: options[recipientId]
          }), {})
          : {};
        onChange(recipients);
      }}
      {...rest}
    />
  );
};

export default FieldSelectRecipients;
