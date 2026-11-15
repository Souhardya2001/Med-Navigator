const config = require("../config/config");
const AppError = require("../utils/app-error");
const logger = require("../utils/logger");

async function invoke({ query, chatHistory, userContext }) {
  const url = new URL(
    config.agentInvokePath,
    config.agentServiceUrl,
  ).toString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.agentTimeoutMs);
  try {
    logger.info("agent_request_started", {
      url,
      query,
      chatHistory,
      userContext,
    });
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        query,
        chat_history: chatHistory,
        ...(userContext ? { user_context: userContext } : {}),
      }),
    });
    if (!response.ok)
      throw new AppError(
        502,
        "AGENT_SERVICE_ERROR",
        "Unable to generate a response right now",
      );
    const body = await response.json();
    logger.info("agent_response_received", {
      status: response.status,
      body,
    });

    if (
      !body ||
      typeof body.response !== "string" ||
      !Array.isArray(body.tools_used) ||
      !Array.isArray(body.sources)
    ) {
      throw new AppError(
        502,
        "AGENT_SERVICE_INVALID_RESPONSE",
        "Unable to generate a response right now",
      );
    }
    return {
      content: body.response,
      toolsUsed: body.tools_used,
      sources: body.sources,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.warn("agent_request_failed", { reason: error.name });
    if (error.name === "AbortError")
      throw new AppError(
        504,
        "AGENT_SERVICE_TIMEOUT",
        "The response service timed out",
      );
    throw new AppError(
      502,
      "AGENT_SERVICE_UNAVAILABLE",
      "Unable to generate a response right now",
    );
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { invoke };
