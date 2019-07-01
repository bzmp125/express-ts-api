import * as rabbot from "rabbot";
import { config, accountsExchangeName } from "./config";
import { logger } from "../../helpers";

const tags = ["rabbot", "rabbot-setup"];
export const rabbitTags = ["rabbitmq"];

export function init() {
  try {
    return rabbot.configure(config);
  } catch (e) {
    throw e;
  }
}

export const Rabbot = rabbot;

// Rabbot.handle('SendSMS', (msg) => {
//   const { body } = msg;
//   msg.ack();
//   console.log("Received body", body);
// })

export function Publish(options: any) {
  try {
    rabbot.publish(accountsExchangeName, { ...options, persistent: true });
  } catch (e) {
    logger.error(`Error when publishing using rabbot, e: ${e}`, {
      tags: [...tags, "exception", "e"]
    });
  }
}
