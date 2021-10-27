import mongoose from 'mongoose';
import logsSchema from '../schemas/logs.schema.js';

const Logs = mongoose.model('Logs', logsSchema);

export default Logs;
