import axios from "axios";

interface ClientConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  maxPollingTime?: number;
}

export class VideoTranslationClient {
  private baseUrl: string;
  private maxRetries: number;
  private initialDelay: number;
  private maxDelay: number;
  private maxPollingTime: number;

  constructor(baseUrl: string, config: ClientConfig = {}) {
    this.baseUrl = baseUrl;
    this.maxRetries = config.maxRetries || 5;
    this.initialDelay = config.initialDelay || 1000;
    this.maxDelay = config.maxDelay || 8000;
    this.maxPollingTime = config.maxPollingTime || 30000; // 30 seconds by default
  }

  public async pollStatus(): Promise<string> {
    let attempts = 0;
    let delay = this.initialDelay;
    const startTime = Date.now();

    while (attempts < this.maxRetries) {
      try {
        console.log(`[${new Date().toISOString()}] Attempt ${attempts + 1} - Polling status...`);

        const response = await axios.get(`${this.baseUrl}/status`);
        const result = response.data.result;

        if (result === "completed") {
          console.log(`[${new Date().toISOString()}] Job completed successfully.`);
          return "completed";
        }
        if (result === "error") {
          console.log(`[${new Date().toISOString()}] Job encountered an error.`);
          return "error";
        }

        // If pending, log and wait before the next attempt
        console.log(`[${new Date().toISOString()}] Job is still pending. Waiting ${delay} ms before retrying.`);

        await this.delay(delay);
        delay = Math.min(delay * 2, this.maxDelay);
        attempts++;

        // Timeout if polling time exceeds the limit
        if (Date.now() - startTime >= this.maxPollingTime) {
          console.error(`[${new Date().toISOString()}] Maximum polling time exceeded.`);
          throw new Error("Maximum polling time exceeded.");
        }
      } catch (error) {
        const { message } = <any>error;
        console.error(`[${new Date().toISOString()}] Error fetching status:`, message);
        throw new Error("Failed to get status from server.");
      }
    }

    throw new Error("Max retries reached without completion.");
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Example usage:
// const client = new VideoTranslationClient("http://localhost:3000", { maxRetries: 5, maxPollingTime: 20000 });
// client.pollStatus()
//   .then(status => console.log(`Job Status: ${status}`))
//   .catch(error => console.error("Polling error:", error.message));
