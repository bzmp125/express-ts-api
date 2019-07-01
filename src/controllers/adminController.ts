import { Request, Response } from "express";
import { response, missingPars, logger } from "../helpers";
import { sbmedicsAuthSecret } from "../settings";
import Admin from "../models/admin";
import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";

const loginRequiredPars = ["email", "password"];

// tslint:disable:variable-name
export function login(req: Request, res: Response) {
  const tags = ["admin-login"];
  const missing = missingPars(loginRequiredPars, req.body);
  if (missing.length > 0) {
    res.json(response(false, "MISSING_PARS", missing));
    logger.error(
      `Missing admin login parameters: ${missing.join(",")}`,
      `${[...tags, "missing-parameters", "missing-admin-login-parameters"]}`
    );
  } else {
    const { email, password } = req.body;

    Admin.findOne({ email }, (err, admin: any) => {
      if (err) {
        logger.error(
          `Error when finding admin, error: ${err}`,
          `${[...tags, "error-finding-admin"]}`
        );
        res.json(response(false, "FAILED TO FIND ADMIN."));
        return;
      }

      if (!admin) {
        logger.error(
          `Invalid email credentials for ${email}`,
          `${[...tags, "invalid-credentials", "invalid-admin-email"]}`
        );
        res.json(response(false, "INVALID CREDENTIALS."));
        return;
      } else {
        admin.comparePassword(
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
                    id: admin.id,
                    email,
                    realm: email.split("@")[1]
                  },
                  aud: "admin"
                },
                sbmedicsAuthSecret,
                { expiresIn: "1d" }
              );
              logger.info(
                `Admin loging in successful for ${email}`,
                `${[...tags, "login-successful", "admin-login-successful"]}`
              );
              res.json(response(true, "LOGIN SUCCESSFUL.", { token }));
            } else {
              logger.error(
                `Invalid password credentials for ${email}`,
                `${[...tags, "invalid-credentials", "invalid-admin-password"]}`
              );
              res.json(response(false, "INCORRECT CREDENTIALS."));
            }
          }
        );
      }
    }).catch(e => {
      logger.error(
        `Exception when Admin.findOne, error: ${e}`,
        `${[...tags, "failed-admin-login", "exception"]}`
      );
      res.json(response(false, "SERVER ERROR."));
    });
  }
}

export function verifyToken(req: Request, res: Response) {
  const tags = ["verify-admin-token", "token-verification"];
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
        logger.info(
          `Invalid audience, error: ${err}`,
          `${[...tags, "invalid-audience", "invalid-audience-admin-token"]}`
        );
        res.json(
          response(false, "INVALID TOKEN.", {
            message: err.message
          })
        );
      } else if (err) {
        logger.info(
          "Failed to verify Admin token.",
          `${[
            ...tags,
            "failed-admin-token-verification",
            "failed-token-verification"
          ]}`
        );
        res.json(response(false, "FAILED TO VERIFY TOKEN."));
      } else {
        logger.info(
          "Admin Successfully verified.",
          `${[
            ...tags,
            "admin-token-verified",
            "successful-token-verification"
          ]}`
        );
        res.json(response(true, "ADMIN VERIFIED.", decodedToken));
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

// export function register(_req: Request, res: Response) {

// }
