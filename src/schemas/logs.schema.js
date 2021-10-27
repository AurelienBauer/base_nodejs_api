import mongoose from 'mongoose';

/**
 * Logs Schema
 */
const logsSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    default: null,
  },
  timestamp: {
    type: Date,
    require: true,
    default: new Date(),
  },
});

export default logsSchema;
