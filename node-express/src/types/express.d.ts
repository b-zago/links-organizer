import { JwtPayload } from "jsonwebtoken";

interface UserJwtPayload extends JwtPayload {
  id: number;
  username: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserJwtPayload;
    }
  }
}
