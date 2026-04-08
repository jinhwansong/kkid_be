/**
 * PostgreSQL / Supabase에 SQL 파일 실행.
 * JAMMIT_BE2 루트에서: npm run sql:run -- db/seed/gathering-seed.sql
 *
 * 연결: .env의 DB_* (dataSource와 동일) 또는 DATABASE_URL / SUPABASE_DB_URL
 */
import { readFileSync } from 'fs';
import { join, resolve } from 'path';
import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: join(__dirname, '..', '.env') });

function buildClient(): Client {
  const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  const ssl =
    process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false as const }
      : false;
  if (url) {
    return new Client({ connectionString: url, ssl });
  }
  return new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl,
  });
}

async function main() {
  const rel = process.argv[2];
  if (!rel) {
    console.error(
      'Usage: npm run sql:run -- <path-to.sql>\nExample: npm run sql:run -- db/seed/gathering-seed.sql',
    );
    process.exit(1);
  }
  const filePath = resolve(process.cwd(), rel);
  const sql = readFileSync(filePath, 'utf8');
  const client = buildClient();
  await client.connect();
  try {
    await client.query(sql);
    console.log('Executed:', filePath);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
