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

  if (userId.startsWith("admin") || userId === "admin-1") {
    notifications[userId] = [
      { id: "notif-a1", type: "signup", title: "New Dealer Signup", message: "AutoCare Solutions has submitted a signup request.", timestamp: new Date(now - 1 * 60 * 60 * 1000).toISOString(), read: false, link: "/admin/signup-requests" },
      { id: "notif-a2", type: "claim", title: "Claim Escalated", message: "Claim CLM-2025-003 has been escalated for review.", timestamp: new Date(now - 3 * 60 * 60 * 1000).toISOString(), read: false, link: "/admin/claims" },
      { id: "notif-a3", type: "support", title: "Open Support Ticket", message: "Dealer Prestige Motors raised a support ticket.", timestamp: new Date(now - 12 * 60 * 60 * 1000).toISOString(), read: true, link: "/admin/support" },
      { id: "notif-a4", type: "general", title: "Monthly Report Ready", message: "The April revenue report is now available.", timestamp: new Date(now - 24 * 60 * 60 * 1000).toISOString(), read: true, link: "/admin/revenue" },
    ];
  } else if (userId.startsWith("customer") || userId === "cust-1") {
    notifications[userId] = [
      { id: "notif-c1", type: "claim", title: "Claim Update", message: "Your claim for AB12 CDE is now under review.", timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(), read: false, link: "/customer/claims" },
      { id: "notif-c2", type: "warranty", title: "Warranty Active", message: "Your warranty for AB12 CDE is active until Dec 2025.", timestamp: new Date(now - 24 * 60 * 60 * 1000).toISOString(), read: true, link: "/customer/warranty" },
      { id: "notif-c3", type: "expiry", title: "Warranty Expiring Soon", message: "Your warranty expires in 30 days. Review your cover.", timestamp: new Date(now - 48 * 60 * 60 * 1000).toISOString(), read: false, link: "/customer/cover" },
    ];
  } else {
    notifications[userId] = [
      { id: "notif-s1", type: "claim", title: "New Claim Submitted", message: "A claim has been submitted for AB12 CDE – Engine misfire.", timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(), read: false, link: "/dealer/claims" },
      { id: "notif-s2", type: "expiry", title: "Warranty Expiring", message: "Warranty for XY34 FGH expires in 5 days.", timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(), read: false, link: "/dealer/warranties" },
      { id: "notif-s3", type: "warranty", title: "Warranty Issued", message: "New warranty successfully issued for JK56 LMN.", timestamp: new Date(now - 24 * 60 * 60 * 1000).toISOString(), read: true, link: "/dealer/warranties" },
      { id: "notif-s4", type: "support", title: "Support Reply", message: "Your support ticket #SUP-001 has a new reply.", timestamp: new Date(now - 48 * 60 * 60 * 1000).toISOString(), read: true, link: "/dealer/support" },
    ];
  }
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
