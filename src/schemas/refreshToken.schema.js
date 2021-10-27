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
    ref: 'User',
    unique: false,
  },
  expiresIn: {
    type: Date,
    require: true,
  },
}, { timestamps: true });

export default refreshTokenSchema;
