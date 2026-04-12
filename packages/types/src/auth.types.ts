import { type z } from "zod";
import {
  loginSchema,
  registerSchema,
  roleSelectionSchema,
} from "./schemas/auth.schemas.js";

export interface AuthSession {
  userId: string;
  email: string;
  role: string;
  onboardingStatus: string;
  name?: string;
}

export type LoginCredentials = z.output<typeof loginSchema>;
export type RegisterInput = z.output<typeof registerSchema>;
export type RoleSelectionInput = z.output<typeof roleSelectionSchema>;
