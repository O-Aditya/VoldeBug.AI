import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "./requestLogger.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.error(`${err.stack ?? err.message}`);

  if (err instanceof ZodError) {
    return res.status(400).json({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
        message: err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
      },
      meta: { timestamp: new Date().toISOString() },
    });
  }

  const isDev = process.env.NODE_ENV === "development";
  const statusCode = (err as { status?: number }).status ?? 500;
  const errorCode = (err as { code?: string }).code ?? "INTERNAL_ERROR";

  return res.status(statusCode).json({
    data: null,
    error: {
      code: errorCode,
      message: isDev ? err.message : "Something went wrong",
    },
    meta: { timestamp: new Date().toISOString() },
  });
}
