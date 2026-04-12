import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { handleDashboardStats } from "./dashboard.controller.js";

const dashboardRouter = express.Router();

dashboardRouter.use(authenticate);

dashboardRouter.get("/stats", handleDashboardStats);

export { dashboardRouter };
