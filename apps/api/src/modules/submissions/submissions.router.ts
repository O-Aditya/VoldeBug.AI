import express from "express";
import { authenticate, requireRole } from "../../middleware/auth.js";
import {
  handleCreateSubmission,
  handleGetSubmission,
  handleGetSubmissionHistory,
  handleGradeSubmission,
  handleListSubmissionsForAssignment,
  handleGetUploadPresignedUrl,
} from "./submissions.controller.js";

const submissionsRouter = express.Router();

submissionsRouter.use(authenticate);

// Student: create submission
submissionsRouter.post("/", handleCreateSubmission);

// Student: view own submission history
submissionsRouter.get("/history", handleGetSubmissionHistory);

// Student: get presigned URL for file upload
submissionsRouter.get("/upload-url", handleGetUploadPresignedUrl);

// Student/Teacher: view single submission
submissionsRouter.get("/:id", handleGetSubmission);

// Teacher: list submissions for an assignment
submissionsRouter.get("/assignment/:assignmentId", requireRole("TEACHER"), handleListSubmissionsForAssignment);

// Teacher: grade a submission
submissionsRouter.patch("/:id/grade", requireRole("TEACHER"), handleGradeSubmission);

export { submissionsRouter };
