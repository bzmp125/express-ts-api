import { messagingServiceUrl } from "./../../settings/index";
import Http from "../http";
export default (
  to: string,
  from: string,
  message: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const http = new Http();
    http
      .post(messagingServiceUrl, { from, to, message })
      .then((res: any) => {
        resolve(res.message == "SMS SENT.");
      })
      .catch(e => {
        reject(e);
      });
  });
};
