import type { QueryResult } from "pg";
import type { UserLoginData, UserRegisterData } from "../types/user.js";
import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { DbError } from "../types/db.js";
import type { NextFunction, Request, Response } from "express";

type UserRow = {
  id: number;
  username: string;
  email: string;
  password: string;
};

export async function register(userData: UserRegisterData) {
  const username = userData.username;
  const password = userData.password;
  const email = userData.email;

  //hash the password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  //check if bcrypt fails here

  const insertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`;

  try {
    await pool.query(insertQuery, [username, email, passwordHash]);
  } catch (err) {
    const error = err as DbError;
    console.error("db err", error.detail);

    if (error.code === "23505") {
      if (error.constraint === "users_username_key") {
        throw new Error("Username is already taken");
      }
      if (error.constraint === "users_email_key") {
        throw new Error("Email is already registered");
      }
      throw new Error("User already exists");
    }

    // other db errors
    throw new Error("Failed to register user");
  }
}

export async function login(userData: UserLoginData) {
  const username = userData.username;
  const password = userData.password;

  const userError = "Invalid username or password";

  //add support for created_ad later
  const getUserQuery =
    "SELECT id, username, email, password FROM users WHERE username = $1";

  try {
    const result: QueryResult<UserRow> = await pool.query(getUserQuery, [
      username,
    ]);

    if (result.rows.length === 0) {
      throw new Error(userError);
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error(userError);
    }

    console.log("Checks Out!");

    return createJWT(user.id, user.username, user.email);
  } catch (err) {
    const error = err as Error;
    console.error("Login error:", error.message);
    throw error;
  }
}

function createJWT(id: number, username: string, email: string) {
  return jwt.sign({ id, username, email }, process.env.JWT_SECRET as string, {
    expiresIn: "24h",
  });
}
