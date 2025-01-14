import fs from 'fs';
import path from "path";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";


const logDirectory = path.resolve('./logging');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const fileFormat = format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
)

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message} --- ${timestamp}`;
  })
);

// Create a Winston logger
const logger = (filename: string) => createLogger({
  level: "info",
  format: fileFormat,
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    // new transports.File({ filename: `${filename}.log` }),
    new DailyRotateFile({
            filename: path.join(logDirectory, `${filename}-%DATE%.log`),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
    })
  ],
});

export default logger;