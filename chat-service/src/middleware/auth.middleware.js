const jwt = require("jsonwebtoken");
const config = require("../config/config");
const AppError = require("../utils/app-error");

module.exports = (req, res, next) => {
  const header = req.get("authorization");
  if (!header || !header.startsWith("Bearer "))
    return next(
      new AppError(401, "UNAUTHORIZED", "Authentication is required"),
    );
  if (!config.jwtSecret)
    return next(
      new AppError(
        500,
        "AUTH_CONFIGURATION_ERROR",
        "Service authentication is not configured",
      ),
    );
  try {
    const payload = jwt.verify(header.slice(7), config.jwtSecret);
    const id = payload.id || payload.userId || payload.sub;
    if (!id) throw new Error("Missing user identifier");
    req.user = { ...payload, id: String(id) };
    return next();
  } catch {
    return next(
      new AppError(401, "UNAUTHORIZED", "Invalid authentication token"),
    );
  }
};
