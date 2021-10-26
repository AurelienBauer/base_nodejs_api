import httpStatus from 'http-status';
import { logger } from '../services/logger.service.js';
import ErrorApi from '../services/ErrorApi.service.js';

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
export const handler = (err, req, res, next) => {
  let error = err;
  if (!(err instanceof ErrorApi)) {
    error = new ErrorApi(err);
  }
  const response = {
    code: error.status || error.statusCode,
    message: error.message,
    errors: error.errors,
    stack: error.stack,
    success: false,
  };

  logger.error(err);

  res.status(response.code).json(response);
  next();
};

export const notFound = (req, res, next) => {
  const err = new ErrorApi({
    status: httpStatus.NOT_FOUND,
  });
  handler(err, req, res, next);
};
