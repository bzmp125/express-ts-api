import { Response, NextFunction } from "express";
import { sign as jwtVerify } from "jsonwebtoken";
import { sbmedicsAuthSecret } from "../settings/index";
import { response, logger } from "../helpers";

export default (req: any, res: Response, next: NextFunction) => {
  if (req.headers.token) {
    const token = req.headers.token.toString();
    jwtVerify(token, sbmedicsAuthSecret, { audience: "admin" }, function(
      err: any,
      decodedToken: any
    ) {
      if (
        err &&
        err.message &&
        err.message.indexOf("jwt audience invalid") > -1
      ) {
        return res.json(
          response(false, "INVALID TOKEN.", {
            message: err.message
          })
        );
      } else if (err) {
        logger.error(`${err}`);
        return res.json(response(false, "FAILED TO VERIFY TOKEN."));
      } else {
        if (!req.locals) req.locals = decodedToken;

        return next();
      }
    });
    return;
  } else {
    return res.json(response(false, "MISSING TOKEN."));
  }
};
