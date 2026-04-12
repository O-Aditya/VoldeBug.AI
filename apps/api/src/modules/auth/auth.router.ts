import express from "express";
import { authLimiter } from "../../middleware/rateLimiter.js";
import { authenticate } from "../../middleware/auth.js";
import {
  handleRegister,
  handleLogin,
  handleSetRole,
  handleMe,
  handleProviderLogin,
} from "./auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", authLimiter, handleRegister);
authRouter.post("/login", authLimiter, handleLogin);
authRouter.post("/role", authLimiter, authenticate, handleSetRole);
authRouter.get("/me", authenticate, handleMe);
authRouter.post("/provider", authLimiter, handleProviderLogin);

export { authRouter };