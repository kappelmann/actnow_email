import axios from "axios";
import URLS from  "../consts/urls";
import qs from "qs";

export type Credentials = {
  signature: string,
  timestamp: number,
  hash: string
};

export const getCredentials = () => (
  axios.request<Credentials>({
    method: "get",
    url: URLS.SHORT_LINK_CREDENTIALS,
    responseType: "json"
  })
);

export type Descriptor = {
  keyword?: string,
  title?: string
};

export type Result = {
  status: "success" | "fail",
  code?: string,
  message: string,
  shorturl?: string,
  statusCode: number,
  title?: string,
  url?: {
    date: string,
    ip: string,
    keyword: string,
    title: string,
    url: string,
    clicks?: string
  }
};

export const shortenLink = (url : string, keyword?: string) => (
  getCredentials()
  .then(({ data: credentials }) => (
    axios.request<Result>({
      method: "post",
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      url: URLS.SHORTEN_LINK,
      responseType: "json",
      data: qs.stringify({
        ...credentials,
        action: "shorturl",
        format: "json",
        url,
        keyword
      })
    })
  ))
);

