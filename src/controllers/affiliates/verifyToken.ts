import { Request, Response } from "express";
import { response, logger } from "../../helpers";
import { verify as jwtVerify } from "jsonwebtoken";

import { sbmedicsAuthSecret } from "../../settings/index";
export function verifyToken(req: Request, res: Response) {
  const tags = ["verify-affiliate-token", "token-verification"];
  if (req.headers.token) {
    const token = req.headers.token.toString();
    jwtVerify(token, sbmedicsAuthSecret, { audience: "affiliate" }, function(
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
          `${[...tags, "invalid-audience", "invalid-audience-affiliate-token"]}`
        );
        res.json(
          response(false, "INVALID TOKEN.", {
            message: err.message
          })
        );
      } else if (err) {
        logger.info(
          `Failed to verify Affiliate token. e: ${err}`,
          `${[
            ...tags,
            "failed-affiliate-token-verification",
            "failed-token-verification"
          ]}`
        );
        res.json(response(false, "FAILED TO VERIFY TOKEN."));
      } else {
        logger.info(
          "Affiliate Successfully verified.",
          `${[
            ...tags,
            "affiliate-token-verified",
            "successful-token-verification"
          ]}`
        );
        res.json(response(true, "AFFILIATE VERIFIED.", decodedToken));
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
}
