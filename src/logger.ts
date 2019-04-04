import { serviceName, serviceId } from './config/index';
import * as winston from 'winston';
import * as path from 'path';

const { format } = winston;
const { combine, label, timestamp, printf } = format;

const logFormat = printf( (info:any) => {
    return JSON.stringify({
        ...info,
        service: serviceId
    })
})

const container = new winston.Container();

const logsPath = `logs`;
const filenamePrefix = `${path.join(__dirname, logsPath, serviceId)}`;

container.add('main', {
    format: combine(
        label({ label: serviceName }),
        timestamp(),
        logFormat
    ),
    transports: [
        new winston.transports.Console({ level: 'silly' }),
        new winston.transports.File({ filename: `${filenamePrefix}-error.log`, level: 'error' }),
        new winston.transports.File({ filename: `${filenamePrefix}.log`})
    ]
})

export const logger = container.get('main');

logger.exceptions.handle(
    new winston.transports.File({ filename: `${filenamePrefix}-exceptions.log` })
)