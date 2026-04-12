import { prisma } from "../../utils/prisma.js";
import { emitToUser } from "../../config/socket.js";
import type { NotificationType } from "@prisma/client";

export async function createNotification(data: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
}) {
  // 1. Persist notification to DB
  const notification = await prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      body: data.body,
    },
  });

  // 2. Calculate unread count for the badge
  const unreadCount = await prisma.notification.count({
    where: { userId: data.userId, read: false },
  });

  // 3. Emit real-time notification event via Redis/Socket.io
  emitToUser(data.userId, "notification", {
    id: notification.id,
    userId: data.userId,
    type: data.type,
    title: data.title,
    body: data.body,
    createdAt: notification.createdAt.toISOString(),
    read: false,
    unreadCount,
  });

  return notification;
}
