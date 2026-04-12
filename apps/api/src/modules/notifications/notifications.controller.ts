import type { Request, Response } from "express";
import { prisma } from "../../utils/prisma.js";
import { apiSuccess, apiError } from "../../utils/api.js";

export async function handleGetNotifications(req: Request, res: Response) {
  const userId = req.userId!;
  const { page = 1, limit = 20 } = req.query;

  try {
    const skip = (Number(page) - 1) * Number(limit);
    const total = await prisma.notification.count({ where: { userId } });

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    });

    return apiSuccess(res, { notifications, total }, 200, {
      page: Number(page),
      limit: Number(limit),
      total,
    });
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to fetch notifications", status: 500 });
  }
}

export async function handleGetUnreadCount(req: Request, res: Response) {
  const userId = req.userId!;

  try {
    const count = await prisma.notification.count({ where: { userId, read: false } });
    return apiSuccess(res, { count });
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to fetch unread count", status: 500 });
  }
}

export async function handleMarkAsRead(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.userId!;

  try {
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) {
      return apiError(res, { code: "NOT_FOUND", message: "Notification not found", status: 404 });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true, readAt: new Date() },
    });

    return apiSuccess(res, updated);
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to mark as read", status: 500 });
  }
}

export async function handleMarkAllAsRead(req: Request, res: Response) {
  const userId = req.userId!;

  try {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date() },
    });
    return apiSuccess(res, { success: true });
  } catch {
    return apiError(res, { code: "INTERNAL_ERROR", message: "Failed to mark all as read", status: 500 });
  }
}
