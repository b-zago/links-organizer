// Runs once before the entire test suite.
// Creates a fresh test database and applies the schema from postgres/schema_dump.sql.
import { Client } from "pg";
import fs from "fs";
import path from "path";

export default async function globalSetup() {
  const testDbName = process.env.DB_NAME;
  if (!testDbName) {
    throw new Error("DB_NAME must be set (load .env.test via --env-file)");
  }
  if (!/test/i.test(testDbName)) {
    throw new Error(
      `Refusing to run: DB_NAME "${testDbName}" does not contain "test". ` +
        `This is a safety check to avoid destroying non-test databases.`,
    );
  }

  // Connect to the default 'postgres' DB to manage the test DB.
  const adminClient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: "postgres",
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  });
  await adminClient.connect();

  // Terminate any lingering connections, then drop + recreate.
  await adminClient.query(
    `SELECT pg_terminate_backend(pid) FROM pg_stat_activity
     WHERE datname = $1 AND pid <> pg_backend_pid()`,
    [testDbName],
  );
  await adminClient.query(`DROP DATABASE IF EXISTS "${testDbName}"`);
  await adminClient.query(`CREATE DATABASE "${testDbName}"`);
  await adminClient.end();

  // Apply the schema.
  const schemaPath = path.resolve(
    process.cwd(),
    "..",
    "postgres",
    "schema_dump.sql",
  );
  const schema = fs.readFileSync(schemaPath, "utf8");

  const dbClient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: testDbName,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  });
  await dbClient.connect();
  await dbClient.query(schema);
  await dbClient.end();

  // eslint-disable-next-line no-console
  console.log(`[jest] test database "${testDbName}" ready`);
}
