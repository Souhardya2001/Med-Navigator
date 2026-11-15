export const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL;
export const CHAT_API_BASE_URL = import.meta.env.VITE_CHAT_API_BASE_URL;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function request(path, options = {}, baseUrl) {
  const token = sessionStorage.getItem("mednavigator_token");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      credentials: "include",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(
        data?.error?.message ||
          data?.message ||
          "Something went wrong. Please try again.",
        response.status,
      );
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new ApiError("The request took too long. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}