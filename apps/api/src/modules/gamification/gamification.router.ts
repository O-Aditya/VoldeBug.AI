import express from "express";
import { authenticate } from "../../middleware/auth.js";
import {
  handleDailyChallenge,
  handleCompleteChallenge,
  handleGetLeaderboard,
} from "./gamification.controller.js";

const gamificationRouter = express.Router();

gamificationRouter.use(authenticate);

gamificationRouter.get("/challenge", handleDailyChallenge);
gamificationRouter.post("/challenge/complete", handleCompleteChallenge);

// Scoreboard endpoints
gamificationRouter.get("/scoreboard", handleGetLeaderboard);

export { gamificationRouter };
