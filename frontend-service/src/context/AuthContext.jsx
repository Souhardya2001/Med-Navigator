import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../services/authApi";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const token = sessionStorage.getItem("mednavigator_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .getCurrentUser()
      .then((data) => setUser(data.user || data))
      .catch(() => sessionStorage.removeItem("mednavigator_token"))
      .finally(() => setIsLoading(false));
  }, []);
  const authenticate = (data) => {
    const token = data.token || data.accessToken || data.access_token;
    if (token) sessionStorage.setItem("mednavigator_token", token);
    setUser(data.user || data);
  };
  const logout = () => {
    sessionStorage.removeItem("mednavigator_token");
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        authenticate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
