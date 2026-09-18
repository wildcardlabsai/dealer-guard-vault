import React, { createContext, useContext, useState, useCallback } from "react";
import { User, UserRole, demoUsers } from "@/data/demo-data";

const demoPasswords: Record<string, string> = {
  "admin@warrantyvault.com": "admin123",
  "dealer@prestige-motors.co.uk": "dealer123",
  "john@example.com": "customer123",
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 500));
    const found = demoUsers.find(u => u.email === email);
    if (found && demoPasswords[email] === password) {
      setUser(found);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
