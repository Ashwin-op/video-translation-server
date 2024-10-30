import Fastify from "fastify";
import config from "./config";
import JobManager from "./job_manager";

const { PORT, HOST, delayConfig } = config;

const jobManager = new JobManager(delayConfig);

export function createServer() {
  const fastify = Fastify({
    logger: {
      level: "info",
      timestamp: () => `,"time":"${new Date().toISOString()}"`,
    },
  });

  // Error handler for custom error responses
  fastify.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
      error: "Error occurred",
      message: error.message,
      statusCode,
    });
  });

  fastify.addHook("onRequest", async (request) => {
    request.log.info(`Incoming request: ${request.method} ${request.url}`);
  });

  // Route to get the current status of the job
  fastify.get("/status", async () => {
    return { result: jobManager.getStatus() };
  });

  // Route to reset the job status
  fastify.get("/reset", async () => {
    jobManager.resetJob();
    return { message: "Job status reset to pending." };
  });

  // Health check endpoint
  fastify.get("/health", async () => {
    return { status: "ok", uptime: process.uptime() };
  });

  return fastify;
}

// Conditionally start the server only if this script is run directly
if (require.main === module) {
  const fastify = createServer();

  // Graceful shutdown handler
  const shutDown = () => {
    fastify.log.info("Shutting down server gracefully...");
    fastify.close().then(() => process.exit(0));
  };
  process.on("SIGTERM", shutDown);
  process.on("SIGINT", shutDown);

  // Start the server
  fastify.listen({ port: PORT, host: HOST })
    .then(() => console.log(`Server running on http://${HOST}:${PORT}`))
    .catch(err => {
      fastify.log.error(err);
      process.exit(1);
    });
}
