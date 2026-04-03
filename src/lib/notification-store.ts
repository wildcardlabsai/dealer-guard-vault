import { useState, useEffect } from "react";

export interface AppNotification {
  id: string;
  type: "claim" | "warranty" | "expiry" | "signup" | "support" | "general";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const notifications: Record<string, AppNotification[]> = {};
const listeners: Array<() => void> = [];
const notify = () => listeners.forEach(l => l());

let idCounter = 1;

export function pushNotification(userId: string, n: Omit<AppNotification, "id" | "timestamp" | "read">) {
  if (!notifications[userId]) notifications[userId] = [];
  notifications[userId].unshift({
    ...n,
    id: `notif-${idCounter++}`,
    timestamp: new Date().toISOString(),
    read: false,
  });
  // Keep max 50
  if (notifications[userId].length > 50) notifications[userId].length = 50;
  notify();
}

// Seed some demo notifications
function seedNotifications(userId: string) {
  if (notifications[userId]) return;
  const now = Date.now();
  notifications[userId] = [
    { id: "notif-s1", type: "claim", title: "New Claim Submitted", message: "A claim has been submitted for AB12 CDE – Engine misfire.", timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(), read: false, link: "/dealer/claims" },
    { id: "notif-s2", type: "expiry", title: "Warranty Expiring", message: "Warranty for XY34 FGH expires in 5 days.", timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(), read: false, link: "/dealer/warranties" },
    { id: "notif-s3", type: "warranty", title: "Warranty Issued", message: "New warranty successfully issued for JK56 LMN.", timestamp: new Date(now - 24 * 60 * 60 * 1000).toISOString(), read: true, link: "/dealer/warranties" },
    { id: "notif-s4", type: "support", title: "Support Reply", message: "Your support ticket #SUP-001 has a new reply.", timestamp: new Date(now - 48 * 60 * 60 * 1000).toISOString(), read: true, link: "/dealer/support" },
  ];
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
      seedNotifications(userId);
      return notifications[userId] || [];
    },
    unreadCount(userId: string): number {
      seedNotifications(userId);
      return (notifications[userId] || []).filter(n => !n.read).length;
    },
    markRead(userId: string, notifId: string) {
      const list = notifications[userId];
      if (!list) return;
      const n = list.find(x => x.id === notifId);
      if (n) { n.read = true; notify(); }
    },
    markAllRead(userId: string) {
      const list = notifications[userId];
      if (!list) return;
      list.forEach(n => { n.read = true; });
      notify();
    },
    push: pushNotification,
  };
}
