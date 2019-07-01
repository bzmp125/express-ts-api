import { IAppResponse } from "../../interfaces/AppResponse";

export default function(
  success: boolean,
  message: string,
  data?: any
): IAppResponse {
  const r: IAppResponse = {
    success,
    message
  };

  if (data != null) {
    r.data = data;
  }
  return r;
}
