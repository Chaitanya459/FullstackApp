import { Request, Response } from 'express';
import morgan, { TokenIndexer } from 'morgan';
import forwarded from 'forwarded';
import { name, version } from '../../../package.json';
import { stream } from './winston';

morgan.token(`id`, (req: Request) => req.reqId);

morgan.token(`user`, (req: Request) => req.user?.id.toString() || `N/A`);

morgan.token(`remote-addr`, (req: Request) => forwarded(req).pop());

morgan.token(`org`, () => `rsd`);

morgan.token(`env`, () => process.env.NODE_ENV);

morgan.token(`package-name`, () => name);

morgan.token(`package-version`, () => version);

function jsonFormat(tokens: TokenIndexer<Request, Response>, req: Request, res: Response) {
  return JSON.stringify({
    // eslint-disable-next-line @stylistic/max-len
    message: `${tokens.method(req, res) || ``} ${tokens.url(req, res) || ``} ${tokens.status(req, res) || ``} ${tokens[`remote-addr`](req, res) || ``} - ${tokens[`response-time`](req, res) || ``} ms`,
    meta: {
      'id': tokens.id(req, res),
      'datetime': tokens.date(req, res, `iso`),
      'env': tokens.env(req, res),
      'method': tokens.method(req, res),
      'org': tokens.org(req, res),
      'package-name': tokens[`package-name`](req, res),
      'package-version': tokens[`package-version`](req, res),
      'remote-address': tokens[`remote-addr`](req, res),
      'status-code': tokens.status(req, res),
      'url': tokens.url(req, res),
      'user': tokens.user(req, res),
    },
  });
}

export const morganInstance = morgan(jsonFormat, { immediate: false, stream });
