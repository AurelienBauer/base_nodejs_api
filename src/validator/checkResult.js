import { validationResult } from 'express-validator';
import httpStatus from 'http-status';
import ErrorApi from '../services/ErrorApi.service.js';

const checkResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorApi({
      status: httpStatus.BAD_REQUEST,
      message: 'Validation error',
      errors: errors.array(),
    }));
  }
  return next();
};

export default checkResult;
