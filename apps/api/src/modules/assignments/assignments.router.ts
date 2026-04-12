import express from "express";
import { authenticate, requireRole } from "../../middleware/auth.js";
import {
  handleListAssignments,
  handleGetAssignment,
  handleCreateAssignment,
  handleUpdateAssignment,
  handleDeleteAssignment,
} from "./assignments.controller.js";

const assignmentsRouter = express.Router();

assignmentsRouter.use(authenticate);

// Student: list assignments for their class
assignmentsRouter.get("/", handleListAssignments);

// Student/Teacher: view assignment detail
assignmentsRouter.get("/:id", handleGetAssignment);

// Teacher: create assignment
assignmentsRouter.post("/", requireRole("TEACHER"), handleCreateAssignment);

// Teacher: update assignment
assignmentsRouter.patch("/:id", requireRole("TEACHER"), handleUpdateAssignment);

// Teacher: soft-delete assignment
assignmentsRouter.delete("/:id", requireRole("TEACHER"), handleDeleteAssignment);

export { assignmentsRouter };
