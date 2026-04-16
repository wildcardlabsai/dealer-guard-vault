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

async function fetchProfileRole(userId: string): Promise<{ role: UserRole; dealerId?: string; fullName?: string }> {
  try {
    const { data } = await supabase
      .from("profiles")
      .select("role, dealer_id, full_name")
      .eq("user_id", userId)
      .single();
    if (data) {
      return {
        role: (data.role as UserRole) || "customer",
        dealerId: data.dealer_id || undefined,
        fullName: data.full_name || undefined,
      };
    }
  } catch {
    // Fall through to metadata
  }
  return { role: "customer" };
}

async function buildUserFromSupabase(supaUser: { id: string; email?: string; user_metadata?: Record<string, any> }): Promise<User> {
  const meta = supaUser.user_metadata || {};
  
  // Always check the profiles table for the authoritative role
  const profile = await fetchProfileRole(supaUser.id);
  
  const role: UserRole = profile.role || meta.role || "customer";
  return {
    id: supaUser.id,
    email: supaUser.email || "",
    name: profile.fullName || meta.name || meta.full_name || supaUser.email?.split("@")[0] || "User",
    role,
    dealerId: profile.dealerId || meta.dealerId,
    dealerName: meta.dealerName,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const u = await buildUserFromSupabase(session.user);
        setUser(u);
      }
      setIsReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        buildUserFromSupabase(session.user).then(u => setUser(u));
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