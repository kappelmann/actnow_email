export enum QueryParamsKeys {
  ToIds = "to_ids",
  CcIds = "cc_ids",
  BccIds = "bcc_ids",
  To = "to",
  Cc = "cc",
  Bcc = "bcc",
  MailSubject = "mail_subject",
  MailBody = "mail_body",
  ShortAlias = "short_alias",
  Open = "open",
}

export type QueryParams = {
  [QueryParamsKeys.ToIds]?: string[],
  [QueryParamsKeys.CcIds]?: string[],
  [QueryParamsKeys.BccIds]?: string[],
  [QueryParamsKeys.To]?: string[],
  [QueryParamsKeys.Cc]?: string[],
  [QueryParamsKeys.Bcc]?: string[],
  [QueryParamsKeys.MailSubject]?: string,
  [QueryParamsKeys.MailBody]?: string,
  [QueryParamsKeys.ShortAlias]?: string,
  [QueryParamsKeys.Open]?: string
};
