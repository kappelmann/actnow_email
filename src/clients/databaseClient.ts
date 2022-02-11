import axios from "axios";

import { DatabaseLocation } from "../databases/databaseLocations";
import {
  databaseConfigPath,
  databasePath
} from  "../utils";

export type getDatabaseType = {
  databaseLocation: DatabaseLocation,
  onDownloadProgress?: (progressEvent: ProgressEvent) => any,
  version?: string
}

export const getDatabase = ({
  databaseLocation,
  onDownloadProgress,
  version
} : getDatabaseType) => (
  axios.request<ArrayBuffer>({
    method: "get",
    url: databasePath(databaseLocation, version),
    responseType: "arraybuffer",
    onDownloadProgress
  })
);

export type getDatabaseConfigType = {
  databaseLocation: DatabaseLocation,
  onDownloadProgress?: (progressEvent: ProgressEvent) => any
}

export const getDatabaseConfig = ({
  databaseLocation,
  onDownloadProgress
} : getDatabaseConfigType) => (
  axios.request({
    method: "get",
    url: databaseConfigPath(databaseLocation),
    responseType: "json",
    onDownloadProgress
  })
);

