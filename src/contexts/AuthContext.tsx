import React, { createContext, useContext, useState, useCallback } from "react";
import { User, UserRole, demoUsers } from "@/data/demo-data";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginAs: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 500));
    const found = demoUsers.find(u => u.email === email);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  }, []);

  const loginAs = useCallback((role: UserRole) => {
    const found = demoUsers.find(u => u.role === role);
    if (found) setUser(found);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loginAs }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
