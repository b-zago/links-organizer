import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import express from "express";
import { login, register } from "./auth/auth.js";

import jwt from "jsonwebtoken";
import { authenticateToken } from "./auth/middleware.js";
import { addFolder } from "./api/addFolder.js";
import type { UserJwtPayload } from "./types/express.js";
import { getFolderTree } from "./api/getTree.js";

// Create a new express application instance
const app = express();

app.use(express.json());
app.use(cookieParser());
//for development
app.use(
  cors({
    origin: "http://localhost:5173", // Your React app URL
    credentials: true, // CRITICAL! Allows cookies to be sent/received
  })
);

// Set the network port
const port = process.env.PORT || 3000;

// Define the root path with a greeting message
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

app.post("/register", async (req: Request, res: Response) => {
  console.log(req.body);
  //console.log("res", res);
  try {
    await register(req.body);
    res.status(200).json({ message: "User registered!" });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  console.log(req.body);
  //console.log("res", res);
  try {
    const jwtToken = await login(req.body);

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only true in production
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Logged in!" });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

app.get("/auth/verify", authenticateToken, (req: Request, res: Response) => {
  res.status(200).json({
    user: req.user,
  });
});

app.post(
  "/add/folder",
  authenticateToken,
  async (req: Request, res: Response) => {
    const newFolder = await addFolder(req.body, req.user as UserJwtPayload);

    res.status(200).json(newFolder);
  }
);

app.get(
  "/get/items",
  authenticateToken,
  async (req: Request, res: Response) => {
    if (req.user) {
      const items = await getFolderTree(req.user.id);
      res.status(200).json(items);
    }
  }
);

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
