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

async function buildUserFromSupabase(supaUser: { id: string; email?: string; user_metadata?: Record<string, any> }): Promise<User> {
  const meta = supaUser.user_metadata || {};
  let role: UserRole = meta.role || "customer";
  let dealerId: string | undefined = meta.dealerId;
  let name: string = meta.name || meta.full_name || supaUser.email?.split("@")[0] || "Customer";

  // Source of truth for role/dealer is the profiles table
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, dealer_id, full_name")
      .eq("user_id", supaUser.id)
      .maybeSingle();
    if (profile) {
      if (profile.role) role = profile.role as UserRole;
      if (profile.dealer_id) dealerId = profile.dealer_id;
      if (profile.full_name) name = profile.full_name;
    }
  } catch {
    // fall back to metadata defaults
  }

  return {
    id: supaUser.id,
    email: supaUser.email || "",
    name,
    role,
    dealerId,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  // On mount, restore session
  useEffect(() => {
    let cancelled = false;

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

    // Set up listener BEFORE getSession to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Defer the async profile lookup to avoid deadlocks inside the auth callback
        setTimeout(async () => {
          if (cancelled) return;
          const next = await buildUserFromSupabase(session.user);
          setUser(prev => {
            if (prev && demoPasswords[prev.email]) return prev;
            return next;
          });
        }, 0);
      } else {
        setUser(prev => {
          if (prev && demoPasswords[prev.email]) return prev;
          return null;
        });
      }
    });

    // 2. Check for real Supabase session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const u = await buildUserFromSupabase(session.user);
        if (!cancelled) setUser(u);
      }
      if (!cancelled) setIsReady(true);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
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
