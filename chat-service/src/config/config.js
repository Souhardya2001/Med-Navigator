const dotenv = require("dotenv");
const path = require("path");

// Services share the repository-level environment file during local development.
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

function positiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) return fallback;
  return parsed;
}

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: positiveInt(process.env.CHAT_PORT, 5000, "CHAT_PORT"),
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/mednavigator",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  agentServiceUrl: process.env.AGENT_SERVICE_URL || "http://localhost:8001",
  agentInvokePath: process.env.AGENT_INVOKE_PATH || "/agent/invoke",
  agentTimeoutMs: positiveInt(
    process.env.AGENT_SERVICE_TIMEOUT,
    30000,
    "AGENT_SERVICE_TIMEOUT",
  ),
  chatContextLimit: positiveInt(
    process.env.CHAT_CONTEXT_LIMIT,
    20,
    "CHAT_CONTEXT_LIMIT",
  ),
  // Must match the auth service access-token secret.
  jwtSecret: process.env.JWT_ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "",
};
