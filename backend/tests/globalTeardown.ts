// Runs once after the entire test suite. Drops the test database.
import { Client } from "pg";

export default async function globalTeardown() {
  const testDbName = process.env.DB_NAME;
  if (!testDbName || !/test/i.test(testDbName)) return;

  const adminClient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: "postgres",
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  });
  await adminClient.connect();
  await adminClient.query(
    `SELECT pg_terminate_backend(pid) FROM pg_stat_activity
     WHERE datname = $1 AND pid <> pg_backend_pid()`,
    [testDbName],
  );
  await adminClient.query(`DROP DATABASE IF EXISTS "${testDbName}"`);
  await adminClient.end();
}
