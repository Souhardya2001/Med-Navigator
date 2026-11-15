const { client } = require("./redis.client");
const logger = require("../utils/logger");

const getRecentMessagesKey = (chatId) => `chat:${chatId}:recent_messages`;

async function getRecentMessages(chatId) {
  try {
    if (!client.isReady) return null;
    const value = await client.get(getRecentMessagesKey(chatId));
    if (!value) {
      logger.info("chat_context_cache_miss", { chatId });
      return null;
    }
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return null;
    logger.info("chat_context_cache_hit", { chatId });
    return parsed;
  } catch (error) {
    logger.warn("chat_context_cache_read_failed", {
      chatId,
      message: error.message,
    });
    return null;
  }
}

async function setRecentMessages(chatId, messages) {
  try {
    if (client.isReady)
      await client.set(getRecentMessagesKey(chatId), JSON.stringify(messages));
  } catch (error) {
    logger.warn("chat_context_cache_write_failed", {
      chatId,
      message: error.message,
    });
  }
}

async function invalidateRecentMessages(chatId) {
  try {
    if (client.isReady) await client.del(getRecentMessagesKey(chatId));
  } catch (error) {
    logger.warn("chat_context_cache_invalidation_failed", {
      chatId,
      message: error.message,
    });
  }
}

module.exports = {
  getRecentMessagesKey,
  getRecentMessages,
  setRecentMessages,
  invalidateRecentMessages,
};
