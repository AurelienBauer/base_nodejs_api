import httpStatus from 'http-status';
import ErrorApi from '../services/ErrorApi.service.js';
import RefreshToken from '../models/refreshToken.model.js';
import { comparePassword, generateAccessToken } from '../services/auth.service.js';
import User from '../models/users.model.js';

const login = [
  async (req, res, next) => {
    if (req.body.username) {
      const badCredentials = new ErrorApi({
        status: httpStatus.UNAUTHORIZED,
        message: 'Wrong username or password',
        errors: ['BAD_CREDENTIALS'],
      });

      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return next(badCredentials);
      }
      const comparedPassword = await comparePassword(req.body.password, user.passwordHash);
      if (!comparedPassword) {
        return next(badCredentials);
      }

      req.user = user;
      return next();
    }

    return next(new ErrorApi({
      status: httpStatus.BAD_REQUEST,
      message: 'A username should be set in the body.',
      errors: ['USERNAME_EMPTY'],
    }));
  },

  async (req, res, next) => {
    try {
      const playload = {
        email: req.user.username,
        isAUser: true,
      };

      const tokens = {};
      tokens.accessToken = generateAccessToken(playload);

      if (process.env.USE_REFRESHTOKEN && process.env.USE_REFRESHTOKEN === '1') {
        tokens.refreshToken = await RefreshToken.generateAndInsertRefreshToken(playload);
        if (tokens.refreshToken instanceof ErrorApi) {
          return next(tokens.refreshToken);
        }
      }

      return res.status(httpStatus.OK)
        .json({
          tokens,
          message: 'Authentication successful!',
          success: true,
        });
    } catch (err) {
      return next(err);
    }
  },
];

const refreshToken = (req, res, next) => {
  try {
    const playload = {
      email: req.user.name,
      isAUser: true,
    };

    const accessToken = generateAccessToken(playload);
    return res.status(httpStatus.OK)
      .json({
        tokens: {
          accessToken,
        },
        message: 'Regenerate accessToken successfully!',
        success: true,
      });
  } catch (err) {
    return next(err);
  }
};

const status = (req, res, next) => {
  try {
    const auth = (req.user) ? req.user : req.api;
    res.status(httpStatus.OK)
      .json({
        auth,
        status: 'Authenticated',
        success: true,
      });
  } catch (err) {
    next(err);
  }
};

export { login, refreshToken, status };
