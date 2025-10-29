import type { QueryResult } from "pg";
import type { UserRegisterData } from "../types/user.js";
import { pool } from "./db.js";
import bcrypt from "bcrypt";

export async function register(userData: UserRegisterData) {
  const client = await pool.connect();

  const username = userData.username;
  const password = userData.password;
  const email = userData.email;

  //hash the password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  //check if bcrypt fails here

  const insertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`;

  try {
    await client.query(insertQuery, [username, email, passwordHash]);
  } catch (err) {
    console.error("db err", (err as Error).message);
    throw err;
  } finally {
    client.release();
  }
}
