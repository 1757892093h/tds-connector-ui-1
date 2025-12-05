"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  did: string;
  username?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (did: string, signature: string) => Promise<void>;
  register: (did: string, signature: string, username?: string, email?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 检查本地存储的认证信息
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token");
      const userDID = localStorage.getItem("user_did");

      if (!token || !userDID) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // 验证 token 是否有效
      const response = await fetch("/tdsc/api/v1/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Token 无效，清除本地存储
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_did");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (did: string, signature: string) => {
    try {
      const response = await fetch("/tdsc/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ did, signature }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const { token, user: userData } = data;

      // 存储认证信息
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_did", did);

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (did: string, signature: string, username?: string, email?: string) => {
    try {
      const response = await fetch("/tdsc/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          did,
          signature,
          username,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      const { token, user: userData } = data;

      // 存储认证信息
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_did", did);

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // 可选：通知后端登出
      await fetch("/tdsc/api/v1/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // 清除本地存储
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_did");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}