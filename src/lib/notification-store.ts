import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AppNotification {
  id: string;
  type: "claim" | "warranty" | "expiry" | "signup" | "support" | "general";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

async function dbCall(body: Record<string, unknown>) {
  try {
    const { data } = await supabase.functions.invoke("admin-data", { body });
    return data?.data || null;
  } catch (err) {
    console.error("Notification DB call failed:", err);
    return null;
  }
}

function rowToNotification(r: any): AppNotification {
  return {
    id: r.id,
    type: r.type || "general",
    title: r.title,
    message: r.message,
    timestamp: r.created_at,
    read: r.read,
    link: r.link || undefined,
  };
}

// --- In-memory cache keyed by userId ---
const notifications: Record<string, AppNotification[]> = {};
const listeners: Array<() => void> = [];
const notify = () => listeners.forEach(l => l());
const loadedUsers = new Set<string>();

async function loadNotifications(userId: string) {
  if (loadedUsers.has(userId)) return;
  const rows = await dbCall({ table: "notifications", action: "select", filters: { user_id: userId } });
  if (rows) {
    notifications[userId] = rows.map(rowToNotification);
  } else {
    notifications[userId] = [];
  }
  loadedUsers.add(userId);
  notify();
}

export function pushNotification(userId: string, n: Omit<AppNotification, "id" | "timestamp" | "read">) {
  const notif: AppNotification = {
    ...n,
    id: `notif-${Date.now()}`,
    timestamp: new Date().toISOString(),
    read: false,
  };
  if (!notifications[userId]) notifications[userId] = [];
  notifications[userId].unshift(notif);
  if (notifications[userId].length > 50) notifications[userId].length = 50;
  notify();
  // Persist to DB
  dbCall({
    table: "notifications", action: "insert",
    updates: { user_id: userId, type: n.type, title: n.title, message: n.message, link: n.link || null, read: false },
  }).catch(() => {});
}

export function useNotificationStore() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const fn = () => setTick(t => t + 1);
    listeners.push(fn);
    return () => { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); };
  }, []);

  return {
    getNotifications(userId: string): AppNotification[] {
      if (!notifications[userId] && !loadedUsers.has(userId)) {
        loadNotifications(userId);
        return [];
      }
      return notifications[userId] || [];
    },
    unreadCount(userId: string): number {
      return (notifications[userId] || []).filter(n => !n.read).length;
    },
    markRead(userId: string, notifId: string) {
      const list = notifications[userId];
      if (!list) return;
      const n = list.find(x => x.id === notifId);
      if (n) {
        n.read = true;
        notify();
        dbCall({ table: "notifications", action: "update", id: notifId, updates: { read: true } }).catch(() => {});
      }
    },
    markAllRead(userId: string) {
      const list = notifications[userId];
      if (!list) return;
      list.forEach(n => {
        if (!n.read) {
          n.read = true;
          dbCall({ table: "notifications", action: "update", id: n.id, updates: { read: true } }).catch(() => {});
        }
      });
      notify();
    },
    push: pushNotification,
  };
}
