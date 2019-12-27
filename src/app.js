import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import https from 'https';
import fs from 'fs';
import { connectDb } from './services/mongoose.service';
import { logger, logRequest } from './services/logger.service';
import route from './routes';
import { notFound, handler } from './middlewares/error.middleware';

const app = express();

app.use(helmet());

app.use(cors());

app.use(bodyParser.json({
  limit: '300kb',
}));

app.use(logRequest);

app.use('/', route);

app.use(notFound);

app.use(handler);

if (!fs.existsSync('server.key.pem') || !fs.existsSync('server.cert.pem')) {
  logger.warn("API didn't find SSL files.");
  process.exit(1);
}

const options = {
  key: fs.readFileSync('server.key.pem'),
  cert: fs.readFileSync('server.cert.pem'),
};

const runServer = () => https.createServer(options, app).listen(process.env.PORT, () => {
  logger.info(`${process.env.PROJECT_NAME} - Server started on port ${process.env.PORT} (${process.env.NODE_ENV}).`);
}).on('error', (err) => {
  logger.error(`Launch server error: ${err}`);
  setTimeout(runServer, 5000);
});

connectDb();
runServer();

export default app;
