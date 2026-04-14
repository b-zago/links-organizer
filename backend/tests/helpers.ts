// Shared test utilities: DB cleanup, pool teardown, and a register+login helper.
import request from "supertest";
import { pool } from "../src/db/db.js";
import { app } from "./app.js";

export async function truncateAll() {
  await pool.query(
    "TRUNCATE users, folders, links RESTART IDENTITY CASCADE",
  );
}

export async function closeDb() {
  await pool.end();
}

export type TestUser = {
  username: string;
  email: string;
  password: string;
};

export const defaultUser: TestUser = {
  username: "testuser",
  email: "test@example.com",
  password: "password123",
};

export async function registerAndLogin(user: TestUser = defaultUser) {
  await request(app).post("/register").send(user);
  const res = await request(app)
    .post("/login")
    .send({ username: user.username, password: user.password });
  const rawCookie = res.headers["set-cookie"];
  const cookie = Array.isArray(rawCookie) ? rawCookie[0] : (rawCookie as unknown as string);
  return { cookie, user };
}
