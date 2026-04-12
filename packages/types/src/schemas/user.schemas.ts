import { z } from "zod";

export const studentOnboardingSchema = z.object({
  gradeLevel: z.coerce.number().min(1).max(12),
  studentId: z.string().min(4).optional(),
  classCode: z.string().min(4).optional(),
  avatarUrl: z.string().url().optional(),
});

export const teacherOnboardingSchema = z.object({
  schoolName: z.string().min(2),
  className: z.string().min(2, "Class name is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  image: z.string().url().optional(),
});
