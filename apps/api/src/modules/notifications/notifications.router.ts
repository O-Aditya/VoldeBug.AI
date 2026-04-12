import express from "express";
import { authenticate } from "../../middleware/auth.js";
import {
  handleGetNotifications,
  handleMarkAsRead,
  handleMarkAllAsRead,
  handleGetUnreadCount,
} from "./notifications.controller.js";

const notificationsRouter = express.Router();

notificationsRouter.use(authenticate);

notificationsRouter.get("/", handleGetNotifications);
notificationsRouter.get("/unread-count", handleGetUnreadCount);
notificationsRouter.patch("/:id/read", handleMarkAsRead);
notificationsRouter.patch("/read-all", handleMarkAllAsRead);

export { notificationsRouter };
