const chatService = require("../services/chat.service");
const agentService = require("../services/agent.service");
const AppError = require("../utils/app-error");
const validation = require("../middleware/validation.middleware");

exports.list = async (req, res, next) => {
  try {
    const before = req.query.before;
    if (before && !validation.objectId(before))
      throw new AppError(400, "VALIDATION_ERROR", "Invalid before message ID");
    const messages = await chatService.messages(
      req.params.chatId,
      req.user.id,
      req.pagination.limit,
      before,
    );
    res.json({ data: { messages, limit: req.pagination.limit } });
  } catch (error) {
    next(error);
  }
};
exports.create = async (req, res, next) => {
  try {
    const result = await chatService.addMessage({
      chatId: req.params.chatId,
      userId: req.user.id,
      content: req.body.content,
      userContext: req.body.user_context,
      agentService,
    });
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};
