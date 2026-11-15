const chatService = require("../services/chat.service");

exports.create = async (req, res, next) => {
  try {
    res
      .status(201)
      .json({ data: await chatService.create(req.user.id, req.body.title) });
  } catch (error) {
    next(error);
  }
};
exports.list = async (req, res, next) => {
  try {
    const chats = await chatService.list(
      req.user.id,
      req.pagination.limit,
      req.pagination.offset,
    );
    res.json({
      data: {
        chats,
        limit: req.pagination.limit,
        offset: req.pagination.offset,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.get = async (req, res, next) => {
  try {
    res.json({ data: await chatService.get(req.params.chatId, req.user.id) });
  } catch (error) {
    next(error);
  }
};
exports.remove = async (req, res, next) => {
  try {
    await chatService.remove(req.params.chatId, req.user.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
