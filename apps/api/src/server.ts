import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./middleware/requestLogger.js";
import { prisma } from "./utils/prisma.js";
import { initSocket } from "./config/socket.js";

const server = app.listen(env.PORT, env.HOST, () => {
  logger.info(`API server running on http://${env.HOST}:${env.PORT} (${env.NODE_ENV})`);
});

// Initialize Socket.io
initSocket(server);

// Graceful shutdown
async function shutdown(signal: string) {
  logger.info(`${signal} received. Shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info("Disconnected from database. Server stopped.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export { server };
