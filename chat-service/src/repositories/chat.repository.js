const Chat = require("../models/chat.model");

module.exports = {
  create: (data) => Chat.create(data),
  findOwnedById: (id, userId) => Chat.findOne({ _id: id, userId }),
  listByUser: (userId, limit, offset) =>
    Chat.find({ userId }).sort({ updatedAt: -1 }).skip(offset).limit(limit),
  deleteOwnedById: (id, userId) => Chat.findOneAndDelete({ _id: id, userId }),
  touch: (id, timestamp) =>
    Chat.updateOne({ _id: id }, { $set: { lastMessageAt: timestamp } }),
};
