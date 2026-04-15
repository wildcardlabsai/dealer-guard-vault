import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { User, UserRole } from "@/data/demo-data";
import { supabase } from "@/integrations/supabase/client";

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
    name: meta.name || meta.full_name || supaUser.email?.split("@")[0] || "User",
    role,
    dealerId: meta.dealerId,
    dealerName: meta.dealerName,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(buildUserFromSupabase(session.user));
      }
      setIsReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(buildUserFromSupabase(session.user));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
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
