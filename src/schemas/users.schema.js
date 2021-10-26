import mongoose from 'mongoose';

/**
 * Refresh Token Schema
 */
const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    require: true,
    default: false,
  },
}, { timestamps: true });

export default usersSchema;
