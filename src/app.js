import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDb from './services/mongoose.service.js';
import { logger, logRequestIfNotLogged } from './services/logger.service.js';
import route from './routes/index.js';
import { notFound, handler } from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());

app.use(cors());

app.use(bodyParser.json({
  limit: '300kb',
}));

app.use(logRequestIfNotLogged);

app.use('/', route);

app.use(notFound);

app.use(handler);

const port = process.env.PORT || 3000;

const runServer = () => app.listen(port, () => {
  logger.info(`${process.env.PROJECT_NAME} - Server started on port ${port} (${process.env.NODE_ENV}).`);
}).on('error', (err) => {
  logger.error(`Run server error: ${err}`);
});

connectDb();
runServer();

export default app;
