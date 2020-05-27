import axios from "axios";
import Url from  "./consts/urls";

export type getDatabaseType = {
  onDownloadProgress?: (progressEvent: ProgressEvent) => any
}

export const getDatabase = ({
  onDownloadProgress
} : getDatabaseType) => (
  axios.request<ArrayBuffer>({
    method: "get",
    url: Url.MepDb,
    responseType: "arraybuffer",
    onDownloadProgress
  })
);

