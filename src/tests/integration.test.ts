import { FastifyInstance } from "fastify";
import { VideoTranslationClient } from "../client";
import { createServer } from "../server";

describe("Video Translation Integration Test", () => {
  let fastifyInstance: FastifyInstance;

  beforeAll(async () => {
    fastifyInstance = createServer();
    await fastifyInstance.listen({ port: 3000 });
    console.log("Server started on http://localhost:3000");
  });

  afterAll(async () => {
    await fastifyInstance.close();
    console.log("Server stopped");
  });

  it("should poll the server until the job is completed", async () => {
    const client = new VideoTranslationClient("http://localhost:3000");

    try {
      const status = await client.pollStatus();
      console.log(`Job Status: ${status}`);
      expect(status).toBe("completed");
    } catch (error) {
      const { message } = <any>error;
      console.error("Polling error:", message);
      throw error;
    }
  }, 20000);
});
