import mongoose from 'mongoose';

/**
 * User Schema
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
