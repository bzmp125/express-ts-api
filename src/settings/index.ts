/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  const parsedPort = parseInt(val, 10);

  if (isNaN(parsedPort)) {
    // named pipe
    return val;
  }

  if (parsedPort >= 0) {
    // port number
    return parsedPort;
  }

  return false;
}

export const port = normalizePort(process.env.PORT || "8080");
export const dbUrl = process.env.DATABASE_URI || "";
export const redisUrl = process.env.REDISCLOUD_URL || "";
export const messagingServiceUrl = process.env.MESSAGING_SERVICE_URL || "";
export const sbmedicsAuthSecret = process.env.SBMEDICSAS || "";
export const sbmedicsAnonyAuthSecret = process.env.SBMEDICSAAS || "";
export const bullRedisURL = process.env.BULL_REDIS_URL || "";
export const serviceName = process.env.SERVICE_NAME || "";
export const serviceID = process.env.SERVICE_ID || "";
export const serviceUrl = process.env.SERVICE_URL || "";

export const iss = "auth.sbmedics.co.uk";
