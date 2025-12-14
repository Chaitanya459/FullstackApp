import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface DatabaseConfig {
  database: string;
  host: string;
  password: string;
  port: number;
  user: string;
}

export function getDatabaseConfig(): DatabaseConfig {
  const config: DatabaseConfig = {
    database: process.env.DB_NAME || `rsd`,
    host: process.env.DB_HOST || `localhost`,
    password: process.env.DB_PASSWORD || `password`,
    port: parseInt(process.env.DB_PORT || `5432`),
    user: process.env.DB_USER || `postgres`,
  };

  // Validate required config
  if (!process.env.DB_PASSWORD) {
    throw new Error(`DB_PASSWORD environment variable is required`);
  }

  return config;
}

export function logConfig(config: DatabaseConfig): void {
  // eslint-disable-next-line no-console
  console.log(`Database configuration:`);
  // eslint-disable-next-line no-console
  console.log(`  Host: ${config.host}:${config.port}`);
  // eslint-disable-next-line no-console
  console.log(`  Database: ${config.database}`);
  // eslint-disable-next-line no-console
  console.log(`  User: ${config.user}`);
  // eslint-disable-next-line no-console
  console.log(`  Password: ${`*`.repeat(config.password.length)}`);
}
