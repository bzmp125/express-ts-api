import { Request, Response } from "express";
import { missingPars, response, logger } from "../../helpers";
import { Runner } from "../../models";
import { sign as jwtSign } from "jsonwebtoken";
import { sbmedicsAuthSecret } from "../../settings/index";

export default (req: Request, res: Response) => {
  const tags = ["runner-login"];
  const requiredPars = ["email", "password"];
  const missing = missingPars(requiredPars, req.body);

  if (missing.length > 0) {
    res.json(response(false, "MISSING OR INVALID PARAMETERS.", { missing }));
  } else {
    const { email, password } = req.body;

    Runner.findOne({ email }, (err, runner: any) => {
      if (err) {
        logger.error(
          `Error when finding runner, error: ${err}`,
          `${[...tags, "error-finding-runner"]}`
        );
        res.json(response(false, "FAILED TO FIND ADMIN."));
        return;
      }

      if (!runner) {
        logger.error(
          `Invalid email credentials for ${email}`,
          `${[...tags, "invalid-credentials", "invalid-runner-email"]}`
        );
        res.json(response(false, "INVALID CREDENTIALS."));
        return;
      } else {
        runner.comparePassword(
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
                    id: runner.id,
                    email
                  },
                  aud: "runner"
                },
                sbmedicsAuthSecret,
                { expiresIn: "1d" }
              );
              logger.info(
                `Runner loging in successful for ${email}`,
                `${[...tags, "login-successful", "runner-login-successful"]}`
              );
              res.json(
                response(true, "LOGIN SUCCESSFUL.", {
                  token
                })
              );
            } else {
              logger.error(
                `Invalid password credentials for ${email}`,
                `${[...tags, "invalid-credentials", "invalid-runner-password"]}`
              );
              res.json(response(false, "INCORRECT CREDENTIALS."));
            }
          }
        );
      }
    }).catch(e => {
      logger.error(
        `Exception when Runner.findOne, error: ${e}`,
        `${[...tags, "failed-runner-login", "exception"]}`
      );
      res.json(response(false, "SERVER ERROR."));
    });
  }
};
