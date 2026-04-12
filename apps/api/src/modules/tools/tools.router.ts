import express from "express";
import { authenticate } from "../../middleware/auth.js";
import {
  handleListTools,
  handleGetTool,
} from "./tools.controller.js";

const toolsRouter = express.Router();

// All tool endpoints require authentication
toolsRouter.use(authenticate);

// Tool listing
toolsRouter.get("/", handleListTools);

// Tool detail
toolsRouter.get("/:id", handleGetTool);

export { toolsRouter };
