import httpStatus from 'http-status';
import ErrorApi from '../services/ErrorApi.service.js';
import RefreshToken from '../models/refreshToken.model.js';
import { generateAccessToken } from '../services/auth.service.js';

const login = [
  async (req, res, next) => {
    if (req.body.apiId && req.body.apiName) {
      if (req.body.apiId !== process.env.CLIENT_SECRET_ID
          || req.body.password !== process.env.API_PASSWORD) {
        return next(new ErrorApi({
          status: httpStatus.UNAUTHORIZED,
          message: 'Wrong apiId or password',
        }));
      }
      req.api = { name: req.body.apiName };
      return next();
    }

    if (req.body.email) {
      req.user = { email: 'useremail@shoul_be_unique.com' };
      return next();
    }

    return next(new ErrorApi({
      status: httpStatus.BAD_REQUEST,
      message: 'A email or an apiId and apiName should be set in the body.',
    }));
  },

  async (req, res, next) => {
    try {
      let playload;
      if (req.api) {
        playload = {
          apiName: req.api.name,
          isAUser: false,
        };
      } else {
        playload = {
          email: req.user.email,
          isAUser: true,
        };
      }

      const accessToken = generateAccessToken(playload);

      const refreshToken = await RefreshToken.generateAndInsertRefreshToken(playload);
      if (refreshToken instanceof ErrorApi) {
        return next(refreshToken);
      }

      return res.status(httpStatus.OK)
        .json({
          tokens: {
            accessToken,
            refreshToken,
          },
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
    let playload;
    if (req.api) {
      playload = {
        apiName: req.api.name,
        isAUser: false,
      };
    } else {
      playload = {
        email: req.user.email,
        isAUser: true,
      };
    }

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

export { login, refreshToken, status }