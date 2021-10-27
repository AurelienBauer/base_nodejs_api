import jwt from 'jsonwebtoken';
import moment from 'moment-timezone';
import bcrypt from 'bcrypt';
import Users from '../models/users.model.js';

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
  const user = await Users.findOne({ username: decodedToken.username, isDeleted: false });
  return {
    body: {
      _id: user._id,
      username: user.username,
    },
  };
};

export const cryptPassword = (password) => new Promise((resolve, reject) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return reject(err);

    return bcrypt.hash(password, salt, (hashErr, hash) => (err ? reject(hashErr) : resolve(hash)));
  });
});

export const comparePassword = (password, hashPassword) => new Promise(
  (resolve, reject) => bcrypt.compare(
    password,
    hashPassword,
    (err, isPasswordMatch) => (err ? reject(err) : resolve(isPasswordMatch)),
  ),
);
