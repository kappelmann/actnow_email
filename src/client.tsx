import axios from "axios";
import URLS from  "./consts/urls";

export type getDatabaseType = {
  onDownloadProgress?: (progressEvent: ProgressEvent) => any
}

export const getDatabase = ({
  onDownloadProgress = undefined
} : getDatabaseType) => (
  axios.request<ArrayBuffer>({
    method: "get",
    url: URLS.MEP_DB,
    responseType: "arraybuffer",
    onDownloadProgress
  })
);

