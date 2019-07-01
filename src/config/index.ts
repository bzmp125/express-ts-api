export const serviceName = process.env.SERVICE_NAME || "";
export const serviceId = process.env.SERVICE_ID || "";

// queues
export const newAffiliatesQueueName =
  process.env.NEW_AFFILIATES_QUEUE_NAME || "q.new_affiliates";

// rabbit
export const rabbitConnection = {
  uri: process.env.RABBITMQ_URI || "",
  user: process.env.RABBITMQ_USER || "",
  pass: process.env.RABBITMQ_PASS || "",
  host: process.env.RABBITMQ_HOSTS
    ? process.env.RABBITMQ_HOSTS.replace(/ /g, "").split(",")
    : [],
  port: process.env.RABBITMQ_PORTS
    ? process.env.RABBITMQ_PORTS.replace(/ /g, "").split(",")
    : [],
  vhost: process.env.RABBITMQ_VHOST || "sbmedics-production",
  clientProperties: {
    service: serviceName
  }
};

export const allowedRunnerChangePars = ["name", "password"];

export const serviceUrl = process.env.SERVICE_URL || "";
