import appRoot from 'app-root-path';
import { createLogger, format, transports } from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { Client as ElasticsearchClient } from '@elastic/elasticsearch';
import apm from 'elastic-apm-node';
import duration from 'parse-duration';
import config from 'config';
import 'winston-daily-rotate-file';

const fileTransport = new transports.File({
  filename: `${appRoot.path}/packages/backend/logs/app.log`,
  format: format.combine(
    format.json(),
    format.timestamp(),
  ),
  handleExceptions: true,
  level: `debug`,
  maxFiles: 5,
  maxsize: 2831155, // 5MB
  silent: !config.get(`logging.transports.file`),
});

const consoleTransport = new transports.Console({
  format: format.combine(
    format.colorize(),
    format.simple(),
    format.timestamp(),
    format.errors({ stack: true }),
  ),
  handleExceptions: true,
  level: `info`,
  silent: !config.get(`logging.transports.console`),
});

const rotateFileTransport = new transports.DailyRotateFile({
  auditFile: `${appRoot.path}/packages/backend/logs/audit.json`,
  datePattern: `YYYY-MM-DD-HH`,
  filename: `${appRoot.path}/packages/backend/logs/app-%DATE%.log`,
  format: format.combine(
    format.json(),
    format.timestamp(),
  ),
  level: `debug`,
  maxFiles: `14d`,
  maxSize: `5m`,
  silent: !config.get(`logging.transports.rotatingFile`),
  zippedArchive: true,
});

export const logger = createLogger({
  exitOnError: false,
  transports: [
    fileTransport,
    consoleTransport,
    rotateFileTransport,
  ],
});

if (config.get(`logging.transports.elasticsearch.enabled`)) {
  const client = new ElasticsearchClient({
    auth: config.get(`logging.transports.elasticsearch.auth`),
    nodes: config.get(`logging.transports.elasticsearch.nodes`),
    sniffOnConnectionFault: true,
    sniffOnStart: true,
  });

  (function healthCheck() {
    client.cluster.health()
      .then(({ status }: { status: string }) => {
        if (status === `red`) {
          throw new Error(`Elasticsearch cluster health is ${status}`);
        }

        logger.info(`Winston connected to elasticsearch successfully`);
        logger.add(new ElasticsearchTransport({
          apm,
          client,
          dataStream: true,
          level: `info`,
        }));
      })
      .catch((err) => {
        logger.error(`Winston failed to connect to elasticsearch`, err);
        setTimeout(healthCheck, duration(`2 minutes`));
      });
  }());
}

export const stream = {
  write(message: string): void {
    const json = JSON.parse(message) as { message: string, meta: { [key: string]: any } };
    logger.info(json.message, json.meta);
  },
};
