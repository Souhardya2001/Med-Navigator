const Message = require('../models/message.model');

module.exports = {
  create: (data) => Message.create(data),
  deleteByChatId: (chatId) => Message.deleteMany({ chatId }),
  findRecent: (chatId, limit) => Message.find({ chatId }).sort({ createdAt: -1, _id: -1 }).limit(limit),
  findPage: (chatId, limit, before) => {
    const filter = { chatId };
    if (before) filter._id = { $lt: before };
    return Message.find(filter).sort({ createdAt: -1, _id: -1 }).limit(limit);
  }
};


