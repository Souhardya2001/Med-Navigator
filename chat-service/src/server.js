const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const { connectRedis, client } = require("./cache/redis.client");
const logger = require("./utils/logger");

async function start() {
  await mongoose.connect(config.mongoUri);
  logger.info("mongodb_connected");
  await connectRedis(); // Redis is optional; cache helpers degrade gracefully if it is down.
  app.listen(config.port, () =>
    logger.info("server_started", { port: config.port }),
  );
}

start().catch((error) => {
  logger.error("server_start_failed", { message: error.message });
  process.exit(1);
});
async function shutdown() {
  await Promise.allSettled([
    mongoose.disconnect(),
    client.isOpen ? client.quit() : Promise.resolve(),
  ]);
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
