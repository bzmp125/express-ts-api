import { Request, Response } from "express";
import { missingPars, response, createAffiliate, logger } from "../../helpers";
import { Affiliate } from "../../models";

import { Publish, rabbitTags } from "../../services/rabbitmq";

export const register = async (req: Request, res: Response) => {
  const tags = ["register-affiliate"];
  const requiredPars = ["name", "email", "password"];
  const missing = missingPars(requiredPars, req.body);

  if (missing.length > 0) {
    res.json(response(false, "MISSING OR INVALID PARAMETERS.", { missing }));
  } else {
    const { name, email, password } = req.body;

    try {
      const affiliateAlreadyExists =
        (await Affiliate.findOne({ email })) != null;
      if (affiliateAlreadyExists) {
        res.json(response(false, "USER ALREADY EXISTS."));
      } else {
        const newAffiliate = await createAffiliate(name, email, password);
        if (newAffiliate.id) {
          res.json(response(true, "REGISTRATION SUCCESSFUL.", newAffiliate));
          logger.info(`User ${email} successfully registered.`, {
            tags: [...tags, "registration-successful"]
          });
          // post event.

          const type = "AffiliateAccountCreated";
          const routingKey = "create_affiliate";

          //clean this code, there should be on
          try {
            await Publish({
              type,
              routingKey,
              body: { name, email, id: newAffiliate.id }
            });
            logger.info(`${type} for user ${email}, published to exchange`, {
              tags: [...rabbitTags, "rabbitmq-publish"]
            });
          } catch (e) {
            logger.error(
              `Exception when publishing to ${type} for ${email}, e: ${e}`,
              {
                tags: [
                  ...rabbitTags,
                  "exception",
                  "exception-publishing-exchange",
                  `exception-publish:${type}`
                ]
              }
            );
          }
        } else {
          res.json(response(false, "REGISTRATION UNSUCCESSFUL."));
          logger.error(`User ${email} not successfully registered.`, {
            tags: [...tags, "registration-not-successful"]
          });
        }
      }
    } catch (e) {
      logger.error(`Failed to create account for ${email}.`, {
        tags: [...tags, "failed-to-create-account"]
      });
      res.status(500).json(response(false, "FAILED TO CREATE ACCOUNT."));
    }
  }
};
