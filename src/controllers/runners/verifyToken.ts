import { Request, Response } from "express";
import { response, logger } from "../../helpers";
import { verify as jwtVerify } from "jsonwebtoken";

import { sbmedicsAuthSecret } from "../../settings/index";
export default (req: Request, res: Response) => {
  const tags = ["verify-runner-token", "token-verification"];
  if (req.headers.token) {
    const token = req.headers.token.toString();
    jwtVerify(token, sbmedicsAuthSecret, { audience: "runner" }, function(
      err: any,
      decodedToken: any
    ) {
      if (
        err &&
        err.message &&
        err.message.indexOf("jwt audience invalid") > -1
      ) {
        logger.info(
          `Invalid audience, error: ${err}`,
          `${[...tags, "invalid-audience", "invalid-audience-runner-token"]}`
        );
        res.json(
          response(false, "INVALID TOKEN.", {
            message: err.message
          })
        );
      } else if (err) {
        logger.info(
          `Failed to verify Runner token. e: ${err}`,
          `${[
            ...tags,
            "failed-runner-token-verification",
            "failed-token-verification"
          ]}`
        );
        res.json(response(false, "FAILED TO VERIFY TOKEN."));
      } else {
        logger.info(
          "Runner Successfully verified.",
          `${[
            ...tags,
            "runner-token-verified",
            "successful-token-verification"
          ]}`
        );
        res.json(response(true, "RUNNER VERIFIED.", decodedToken));
      }
    });
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
    res.json(response(false, "MISSING TOKEN."));
  }
};
