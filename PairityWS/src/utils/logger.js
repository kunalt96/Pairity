import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  winston.format.json(),
);

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format:
    process.env.NODE_ENV === "production"
      ? prodFormat
      : combine(
          colorize(),
          timestamp({ format: "HH:mm:ss" }),
          errors({ stack: true }),
          devFormat,
        ),
  transports: [
    new winston.transports.Console(),
    // In production add: new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ],
});
