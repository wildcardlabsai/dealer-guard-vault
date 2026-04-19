import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { User, UserRole, demoUsers } from "@/data/demo-data";
import { supabase } from "@/integrations/supabase/client";

const DEMO_USER_KEY = "wv-demo-user";

const demoPasswords: Record<string, string> = {
  "admin@warrantyvault.com": "admin123",
  "dealer@prestige-motors.co.uk": "dealer123",
  "john@example.com": "customer123",
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isReady: boolean;
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
    name: meta.name || meta.full_name || supaUser.email?.split("@")[0] || "Customer",
    role,
    dealerId: meta.dealerId,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  // On mount, restore session
  useEffect(() => {
    // 1. Check for persisted demo user
    const savedDemo = localStorage.getItem(DEMO_USER_KEY);
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        if (parsed && parsed.email && demoPasswords[parsed.email]) {
          setUser(parsed);
          setIsReady(true);
          return;
        }
      } catch {
        localStorage.removeItem(DEMO_USER_KEY);
      }
    }

    // 2. Check for real Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(buildUserFromSupabase(session.user));
      }
      setIsReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(prev => {
          // Don't overwrite a demo user session
          if (prev && demoPasswords[prev.email]) return prev;
          return buildUserFromSupabase(session.user);
        });
      } else {
        // Only clear if not a demo user
        setUser(prev => {
          if (prev && demoPasswords[prev.email]) return prev;
          return null;
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
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(found));
      return true;
    }

    // 2. Try Supabase Auth for real accounts
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data.user) {
        localStorage.removeItem(DEMO_USER_KEY);
        const u = await buildUserFromSupabase(data.user);
        setUser(u);
        return true;
      }
    } catch {
      // Fall through
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(DEMO_USER_KEY);
    supabase.auth.signOut().catch(() => {});
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
