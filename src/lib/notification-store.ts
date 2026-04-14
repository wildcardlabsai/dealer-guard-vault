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
    loadedUsers.add(userId);
    notify();
  } else {
    // Seed demo notifications if none exist
    seedNotifications(userId);
  }
}

function seedNotifications(userId: string) {
  if (notifications[userId]?.length) return;
  const now = Date.now();
  let items: AppNotification[] = [];

  if (userId.startsWith("admin") || userId === "admin-1") {
    items = [
      { id: "notif-a1", type: "signup", title: "New Dealer Signup", message: "AutoCare Solutions has submitted a signup request.", timestamp: new Date(now - 1 * 60 * 60 * 1000).toISOString(), read: false, link: "/admin/signup-requests" },
      { id: "notif-a2", type: "claim", title: "Claim Escalated", message: "Claim CLM-2025-003 has been escalated for review.", timestamp: new Date(now - 3 * 60 * 60 * 1000).toISOString(), read: false, link: "/admin/claims" },
      { id: "notif-a3", type: "support", title: "Open Support Ticket", message: "Dealer Prestige Motors raised a support ticket.", timestamp: new Date(now - 12 * 60 * 60 * 1000).toISOString(), read: true, link: "/admin/support" },
    ];
  } else if (userId.startsWith("customer") || userId === "cust-1") {
    items = [
      { id: "notif-c1", type: "claim", title: "Claim Update", message: "Your claim for AB12 CDE is now under review.", timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(), read: false, link: "/customer/claims" },
      { id: "notif-c2", type: "warranty", title: "Warranty Active", message: "Your warranty for AB12 CDE is active until Dec 2025.", timestamp: new Date(now - 24 * 60 * 60 * 1000).toISOString(), read: true, link: "/customer/warranty" },
    ];
  } else {
    items = [
      { id: "notif-s1", type: "claim", title: "New Claim Submitted", message: "A claim has been submitted for AB12 CDE – Engine misfire.", timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(), read: false, link: "/dealer/claims" },
      { id: "notif-s2", type: "expiry", title: "Warranty Expiring", message: "Warranty for XY34 FGH expires in 5 days.", timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(), read: false, link: "/dealer/warranties" },
    ];
  }
  notifications[userId] = items;
  // Persist seed to DB
  items.forEach(n => {
    dbCall({
      table: "notifications", action: "insert",
      updates: { user_id: userId, type: n.type, title: n.title, message: n.message, link: n.link || null, read: n.read },
    }).catch(() => {});
  });
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
