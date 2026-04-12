import {
  type AssignmentStatus,
  type SubmissionStatus,
  type ToolCategory,
} from "./enums.js";

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  logoUrl: string;
  brandColor: string;
  useCases: string[];
  subjects: string[];
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  creatorId: string;
  suggestedToolId: string | null;
  dueDate: Date;
  xpReward: number;
  earlyBonus: number;
  status: AssignmentStatus;
  submissionFormats: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrls: string[];
  studentNotes: string | null;
  status: SubmissionStatus;
  submittedAt: Date;
  gradedAt: Date | null;
  score: number | null;
  grade: string | null;
  feedback: string | null;
  xpAwarded: number | null;
  createdAt: Date;
}

export type CreateAssignmentInput = {
  title: string;
  description: string;
  classId: string;
  suggestedToolId?: string;
  dueDate: Date;
  xpReward: number;
  earlyBonus: number;
  submissionFormats: string[];
};

export type CreateSubmissionInput = {
  assignmentId: string;
  fileUrls: string[];
  studentNotes?: string;
};

export type GradeSubmissionInput = {
  score: number;
  grade?: string;
  feedback?: string;
  baseXP: number;
  qualityBonus: number;
  notifyStudent: boolean;
};
