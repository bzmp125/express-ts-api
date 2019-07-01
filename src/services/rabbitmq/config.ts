import {
  rabbitConnection as connection,
  newAffiliatesQueueName
} from "../../config";

export const accountsExchangeName = "ex.accounts";

export const config = {
  connection,
  exchanges: [
    {
      name: accountsExchangeName,
      type: "direct",
      autoDelete: false
    }
  ],
  queues: [
    {
      name: newAffiliatesQueueName,
      autoDelete: false,
      subscribe: true
    }
  ],
  bindings: [
    {
      exchange: accountsExchangeName,
      target: newAffiliatesQueueName,
      keys: ["create_affiliate"]
    }
  ]
};
