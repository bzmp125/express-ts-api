import { logger } from "..";
import redis, { tags } from "./redis";

export default (key: string) => {
  tags.push("read-from-cache");
  try {
    redis.get(key, (err: any, reply: string) => {
      if (err) {
        logger.error(
          `Exception when reading from cache, error: ${err}`,
          `${[...tags, "exception"]}`
        );
        return Promise.reject(err);
      }
      if (reply) {
        logger.info(
          `Successful Read from cache`,
          `${[...tags, "successful-cache-read"]}`
        );
        return Promise.resolve(JSON.parse(reply));
      } else {
        logger.info(`Failed Read from cache`, `${[...tags, "cache-miss"]}`);
        return Promise.resolve(null);
      }
    });
  } catch (e) {
    logger.error(
      `Exception when reading from cache, error: ${e}`,
      `${[...tags, "exception", ""]}`
    );
  }
};
