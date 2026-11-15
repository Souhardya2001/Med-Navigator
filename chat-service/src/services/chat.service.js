const chatRepository = require("../repositories/chat.repository");
const messageRepository = require("../repositories/message.repository");
const chatCache = require("../cache/chat.cache");
const config = require("../config/config");
const AppError = require("../utils/app-error");
const logger = require("../utils/logger");

const toChat = (chat) => ({
  id: chat.id,
  title: chat.title,
  createdAt: chat.createdAt,
  updatedAt: chat.updatedAt,
});
const toMessage = (message) => ({
  id: message.id,
  role: message.role,
  content: message.content,
  status: message.status,
  metadata: message.metadata,
  createdAt: message.createdAt,
  updatedAt: message.updatedAt,
});

async function create(userId, title) {
  const chat = await chatRepository.create({
    userId,
    title: title || "New conversation",
  });
  logger.info("chat_created", { chatId: chat.id, userId });
  return toChat(chat);
}
async function list(userId, limit, offset) {
  return (await chatRepository.listByUser(userId, limit, offset)).map(toChat);
}
async function getOwned(chatId, userId) {
  const chat = await chatRepository.findOwnedById(chatId, userId);
  if (!chat) throw new AppError(404, "CHAT_NOT_FOUND", "Chat not found");
  return chat;
}
async function get(chatId, userId) {
  return toChat(await getOwned(chatId, userId));
}
async function remove(chatId, userId) {
  await getOwned(chatId, userId);
  // Delete dependents first so a failure cannot leave messages without their chat.
  await messageRepository.deleteByChatId(chatId);
  await chatRepository.deleteOwnedById(chatId, userId);
  await chatCache.invalidateRecentMessages(chatId);
  logger.info("chat_deleted", { chatId, userId });
}
async function messages(chatId, userId, limit, before) {
  await getOwned(chatId, userId);
  const page = await messageRepository.findPage(chatId, limit, before);
  return page.reverse().map(toMessage);
}
async function recentContext(chatId) {
  const cached = await chatCache.getRecentMessages(chatId);
  if (cached) return cached;
  const recent = await messageRepository.findRecent(
    chatId,
    config.chatContextLimit,
  );
  const normalized = recent
    .reverse()
    .map(({ role, content }) => ({ role, content }));
  await chatCache.setRecentMessages(chatId, normalized);
  return normalized;
}
async function addMessage({
  chatId,
  userId,
  content,
  userContext,
  agentService,
}) {
  await getOwned(chatId, userId);
  const userMessage = await messageRepository.create({
    chatId,
    userId,
    role: "user",
    content,
  });

  await chatRepository.touch(chatId, userMessage.createdAt);
  // Invalidate after each authoritative write. This avoids cache races while keeping reads cache-aside.
  await chatCache.invalidateRecentMessages(chatId);
  const history = await recentContext(chatId);
  // The just-persisted user message is the newest item; query is sent separately by contract.
  const chatHistory = history.slice(0, -1);
  const agentResponse = await agentService.invoke({
    query: content,
    chatHistory,
    userContext,
  });
  const assistantMessage = await messageRepository.create({
    chatId,
    userId,
    role: "assistant",
    content: agentResponse.content,
    metadata: {
      toolsUsed: agentResponse.toolsUsed,
      sources: agentResponse.sources,
    },
  });

  await chatRepository.touch(chatId, assistantMessage.createdAt);
  await chatCache.invalidateRecentMessages(chatId);
  logger.info("assistant_message_created", { chatId, userId });
  return {
    userMessage: toMessage(userMessage),
    assistantMessage: toMessage(assistantMessage),
  };
}

module.exports = {
  create,
  list,
  get,
  getOwned,
  remove,
  messages,
  recentContext,
  addMessage,
};
