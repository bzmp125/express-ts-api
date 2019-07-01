import User from "../../models/user";
import logger from "../logger";

export default async (email: string) => {
  const tags = ["reverse-account-creation"];
  try {
    await User.deleteMany({ email });
    logger.info(
      `Account Creation Reversed for ${email}`,
      `${[...tags, "account-creation-reversed"]}`
    );
  } catch (e) {
    logger.error(
      `Exception when reversing account creation for ${email}, error: ${e}`,
      `${[...tags, "exception", "exception-reverse-account-creation"]}`
    );
  }
};
