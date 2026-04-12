import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: UserRole;
    }
  }
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      data: null,
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
      meta: { timestamp: new Date().toISOString() },
    });
  }

  try {
    const decoded = verifyToken(authHeader.split(" ")[1]);
    req.userId = decoded.id;
    req.userRole = decoded.role as UserRole;
    next();
  } catch {
    return res.status(401).json({
      data: null,
      error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
      meta: { timestamp: new Date().toISOString() },
    });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId || !req.userRole) {
      return res.status(401).json({
        data: null,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
        meta: { timestamp: new Date().toISOString() },
      });
    }
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        data: null,
        error: { code: "FORBIDDEN", message: "Insufficient permissions" },
        meta: { timestamp: new Date().toISOString() },
      });
    }
    return next();
  };
}
