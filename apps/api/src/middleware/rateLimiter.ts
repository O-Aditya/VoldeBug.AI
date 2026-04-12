import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    data: null,
    error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests, please try again later." },
    meta: { timestamp: new Date().toISOString() },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 requests per window for auth routes
  message: {
    data: null,
    error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many authentication attempts. Please try again later." },
    meta: { timestamp: new Date().toISOString() },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
