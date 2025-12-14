import { Router } from 'express';

export const pingRouter = Router();

pingRouter.get(`/`, (_, res) => {
  res.json({ ping: `pong` });
});
