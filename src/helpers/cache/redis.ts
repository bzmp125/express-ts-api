import { createClient } from "redis";
import { redisUrl } from "../../settings";
import { logger } from "..";

const client = createClient(redisUrl);
export const tags = ["redis"];
client.on("error", err => {
  logger.error(
    `REDIS ERROR: ${err}`,
    `${[...tags, "redis-error", "exception"]}`
  );
});

export default client;
