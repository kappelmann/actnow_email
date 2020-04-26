import axios, {
  AxiosPromise
} from "axios";
import { MEP_DB } from  './consts/urls';

export const getDb = () => (
  axios.request<ArrayBuffer>({
    method: "get",
    url: MEP_DB,
    responseType: "arraybuffer"
  })
);
