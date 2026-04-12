import express from "express";
import { authenticate, requireRole } from "../../middleware/auth.js";
import { handleStudentOnboarding, handleTeacherOnboarding } from "./users.controller.js";

const usersRouter = express.Router();

usersRouter.patch("/onboarding/student", authenticate, handleStudentOnboarding);
usersRouter.patch("/onboarding/teacher", authenticate, handleTeacherOnboarding);

export { usersRouter };