import jwt from 'jsonwebtoken';
import moment from 'moment-timezone';
import UserModel from '../models/user.model.js';

function _token(playload, expiresIn) {
  const _playload = Object.assign(playload, {
    iat: moment().unix(),
  });
  return jwt.sign(_playload, process.env.JWT_SECRET, { expiresIn });
}

export const generateAccessToken = (playload) => {
  const expiresIn = moment().add(process.env.JWT_EXPIRATION_DELAY, 'hours');
  const token = _token(playload, expiresIn.unix());
  return { token, expiresIn: expiresIn.toDate() };
};

export const generateRefreshToken = (playload) => {
  const expiresIn = moment().add(30, 'days').toDate();
  const token = _token(playload, 0);
  return { token, expiresIn };
};

export const getTokenInformation = async (decodedToken) => {
  if (decodedToken.isAUser) {
    const user = await UserModel.getUserByEmail(decodedToken.email);
    return {
      type: 'user',
      body: user,
    };
  }
  return {
    type: 'api',
    body: {
      name: decodedToken.apiName,
    },
  };
};
