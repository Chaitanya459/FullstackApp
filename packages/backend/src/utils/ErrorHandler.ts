import { ErrorRequestHandler } from 'express';
import { HttpError } from 'http-errors';
import { logger } from './logging/winston';

export const ErrorHandler: ErrorRequestHandler = (err: HttpError, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Have to put an empty string as the first argument or it logs error: undefined
  logger.error(`${req.method} ${req.url}`, err);

  res.status(err.statusCode || 500).json({ message: err.message, status: err.statusCode });
};
