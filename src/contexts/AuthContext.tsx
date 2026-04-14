import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { User, UserRole, demoUsers } from "@/data/demo-data";
import { supabase } from "@/integrations/supabase/client";

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

function buildUserFromSupabase(supaUser: { id: string; email?: string; user_metadata?: Record<string, any> }): User {
  const meta = supaUser.user_metadata || {};
  const role: UserRole = meta.role || "customer";
  return {
    id: supaUser.id,
    email: supaUser.email || "",
    name: meta.name || supaUser.email?.split("@")[0] || "Customer",
    role,
    dealerId: meta.dealerId,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // On mount, check for existing Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !user) {
        // Only restore if not already logged in as demo user
        setUser(buildUserFromSupabase(session.user));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(prev => {
          // Don't overwrite a demo user session
          if (prev && demoPasswords[prev.email]) return prev;
          return buildUserFromSupabase(session.user);
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // 1. Try demo credentials first
    const found = demoUsers.find(u => u.email === email);
    if (found && demoPasswords[email] === password) {
      await new Promise(r => setTimeout(r, 500));
      setUser(found);
      return true;
    }

    // 2. Try Supabase Auth for real accounts (e.g. invited customers)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data.user) {
        setUser(buildUserFromSupabase(data.user));
        return true;
      }
    } catch {
      // Fall through
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    supabase.auth.signOut().catch(() => {});
    setUser(null);
  }, []);

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
