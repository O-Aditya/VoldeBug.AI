import { type UserRole, type OnboardingStatus } from "./enums.js";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  onboardingStatus: OnboardingStatus;
  gradeLevel: number | null;
  studentId: string | null;
  currentClassId: string | null;
  schoolId: string | null;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  gradeLevel: number | null;
  studentId: string | null;
  currentClassId: string | null;
  xp: number;
}

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

export type UpdateUserInput = Partial<{
  name: string;
  image: string;
  onboardingStatus: OnboardingStatus;
  gradeLevel: number;
  studentId: string;
  currentClassId: string;
  schoolId: string;
}>;
