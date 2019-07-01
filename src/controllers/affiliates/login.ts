import { Request, Response } from "express";
import { missingPars, response, logger } from "../../helpers";
import { Affiliate } from "../../models";
import { sign as jwtSign } from "jsonwebtoken";
import { sbmedicsAuthSecret } from "../../settings/index";

export const login = (req: Request, res: Response) => {
  const tags = ["affiliate-login"];
  const requiredPars = ["email", "password"];
  const missing = missingPars(requiredPars, req.body);

  if (missing.length > 0) {
    res.json(response(false, "MISSING OR INVALID PARAMETERS.", { missing }));
  } else {
    const { email, password } = req.body;

    Affiliate.findOne({ email }, (err, affiliate: any) => {
      if (err) {
        logger.error(
          `Error when finding affiliate, error: ${err}`,
          `${[...tags, "error-finding-affiliate"]}`
        );
        res.json(response(false, "FAILED TO FIND ADMIN."));
        return;
      }

      if (!affiliate) {
        logger.error(
          `Invalid email credentials for ${email}`,
          `${[...tags, "invalid-credentials", "invalid-affiliate-email"]}`
        );
        res.json(response(false, "INVALID CREDENTIALS."));
        return;
      } else {
        affiliate.comparePassword(
          password,
          (err: any, passwordIsCorrect: boolean) => {
            if (err) res.json(response(false, "FAILED TO VERIFY PASSWORD."));
            if (passwordIsCorrect == true) {
              // create token
              const token = jwtSign(
                {
                  iss: "auth.freshinabox.co.zw",
                  subject: email,
                  user: {
                    id: affiliate.id,
                    email
                  },
                  aud: "affiliate"
                },
                sbmedicsAuthSecret,
                { expiresIn: "1d" }
              );
              logger.info(
                `Affiliate loging in successful for ${email}`,
                `${[...tags, "login-successful", "affiliate-login-successful"]}`
              );
              res.json(
                response(true, "LOGIN SUCCESSFUL.", {
                  token
                })
              );
            } else {
              logger.error(
                `Invalid password credentials for ${email}`,
                `${[
                  ...tags,
                  "invalid-credentials",
                  "invalid-affiliate-password"
                ]}`
              );
              res.json(response(false, "INCORRECT CREDENTIALS."));
            }
          }
        );
      }
    }).catch(e => {
      logger.error(
        `Exception when Affiliate.findOne, error: ${e}`,
        `${[...tags, "failed-affiliate-login", "exception"]}`
      );
      res.json(response(false, "SERVER ERROR."));
    });
  }
};
