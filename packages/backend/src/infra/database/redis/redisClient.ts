import config from 'config';
import { createClient } from 'redis';
import { logger } from '../../../utils';

export const redisClient = createClient({
  password: config.get(`cache.password`) ? config.get(`cache.password`) : undefined,
  url: `redis${
    config.get(`cache.tls`) ? `s` : ``
  }://${
    config.get<string>(`cache.host`)
  }:${
    config.get<number>(`cache.port`)
  }`,
});

void redisClient
  .on(`ready`, () => {
    logger.info(`Redis connection established`);
  })
  .on(`error`, (error) => {
    logger.error(`Redis connection error: `, error);
  })
  .connect();
