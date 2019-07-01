import * as winston from "winston";
import * as path from "path";
import { serviceID } from "../settings";
const { format } = winston;
const { combine, label, timestamp, printf } = format;

const sbmedicsLogFormat = printf((info: any) => {
  return JSON.stringify({
    ...info,
    service: serviceID
  });
});

const container = new winston.Container();

const baseDir = `${path.join(__dirname, "/logs")}`;
const filenamePrefix = `${baseDir}/${serviceID}`;

container.add("main", {
  format: combine(
    label({ label: "SBMedics Auth API" }),
    timestamp(),
    sbmedicsLogFormat
  ),
  transports: [
    new winston.transports.Console({ level: "silly" }),
    new winston.transports.File({
      filename: `${filenamePrefix}-error.log`,
      level: "error"
    }),
    new winston.transports.File({ filename: `${filenamePrefix}.log` })
  ]
});

const logger = container.get("main");

logger.exceptions.handle(
  new winston.transports.File({ filename: `${filenamePrefix}-exceptions.log` })
);

export default logger;
