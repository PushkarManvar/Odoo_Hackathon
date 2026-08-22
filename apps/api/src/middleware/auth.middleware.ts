import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../common/errors/AppError.js";
import { ErrorCodes } from "../common/errors/errorCodes.js";

export interface AuthUser {
  id: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    next(
      new AppError(401, ErrorCodes.UNAUTHORIZED, "Authentication required")
    );
    return;
  }

  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, env.jwtSecret) as { userId: string };
    req.user = { id: payload.userId };
    next();
  } catch {
    next(
      new AppError(401, ErrorCodes.UNAUTHORIZED, "Invalid or expired token")
    );
  }
}