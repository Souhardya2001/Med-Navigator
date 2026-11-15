const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');

async function start() {
  app.listen(config.port, () => logger.info('server_started', { port: config.port }));
}

start().catch((error) => { logger.error('server_start_failed', { message: error.message }); process.exit(1); });
async function shutdown() { process.exit(0); }
process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
