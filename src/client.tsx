import axios from "axios";
import { MEP_DB } from  "./consts/urls";

export type getDatabaseType = {
  onDownloadProgress?: (progressEvent: ProgressEvent) => any
}

export const getDatabase = ({
  onDownloadProgress = undefined
} : getDatabaseType) => (
  axios.request<ArrayBuffer>({
    method: "get",
    url: MEP_DB,
    responseType: "arraybuffer",
    onDownloadProgress
  })
);

