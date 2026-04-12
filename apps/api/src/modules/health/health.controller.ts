import type { Request, Response } from "express";
import { prisma } from "../../utils/prisma.js";
import { isRedisHealthy } from "../../utils/redis.js";

export async function healthCheck(req: Request, res: Response) {
  const start = Date.now();

  let dbStatus = "fail";
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "ok";
  } catch {
    dbStatus = "fail";
  }

  const redisStatus = await isRedisHealthy();

  res.json({
    status: "ok",
    uptime: process.uptime(),
    duration: Date.now() - start,
    checks: {
      database: dbStatus,
      redis: redisStatus ? "ok" : "fail",
    },
  });
}
