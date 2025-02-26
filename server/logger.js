import winston from "winston";
import path from "path";
import fs from "fs";
import DailyRotateFile from "winston-daily-rotate-file";

// Ensure logs directory exists
const baseLogDir = process.env.LOG_PATH || "logs";
const currentDate = new Date().toISOString().split("T")[0];
const logDir = path.join(baseLogDir, currentDate);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.printf(
  ({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] [${level.toUpperCase()}] - ${message} \nStack: ${stack}\n`
      : `[${timestamp}] [${level.toUpperCase()}] - ${message}`;
  }
);

const transportsArr = [
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), logFormat),
  }),
  new DailyRotateFile({
    dirname: logDir,
    filename: "app-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      logFormat
    ),
  }),
  new DailyRotateFile({
    dirname: logDir,
    filename: "errors-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    level: "error",
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      logFormat
    ),
  }),
];

// Create logger instance
const logger = winston.createLogger({
  level: "info",
  transports: transportsArr,
});

export default logger;
