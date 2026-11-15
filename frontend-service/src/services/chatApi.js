import { CHAT_API_BASE_URL, request } from "./api";

export const createChat = async () => {
  const response = await request(
    "/chats",
    { method: "POST" },
    CHAT_API_BASE_URL,
  );

  return response.data;
};

export const getChats = async () => {
  const response = await request(
    "/chats",
    {},
    CHAT_API_BASE_URL,
  );

  return response.data;
};

export const getChat = async (id) => {
  const response = await request(
    `/chats/${id}`,
    {},
    CHAT_API_BASE_URL,
  );

  return response.data;
};

export const deleteChat = (id) =>
  request(
    `/chats/${id}`,
    { method: "DELETE" },
    CHAT_API_BASE_URL,
  );

export const getMessages = async (id, params = {}) => {
  const query = new URLSearchParams(params).toString();

  const response = await request(
    `/chats/${id}/messages${query ? `?${query}` : ""}`,
    {},
    CHAT_API_BASE_URL,
  );

  return response.data;
};

export const sendMessage = async (id, content, userContext) => {
  const response = await request(
    `/chats/${id}/messages`,
    {
      method: "POST",
      body: JSON.stringify({
        content,
        ...(userContext ? { user_context: userContext } : {}),
      }),
    },
    CHAT_API_BASE_URL,
  );

  return response.data;
};