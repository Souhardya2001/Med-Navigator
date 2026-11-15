const { createClient } = require("redis");
const config = require("../config/config");
const logger = require("../utils/logger");

const client = createClient({ url: config.redisUrl });
client.on("error", (error) =>
  logger.warn("redis_error", { message: error.message }),
);

async function connectRedis() {
  try {
    if (!client.isOpen) await client.connect();
  } catch (error) {
    logger.warn("redis_unavailable", { message: error.message });
  }
}

module.exports = { client, connectRedis };
