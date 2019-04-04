export const isDev = process.env.ENV == 'dev'
export const serviceName = process.env.SERVICE_NAME || '';
export const serviceId = process.env.SERVICE_ID || '';
export const paymentsAPIBaseURL = process.env.PAYMENTS_API_URL || '';

//paynow
const paynowIntegrationId = process.env.PAYNOW_INTEGRATION_ID || '';
const paynowIntegrationKey = process.env.PAYNOW_INTEGRATION_KEY || '';
export const paynow = [paynowIntegrationId, paynowIntegrationKey];