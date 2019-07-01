import { Request, Response } from "express";
import { sbmedicsAuthSecret, iss } from "../../settings";
import { sign as jwtSign } from "jsonwebtoken";
import { missingPars, response, logger } from "../../helpers";
import User from "../../models/user";

const tags = ["auth", "user-auth", "user-login"];
// tslint:disable:variable-name
export default (req: Request, res: Response) => {
  const requiredPars = ["email", "password"];
  const missing = missingPars(requiredPars, req.body);
  if (missing.length == 0) {
    const { email, password } = req.body;

    User.findOne({ email })
      .then((user: any) => {
        if (!user) {
          res.status(404).json(response(false, "USER NOT FOUND."));
        } else {
          user.comparePassword(
            password,
            (err: any, passwordIsCorrect: boolean) => {
              if (err != null) {
                logger.info(`Failed to verify password for ${email}`, {
                  tags: `${[...tags, "failed-user-password-verification"]}`
                });
                res.json(response(false, "FAILED TO VERIFY CREDENTIALS."));
              } else {
                if (passwordIsCorrect) {
                  // create token
                  const token = jwtSign(
                    {
                      iss,
                      user: {
                        id: user.id,
                        email,
                        type: "user"
                      }
                    },
                    sbmedicsAuthSecret,
                    { audience: "user" }
                  );
                  res.json(response(true, "LOGIN SUCCESSFUL.", { token }));
                  logger.info(`Successful login attempt for ${email}`, {
                    tags: `${[...tags, "successful-user-login"]}`
                  });
                } else {
                  logger.info(`Invalid password attempt`, {
                    tags: `${[...tags, "invalid-user-password"]}`
                  });
                  res.json(response(false, "INVALID CREDENTIALS."));
                }
              }
            }
          );
        }
      })
      .catch(e => {
        logger.error(
          `Exception when finding User ${email} ${e}`,
          `${[
            ...tags,
            "failed-user-retrieval",
            "exception",
            "exception-login"
          ]}`
        );
        res.status(500).json(response(true, "FAILED TO LOGIN."));
      });
  } else {
    logger.error(
      `Missing parameters: ${missing.join(", ")}`,
      `${[...tags, "missing-parameters"]}`
    );
    res.send(response(false, "MISSING OR INVALID PARAMETERS.", { missing }));
  }
};
