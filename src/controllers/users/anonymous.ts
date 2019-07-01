import { Request, Response } from "express";
import {
  getAnonyUserByHash,
  createAnonyUser,
  response,
  logger,
  missingPars
} from "../../helpers";
import { sbmedicsAnonyAuthSecret, iss } from "../../settings";
import { sign as jwtSign } from "jsonwebtoken";

export default async (req: Request, res: Response) => {
  const tags = ["anony-auth"];
  const requiredPars = ["hash"];
  const missing = missingPars(requiredPars, req.body);

  if (missing.length > 0) {
    logger.error(`Missing or invalid parameters, missing: ${missing}`, {
      tags: `${[...tags, "missing-or-invalid-parameters"]}`
    });
    res.json(response(false, "MISSING OR INVALID PARAMETERS.", { missing }));
  } else {
    const { hash } = req.body;

    try {
      let user = await getAnonyUserByHash(hash);

      if (!user) {
        //user does not exist so just create a new one
        user = await createAnonyUser(hash);
      }

      const token = jwtSign(
        {
          iss,
          user: {
            id: user._id,
            hash,
            type: "anonymous"
          }
        },
        sbmedicsAnonyAuthSecret,
        { audience: "anonymous" }
      );

      res.json(response(true, "LOGIN SUCCESSFUL.", { token }));
      logger.info(`Successful anonymous login attempt for ${hash}`, {
        tags: `${[...tags, "successful-user-login"]}`
      });
    } catch (e) {
      res.status(500).json(response(false, "FAILED TO LOGIN ANONYMOUSLY."));
      logger.error(`Exception when logging in anonymously, e:${e}`, {
        tags: `${[...tags, "exception", "exception-login-anonymously"]}`
      });
    }
  }
};
