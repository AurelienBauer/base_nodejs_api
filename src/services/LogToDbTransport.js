import Transport from 'winston-transport';
import Logs from '../models/logs.model.js';

export default class LogToDbTransport extends Transport {
  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });
    new Logs({
      service: info.service,
      level: info.level,
      message: info.message,
      userId: info.userId,
    }).save();
    callback();
  }
}
