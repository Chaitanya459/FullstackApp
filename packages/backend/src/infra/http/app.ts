import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import nocache from 'nocache';
import createError from 'http-errors';
import cors from 'cors';
import config from 'config';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import duration from 'parse-duration';
import { v4 as uuidv4 } from 'uuid';
import { queryParser } from 'express-query-parser2';
import { ErrorHandler, logger, morganInstance } from '../../utils';
import { redisClient } from '../database/redis/redisClient';
import { router } from './routes';

const app = express();
const redisStore = new RedisStore({
  client: redisClient,
});
const sessionConfig = session({
  cookie: {
    httpOnly: true,
    maxAge: duration(config.get(`session.maxAge`), `ms`),
    secure: config.get(`session.secure`),
  },
  name: `apiKey`,
  resave: true,
  saveUninitialized: false,
  secret: config.get(`session.secret`),
  store: redisStore,
  unset: `destroy`,
});

if (config.get(`session.proxy`)) {
  app.set(`trust proxy`, true);
}

app.use((req, res, next) => {
  req.reqId = uuidv4();
  next();
});

app.use(
  sessionConfig,
  cors({ origin: `*` }),
  helmet(),
  nocache(),
  morganInstance,
  express.json(),
  express.urlencoded({ extended: false }),
  queryParser({ parseBoolean: true, parseNull: true }),
);

app.use(`/api`, router);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use(ErrorHandler);

const PORT: number = config.get(`server.port`);
app.listen(PORT, () => {
  logger.info(`Server listening on ${PORT}`);
});
