import { sendEmailQueue } from "./../../services/bull/index";
import { Request, Response } from "express";
import {
  missingPars,
  response,
  logger,
  generateCode,
  censorEmail,
  generatePasswordChangeLink
} from "../../helpers";
import User from "../../models/user";
import emailTemplates from "../../templates/emailTemplates";
import { serviceName } from "../../settings";
const emailTemplateKey = "reset-password";
export default (req: Request, res: Response) => {
  const tags = ["reset-password"];
  const requiredPars = ["email"];
  const missing = missingPars(requiredPars, req.body);

  if (missing.length == 0) {
    const { email } = req.body;

    //making this scalable to accept a send_via parameter to specify.
    const messageTypes = ["email", "sms"]; // send password reset code via ...
    let { send_via } = req.body;
    if (!send_via) send_via = messageTypes[0];

    if (!send_via && messageTypes.indexOf(send_via) == -1) {
      logger.error(
        `Invalid send via for ${email}`,
        `${[...tags, "invalid-send-type"]}`
      );
      res.json(response(false, "INVALID SEND VIA."));
    } else {
      //find user then generate a code then send via email
      User.findOne({ email })
        .then((user: any) => {
          if (user) {
            //generate code
            const code = generateCode();

            //then send it in a separate thread
            //bull here

            //get the email template
            const { subject, template } = emailTemplates[emailTemplateKey];
            const resetLink = generatePasswordChangeLink(code);

            const message = template
              .replace("{{ServiceName}}", serviceName)
              .replace("{{email}}", censorEmail(email))
              .replace("{{link}}", resetLink);
            sendEmailQueue.add({
              from: "FreshInABox",
              to: email,
              message,
              subject
            });
            res.json(response(true, "PASSWORD RESET."));
            logger.info(`Password Reset started for ${email}`, `${[...tags]}`);
          } else {
            res.json(response(false, "USER NOT FOUND."));
            logger.error(
              `User: ${email} not found for resetPassword`,
              `${[...tags, "user-not-found", "failed-password-reset"]}`
            );
          }
        })
        .catch(e => {
          logger.error(
            `Exception when finding user: ${email} for resetPassword, ERROR: ${e}`,
            `${[
              ...tags,
              "exception",
              "exception-resetPassword:User.find",
              "failed-password-reset"
            ]}`
          );
          res.json(response(false, "FAILED TO FIND USER."));
        });
    }
  } else {
    logger.error(
      `Missing parameters: ${missing.join(", ")}`,
      `${[...tags, "missing-parameters"]}`
    );
    res.send(response(false, "MISSING OR INVALID PARAMETERS.", { missing }));
  }
};
