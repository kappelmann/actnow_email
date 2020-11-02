import axios from "axios";
import URLS from  "../consts/urls";
import { MEPS } from  "../consts/databases";
import {
  configPath,
  databasePath
} from  "../utils";

export type getDatabaseType = {
  onDownloadProgress?: (progressEvent: ProgressEvent) => any,
  version?: string
}

export const getDatabase = ({
  onDownloadProgress,
  version
} : getDatabaseType) => (
  axios.request<ArrayBuffer>({
    method: "get",
    url: databasePath(URLS.DATABASES.MEPS, MEPS, version),
    responseType: "arraybuffer",
    onDownloadProgress
  })
);

export type getDatabaseConfigType = {
  onDownloadProgress?: (progressEvent: ProgressEvent) => any
}

export const getDatabaseConfig = ({
  onDownloadProgress
} : getDatabaseConfigType) => (
  axios.request({
    method: "get",
    url: configPath(URLS.DATABASES.MEPS, MEPS),
    responseType: "json",
    onDownloadProgress
  })
);

