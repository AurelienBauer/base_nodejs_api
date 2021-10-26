import mongoose from 'mongoose';

/**
 * Refresh Token Schema
 */
const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: false,
  },
  user: {
    type: 'String',
    unique: true,
    require: true,
  },
  expiresIn: {
    type: Date,
    require: true,
  },
});

export default refreshTokenSchema;
