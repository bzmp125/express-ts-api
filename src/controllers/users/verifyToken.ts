import {
  sbmedicsAuthSecret,
  sbmedicsAnonyAuthSecret
} from "./../../settings/index";
import { Request, Response } from "express";
import { response, logger } from "../../helpers";
import { verify as jwtVerify, JsonWebTokenError, decode } from "jsonwebtoken";
import { AuthTokenPayload } from "../../interfaces";

const tags = ["verify-user-token", "token-verification"];

export default (req: Request, res: Response) => {
  if (req.headers && req.headers.token) {
    const token = req.headers.token.toString();
    const decodedToken: AuthTokenPayload = decode(token) as AuthTokenPayload;
    const secret =
      decodedToken.user.type == "user"
        ? sbmedicsAuthSecret
        : sbmedicsAnonyAuthSecret;

    try {
      jwtVerify(
        token,
        secret,
        { audience: decodedToken.aud },
        (err: JsonWebTokenError, decodedToken: any) => {
          if (
            err &&
            err.message &&
            err.message.indexOf("jwt audience invalid") > -1
          ) {
            logger.info(
              `Invalid audience, error: ${err}`,
              `${[...tags, "invalid-audience", "invalid-audience-user-token"]}`
            );
            res.json(
              response(false, "INVALID TOKEN.", {
                message: err.message
              })
            );
          } else if (err) {
            logger.info(
              `Failed to verify User token, error: ${err}`,
              `${[
                ...tags,
                "failed-user-token-verification",
                "failed-token-verification"
              ]}`
            );
            res.json(response(false, "FAILED TO VERIFY TOKEN."));
          }

          if (decodedToken != null) {
            logger.info(
              "User Successfully verified.",
              `${[...tags, "user-token-verified"]}`
            );
            res.json(response(true, "USER VERIFIED.", decodedToken));
          }
        }
      );
    } catch (e) {
      logger.error(
        `Exception when verifying user token, error: ${e}`,
        `${[...tags, "exception", "exception-verifyToken"]}`
      );
    }
  } else {
    logger.error(
      `Missing token header`,
      `${[
        ...tags,
        "missing-parameters",
        "missing-header",
        "missing-token-header"
      ]}`
    );
    res.json(
      response(false, "MISSING OR INVALID PARAMETERS.", {
        missing: ["header:token"]
      })
    );
  }
};
