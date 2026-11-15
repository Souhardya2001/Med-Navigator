const logger = require('../utils/logger');

module.exports = (error, req, res, _next) => {
  const status = error.statusCode || 500;
  const code = error.code || 'INTERNAL_SERVER_ERROR';
  if (status >= 500) logger.error('request_failed', { code, path: req.path, requestId: req.id });
  res.status(status).json({ error: { code, message: status === 500 ? 'An unexpected error occurred' : error.message } });
};
