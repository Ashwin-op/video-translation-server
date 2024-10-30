import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";

const delayConfig = {
  minDelay: parseInt(process.env.MIN_DELAY || "3000", 10), // Minimum delay in milliseconds
  maxDelay: parseInt(process.env.MAX_DELAY || "10000", 10), // Maximum delay in milliseconds
};

export default {
  PORT,
  HOST,
  delayConfig,
};
