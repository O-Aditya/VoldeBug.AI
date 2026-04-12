import type { Response } from "express";

export interface ApiEnvelope<T> {
  data: T | null;
  error: { code: string; message: string } | null;
  meta: {
    timestamp: string;
    requestId?: string;
    pagination?: { page: number; limit: number; total: number };
  };
}

export function apiSuccess<T>(
  res: Response,
  data: T,
  status = 200,
  pagination?: { page: number; limit: number; total: number },
) {
  return res.status(status).json({
    data,
    error: null,
    meta: {
      timestamp: new Date().toISOString(),
      pagination,
    },
  });
}

export function apiError(
  res: Response,
  { code, message, status }: { code: string; message: string; status: number },
) {
  return res.status(status).json({
    data: null,
    error: { code, message },
    meta: { timestamp: new Date().toISOString() },
  });
}
