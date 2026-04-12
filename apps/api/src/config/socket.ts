import type { Server as HttpServer } from "http";
import { Server, type Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { getRedis } from "../utils/redis.js";

let io: Server | null = null;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: { origin: true, credentials: true },
    transports: ["websocket", "polling"],
  });

  // Try Redis adapter — fall back to default if Redis is unavailable
  const pubClient = getRedis();
  const subClient = getRedis();

  if (pubClient && subClient) {
    io.adapter(createAdapter(pubClient, subClient));
  }

  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) {
      return next(new Error("Authentication required"));
    }
    (socket as any).userId = token;
    next();
  });

  io.on("connection", (socket: Socket) => {
    const s = socket as Socket & { userId: string };
    s.join(`user:${s.userId}`);
    s.on("join:class", (classId: string) => s.join(`class:${classId}`));
    s.on("leave:class", (classId: string) => s.leave(`class:${classId}`));
    s.on("disconnect", () => {});
  });

  return io;
}

export function getIo(): Server {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

// ── Helper: emit events ───────────────────────────────────────────────

export function emitToUser(userId: string, event: string, data: unknown) {
  io?.to(`user:${userId}`).emit(event, data);
}

export function emitToClass(classId: string, event: string, data: unknown) {
  io?.to(`class:${classId}`).emit(event, data);
}
