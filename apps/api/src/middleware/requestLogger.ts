import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

export { logger };

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const requestId = randomUUID();
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const userId = (req as unknown as Record<string, unknown>).userId as
      | string
      | undefined;
    logger.info({
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      userId: userId ?? null,
    });
  });

  res.setHeader("X-Request-ID", requestId);
  (req as unknown as Record<string, unknown>).requestId = requestId;

  next();
}
