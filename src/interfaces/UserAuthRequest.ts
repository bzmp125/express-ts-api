import { Request } from "express";

export interface UserAuthRequest extends Request {
  locals: {
    user: {
      id: string;
      email: string;
    };
  };
}
