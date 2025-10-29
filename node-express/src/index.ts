import type { Request, Response } from "express";
import cors from "cors";

import express from "express";
import { register } from "./db/auth.js";

// Create a new express application instance
const app = express();

app.use(express.json());
//for development
app.use(cors());

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
    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
