import winston from 'winston';
import LogToDbTransport from './LogToDbTransport.js';

export const loggerSt = Object.freeze({
  DB: 'db',
  FILE: 'file',
  ALL: 'all',
});

const transports = [];
if (process.env.LOGGER === loggerSt.FILE || process.env.LOGGER === loggerSt.ALL) {
  transports.push(new winston.transports.File({ filename: 'error.log', level: 'error' }));
  transports.push(new winston.transports.File({ filename: 'combined.log' }));
}
if (process.env.LOGGER === loggerSt.DB || process.env.LOGGER === loggerSt.ALL) {
  transports.push(new LogToDbTransport());
}

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  defaultMeta: { service: process.env.PROJECT_NAME },
  transports,
});

if (process.env.NODE_ENV === 'development' || process.env.RUN_ON_DOCKER === '1') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }));
}

export const logRequestIfNotLogged = (req, res, next) => {
  if (!req.headers['x-access-token'] && !req.headers.authorization) {
    logger.info(req.url);
  }
  next();
};

export const logRequestIfLogged = (req, res, next) => {
  logger.info({
    message: req.url,
    userId: req.user._id || null,
  });
  next();
};
