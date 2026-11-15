const mongoose = require("mongoose");
const AppError = require("../utils/app-error");

const objectId = (value) => mongoose.isObjectIdOrHexString(value);
const integer = (value, fallback, max) => {
  const n = value === undefined ? fallback : Number(value);
  if (!Number.isInteger(n) || n < 0 || n > max)
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "Invalid pagination parameters",
    );
  return n;
};
function chatId(req, res, next) {
  if (!objectId(req.params.chatId))
    return next(new AppError(400, "INVALID_CHAT_ID", "Invalid chat ID"));
  next();
}
function title(req, res, next) {
  const value = req.body.title;
  if (
    value !== undefined &&
    (typeof value !== "string" || !value.trim() || value.trim().length > 160)
  )
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Title must be 1 to 160 characters",
      ),
    );
  if (value) req.body.title = value.trim();
  next();
}
function userContext(value) {
  if (value === undefined) return;
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "user_context must be an object",
    );
  if (value.location !== undefined) {
    const { latitude, longitude } = value.location || {};
    if (
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    )
      throw new AppError(400, "VALIDATION_ERROR", "Invalid location");
  }
}
function message(req, res, next) {
  const { content } = req.body;
  if (
    typeof content !== "string" ||
    !content.trim() ||
    content.trim().length > 10000
  )
    return next(
      new AppError(
        400,
        "VALIDATION_ERROR",
        "Content must be 1 to 10000 characters",
      ),
    );
  try {
    userContext(req.body.user_context);
    req.body.content = content.trim();
    next();
  } catch (error) {
    next(error);
  }
}
function pagination(req, res, next) {
  try {
    req.pagination = {
      limit: integer(req.query.limit, 20, 100),
      offset: integer(req.query.offset, 0, 100000),
    };
    next();
  } catch (error) {
    next(error);
  }
}
module.exports = { chatId, title, message, pagination, objectId };
