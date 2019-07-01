import { messagingServiceUrl } from "./../../settings/index";
import Http from "../http";
export default (data: any): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const http = new Http();
    http
      .post(messagingServiceUrl, data)
      .then((res: any) => {
        resolve(res.message == "SMS SENT.");
      })
      .catch(e => {
        reject(e);
      });
  });
};
