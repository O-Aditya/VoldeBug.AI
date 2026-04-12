import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export function generateToken(payload: {
  id: string;
  email: string;
  role: string;
}): string {
  return jwt.sign(
    payload,
    secret ?? "fallback-dev-secret",
    { expiresIn: "30d" },
  );
}

export function verifyToken(token: string): {
  id: string;
  email: string;
  role: string;
  iat: number;
} {
  return jwt.verify(token, secret ?? "fallback-dev-secret") as any;
}
