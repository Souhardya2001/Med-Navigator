function log(level, event, details = {}) {
  // Deliberately log identifiers and operational metadata only, never message content or tokens.
  console[level](JSON.stringify({ timestamp: new Date().toISOString(), event, ...details }));
}

module.exports = {
  info: (event, details) => log('info', event, details),
  warn: (event, details) => log('warn', event, details),
  error: (event, details) => log('error', event, details)
};
