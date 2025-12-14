import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as XLSX from 'xlsx';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

// Import types and config
import { type DatabaseConfig, getDatabaseConfig, logConfig } from './config';

// Load environment variables
dotenv.config();

class VisionHearingMigration {
  private pool: Pool;
  private dataDir: string;

  public constructor(config: DatabaseConfig) {
    this.pool = new Pool(config);
    this.dataDir = path.join(__dirname, `..`, `data`);
  }

  private safeStringValue(obj: unknown, key: string): string | undefined {
    if (obj && typeof obj === `object` && key in obj) {
      const value = (obj as Record<string, unknown>)[key];
      return typeof value === `string` ? value : undefined;
    }
    return undefined;
  }

  private safeNameParts(fullName: unknown): { firstName: string, lastName: string } | null {
    if (typeof fullName !== `string` || !fullName.trim()) {
      return null;
    }

    const nameParts = fullName.trim().split(` `);
    if (nameParts.length < 2) {
      return null;
    }

    const [ firstName, ...lastNameParts ] = nameParts;
    return {
      firstName,
      lastName: lastNameParts.join(` `),
    };
  }

  public async connect(): Promise<void> {
    try {
      await this.pool.connect();
      // eslint-disable-next-line no-console
      console.log(`Connected to PostgreSQL database`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error connecting to database:`, error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    await this.pool.end();
    // eslint-disable-next-line no-console
    console.log(`Disconnected from database`);
  }

  private readExcelFile<T>(filename: string, sheetName?: string): T[] {
    const filePath = path.join(this.dataDir, filename);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<T>(worksheet);

    // eslint-disable-next-line no-console
    console.log(`Read ${data.length} rows from ${filename}${sheetName ? ` (sheet: ${sheetName})` : ``}`);
    return data;
  }

  private async executeQuery<T extends QueryResultRow>(
    client: PoolClient,
    query: string,
    values?: any[],
  ): Promise<QueryResult<T>> {
    try {
      const result = await client.query<T>(query, values);
      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Query error:`, error);
      // eslint-disable-next-line no-console
      console.error(`Query:`, query);
      // eslint-disable-next-line no-console
      console.error(`Values:`, values);
      throw error;
    }
  }

  public async runMigration(): Promise<void> {
    const client = await this.pool.connect();

    try {
      await this.connect();

      // eslint-disable-next-line no-console
      console.log(`Starting Vision Hearing Migration...`);

      // Run migrations in order

      // eslint-disable-next-line no-console
      console.log(`Migration completed successfully!`);
      process.exit(0);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Migration failed:`, error);
      process.exit(1);
    } finally {
      client.release();
      await this.disconnect();
    }
  }
}

// Main execution
async function main() {
  const config = getDatabaseConfig();
  logConfig(config);

  const migration = new VisionHearingMigration(config);
  await migration.runMigration();
}

if (require.main === module) {
  main().catch((error: Error) => {
    // eslint-disable-next-line no-console
    console.error(`Migration failed:`, error);
    process.exit(1);
  });
}

export { VisionHearingMigration };
