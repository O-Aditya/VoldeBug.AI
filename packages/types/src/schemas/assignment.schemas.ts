import { z } from "zod";

export const createAssignmentSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10),
  classId: z.string().min(1),
  suggestedToolId: z.string().optional(),
  dueDate: z.coerce.date(),
  xpReward: z.coerce.number().min(10).max(500),
  earlyBonus: z.coerce.number().min(0).max(200),
  submissionFormats: z
    .array(z.enum(["PDF", "DOCX", "TXT", "PNG", "JPG"]))
    .min(1, "At least one submission format is required"),
  notifyOnPublish: z.boolean().default(true),
});

export const updateAssignmentSchema = createAssignmentSchema.partial();

export const createSubmissionSchema = z.object({
  assignmentId: z.string().min(1),
  fileUrls: z.array(z.string().min(1)).min(1, "At least one file is required"),
  studentNotes: z.string().max(1_000).optional(),
});

export const gradeSubmissionSchema = z.object({
  score: z.coerce.number().min(0).max(100),
  grade: z.string().optional(),
  feedback: z.string().max(5_000).optional(),
  baseXP: z.coerce.number().min(0),
  qualityBonus: z.coerce.number().min(0).max(200),
  notifyStudent: z.boolean().default(true),
});
