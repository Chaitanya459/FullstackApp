import { join } from 'node:path';
import { Options } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import config from 'config';

const {
  database: databaseName,
  dialect,
  dialectOptions,
  host,
  logging,
  password,
  pool: { idle, max, min },
  port,
  username,
}: Options = config.get(`database`);

const sequelize = new Sequelize(databaseName, username, password, {
  define: {
    underscored: true,
  },
  dialect,
  dialectOptions: {
    multipleStatements: true,
    useUTC: true,
    ...dialectOptions,
  },
  host,
  // eslint-disable-next-line no-console
  logging: logging ? console.log : false,
  models: [ join(__dirname, `models/**/*.model.{ts,js}`) ],
  pool: { idle, max, min },
  port,
});

export default sequelize;
