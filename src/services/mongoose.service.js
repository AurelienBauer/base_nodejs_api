import mongoose from 'mongoose';
import { logger } from './logger.service.js';
import { sysStatus, mongoSt } from './sysStatus.service.js';

/* print mongoose logs in development mode */
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const connectDb = () => {
  sysStatus.mongodb_status = mongoSt.CONNECTING;
  return mongoose.connect(process.env.MONGO_HOST,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    (err) => {
      if (!err) {
        sysStatus.mongodb_status = mongoSt.CONNECTED;
        logger.info(`${process.env.PROJECT_NAME} - Connected to mongoDB ${process.env.MONGO_HOST}.`);
      } else {
        sysStatus.mongodb_status = mongoSt.FAIL;
        logger.error(`MongoDB connection error: ${err}`);
        setTimeout(connectDb, 5000);
      }
    });
};

export default connectDb;
