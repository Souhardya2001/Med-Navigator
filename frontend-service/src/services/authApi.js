import { AUTH_API_BASE_URL, request } from "./api";
// Keep auth endpoints in one place so page components only handle UI state.
export const login = (email, password) =>
  request(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
    AUTH_API_BASE_URL,
  );
export const signup = (username, age, name, email, password) =>
  request(
    "/auth/signup",
    { method: "POST", body: JSON.stringify({
      username,
       email,
        name,
        age: Number(age),
         password }) },
    AUTH_API_BASE_URL,
  );

  export const logout = () =>
  request('/auth/logout', { method: 'POST' }, AUTH_API_BASE_URL);
  
export const getCurrentUser = () => request("/auth/profile", {}, AUTH_API_BASE_URL);
