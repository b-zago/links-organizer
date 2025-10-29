import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload, type VerifyErrors } from "jsonwebtoken";
import type { UserJwtPayload } from "../types/express.js";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: VerifyErrors | null, user: string | JwtPayload | undefined) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }
      req.user = user as UserJwtPayload;
      next();
    }
  );
};
