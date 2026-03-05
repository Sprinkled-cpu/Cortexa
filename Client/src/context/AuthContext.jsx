import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(email, password) {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  async function loadUser() {
    try {
      const data = await apiRequest("/api/user/me");
      setUser(data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, loadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
