import { Request, Response } from "express";
import { missingPars, response, logger } from "../../helpers";
import User from "../../models/user";

const tags = ["auth", "user-auth", "user-signup"];
// tslint:disable:variable-name

export default (req: Request, res: Response) => {
  const requiredPars = ["email", "name", "password"];
  const missing = missingPars(requiredPars, req.body);
  if (missing.length == 0) {
    const { email, name, password } = req.body;

    //check if any already exists
    User.findOne({ email })
      .then((similarUser: any) => {
        if (similarUser) {
          //an account already exists with that email
          logger.info(
            `Similar account exists with email ${email}`,
            `${[...tags, "similar-account-exists"]}`
          );
          res.json(response(false, "SIMILAR ACCOUNT ALREADY EXISTS."));
        } else {
          //create new account
          const newUser = new User({ email, name, password });
          newUser
            .save()
            .then((user: any) => {
              //account created.
              console.log({
                id: user.id,
                email,
                name
              });
              logger.info(
                `Account Created ${email}`,
                `${[...tags, "account-created"]}`
              );
              res.json(
                response(true, "REGISTRATION SUCCESSFUL.", {
                  id: user.id,
                  email,
                  name
                })
              );
            })
            .catch(e => {
              logger.error(
                `Failed to create account for ${email}, error: ${e}`,
                `${[...tags, "failed-to-create-account"]}`
              );
              res
                .status(500)
                .json(response(false, "FAILED TO CREATE ACCOUNT."));
            });
        }
      })
      .catch(e => {
        logger.error(
          `Exception when getting similar user for ${email}, error:${e}`,
          `${[...tags, "exception", "exception-login"]}`
        );
        res.status(500).json(response(false, "FAILED TO CREATE ACCOUNT."));
      });
  } else {
    logger.error(
      `Missing parameters: ${missing.join(", ")}`,
      `${[...tags, "missing-parameters"]}`
    );
    res.json(response(false, "MISSING OR INVALID PARAMETERS.", { missing }));
  }
};
