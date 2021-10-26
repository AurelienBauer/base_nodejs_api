import { body } from 'express-validator';
import checkResult from './checkResult.js';

const loginUserValidator = [
  body('email').isEmail().optional(),
  body('apiId').isString().optional(),
  body('password').exists().isLength({ min: 6 }),
  checkResult,
];

const refreshTokenValidator = [
  body('refreshToken').isString(),
  checkResult,
];

export { loginUserValidator, refreshTokenValidator };
