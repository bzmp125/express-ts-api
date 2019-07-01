import { sendEmail } from "../../../helpers/messaging";
import { logger } from "../../../helpers";
export default (job: any) => {
  return new Promise((resolve, reject) => {
    try {
      const { from, to, email: message, subject } = job.data;
      const tags = job.data.tags ? job.data.tags : [];
      tags.push("messaging");

      sendEmail({ to, from, email: message, subject })
        .then((emailSent: boolean) => {
          //email sent
          if (emailSent) {
            logger.info(
              `Email sent to ${to}`,
              `${[...tags, "email-sent", "messaging"]}`
            );
          } else {
            logger.info(
              `Email not sent to ${to}`,
              `${[...tags, "email-not-sent", "messaging"]}`
            );
          }
          resolve();
        })
        .catch(e => {
          logger.error(
            `Exception when sending email to ${to}, ERROR: ${e}`,
            `${[...tags, "exception", "exception-sendEmailProcessor"]}`
          );
          reject();
        });
      resolve();
    } catch (e) {
      logger.error(
        `Exception in sendEmailProcessor, ERROR: ${e}`,
        `${["exception", "exception-sendEmailProcessor#try"]}`
      );
      reject(e);
    }
  });
};
