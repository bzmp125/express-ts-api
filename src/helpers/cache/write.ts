import redis, { tags } from "./redis";
import logger from "../logger";

export default (key: string, value: any, expiry: number) => {
  tags.push("save-to-cache");
  try {
    redis.set(key, JSON.stringify(value), "EX", expiry);
    logger.info(
      `Saved ${key} to cache`,
      `${[...tags, "successful-cache-cache"]}`
    );
    return Promise.resolve();
  } catch (e) {
    logger.error(
      `Exception when saving to cache, error: ${e}`,
      `${[...tags, "exception", "exception-cache/write"]}`
    );
    return Promise.reject(e);
  }
};
