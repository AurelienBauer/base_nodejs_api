import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import moment from 'moment-timezone';
import ErrorApi from '../services/ErrorApi.service.js';
import RefreshToken from '../models/refreshToken.model.js';
import { getTokenInformation } from '../services/auth.service.js';
import { logRequestIfLogged } from '../services/logger.service.js';

const checkToken = [
  (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers.authorization;

    if (token) {
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
      }
      return jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return next(new ErrorApi({
            status: httpStatus.UNAUTHORIZED,
            message: 'Token is not valid',
          }));
        }
        const info = await getTokenInformation(decoded);
        req.user = info.body;
        return next();
      });
    }
    return next(new ErrorApi({
      status: httpStatus.UNAUTHORIZED,
      message: 'Auth token is not supplied',
    }));
  },
  logRequestIfLogged,
];

const checkRefreshToken = async (req, res, next) => {
  let token = req.body.refreshToken;

  if (!process.env.USE_REFRESHTOKEN || process.env.USE_REFRESHTOKEN === '0') {
    return next(new ErrorApi({
      status: httpStatus.UNAUTHORIZED,
      message: 'RefreshToken feature is not unable.',
    }));
  }

  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    const refreshToken = await RefreshToken.findOne({ token });
    if (!refreshToken) {
      return next(new ErrorApi({
        status: httpStatus.UNAUTHORIZED,
        message: 'RefreshToken is not valid',
      }));
    }

    if (Date.parse(moment().toDate()) > Date.parse(refreshToken.expiresIn)) {
      return next(new ErrorApi({
        status: httpStatus.UNAUTHORIZED,
        message: 'refreshToken expired',
      }));
    }

    const decoded = jwt.decode(refreshToken.token);
    const info = await getTokenInformation(decoded);
    req.user = info.body;
    return next();
  }

  return next(new ErrorApi({
    status: httpStatus.UNAUTHORIZED,
    message: 'Auth token is not supplied.',
  }));
};

export { checkToken, checkRefreshToken };
