import Redis from "ioredis";
import { env } from "../config/env.js";

declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | undefined;
}

let redisClient: Redis | null = null;

export function getRedis(): Redis | null {
  if (redisClient) return redisClient;

  const restUrl = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;

  if (!restUrl || !token) return null;

  redisClient = globalThis.__redis ?? new Redis(restUrl, { password: token, tls: {} });

  if (process.env.NODE_ENV === "development") {
    globalThis.__redis = redisClient;
  }

  return redisClient;
}

export async function isRedisHealthy(): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}
