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
import { addLink } from "./api/addLink.js";
import { editFolder } from "./api/editFolder.js";
import { editLink } from "./api/editLink.js";
import { delLink } from "./api/delLink.js";
import { delFolder } from "./api/delFolder.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new express application instance
const app = express();

app.use(express.json());
app.use(cookieParser());

//for development
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173", // Your React app URL
      credentials: true, // CRITICAL! Allows cookies to be sent/received
    }),
  );
}

// Set the network port
const port = process.env.PORT || 3000;

// // Define the root path with a greeting message
// app.get("/", (req: Request, res: Response) => {
//   res.json({ message: "Welcome to the Express + TypeScript Server!" });
// });

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "okiedoeki" });
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

app.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out!" });
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
  },
);

app.put(
  "/edit/folder",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const updatedFolder = await editFolder(
        req.body,
        req.user as UserJwtPayload,
      );

      res.status(200).json(updatedFolder);
    } catch (err: any) {
      console.error("Error editing folder:", err);

      // Send appropriate error response based on the error message
      if (err.message.includes("already exists")) {
        return res.status(409).json({ error: err.message });
      }

      if (
        err.message.includes("not found") ||
        err.message.includes("permission")
      ) {
        return res.status(404).json({ error: err.message });
      }

      // Generic error for unexpected issues
      res.status(500).json({ error: "Failed to update folder" });
    }
  },
);

app.put(
  "/edit/link",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const updatedLink = await editLink(req.body, req.user as UserJwtPayload);

      res.status(200).json(updatedLink);
    } catch (err: any) {
      console.error("Error editing link:", err);

      // Send appropriate error response based on the error message
      if (err.message.includes("already exists")) {
        return res.status(409).json({ error: err.message });
      }

      if (
        err.message.includes("not found") ||
        err.message.includes("permission")
      ) {
        return res.status(404).json({ error: err.message });
      }

      // Generic error for unexpected issues
      res.status(500).json({ error: "Failed to update link" });
    }
  },
);

app.post(
  "/add/link",
  authenticateToken,
  async (req: Request, res: Response) => {
    const newLink = await addLink(req.body, req.user as UserJwtPayload);

    res.status(200).json(newLink);
  },
);

app.delete(
  "/delete/folder/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const folderID = parseInt(req.params.id);

      if (isNaN(folderID)) {
        return res.status(400).json({ error: "Invalid folder ID" });
      }

      await delFolder(folderID, req.user as UserJwtPayload);

      res
        .status(200)
        .json({ status: "ok", message: "Folder deleted successfully" });
    } catch (err: any) {
      console.error("Error deleting folder:", err);

      if (
        err.message.includes("not found") ||
        err.message.includes("permission")
      ) {
        return res.status(404).json({ error: err.message });
      }

      if (err.message.includes("contains subfolders or links")) {
        return res.status(409).json({ error: err.message });
      }

      res.status(500).json({ error: "Failed to delete folder" });
    }
  },
);

app.delete(
  "/delete/link/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const linkID = parseInt(req.params.id);

      if (isNaN(linkID)) {
        return res.status(400).json({ error: "Invalid link ID" });
      }

      await delLink(linkID, req.user as UserJwtPayload);

      res
        .status(200)
        .json({ status: "ok", message: "Link deleted successfully" });
    } catch (err: any) {
      console.error("Error deleting link:", err);

      if (
        err.message.includes("not found") ||
        err.message.includes("permission")
      ) {
        return res.status(404).json({ error: err.message });
      }

      res.status(500).json({ error: "Failed to delete link" });
    }
  },
);

app.get(
  "/get/items",
  authenticateToken,
  async (req: Request, res: Response) => {
    if (req.user) {
      const items = await getFolderTree(req.user.id);
      res.status(200).json(items);
    }
  },
);

// SERVE STATIC FILES - After API routes (production only)
if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(__dirname, "..", "public")));

  // CATCH-ALL ROUTE - Must be last
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  });
}

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
