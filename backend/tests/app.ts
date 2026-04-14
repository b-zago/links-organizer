// Test-only copy of src/index.ts that exports the Express app WITHOUT calling
// app.listen(). Also omits static/catch-all routes which aren't under test.
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import express from "express";

import { login, register } from "../src/auth/auth.js";
import { authenticateToken } from "../src/auth/middleware.js";
import { addFolder } from "../src/api/addFolder.js";
import { getFolderTree } from "../src/api/getTree.js";
import { addLink } from "../src/api/addLink.js";
import { editFolder } from "../src/api/editFolder.js";
import { editLink } from "../src/api/editLink.js";
import { delLink } from "../src/api/delLink.js";
import { delFolder } from "../src/api/delFolder.js";
import type { UserJwtPayload } from "../src/types/express.js";

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/register", async (req: Request, res: Response) => {
  try {
    await register(req.body);
    res.status(200).json({ message: "User registered!" });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const jwtToken = await login(req.body);
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Logged in!" });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

app.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out!" });
});

app.get("/auth/verify", authenticateToken, (req: Request, res: Response) => {
  res.status(200).json({ user: req.user });
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
      if (err.message.includes("already exists")) {
        return res.status(409).json({ error: err.message });
      }
      if (
        err.message.includes("not found") ||
        err.message.includes("permission")
      ) {
        return res.status(404).json({ error: err.message });
      }
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
      if (err.message.includes("already exists")) {
        return res.status(409).json({ error: err.message });
      }
      if (
        err.message.includes("not found") ||
        err.message.includes("permission")
      ) {
        return res.status(404).json({ error: err.message });
      }
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
