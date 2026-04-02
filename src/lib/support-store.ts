import { useState, useEffect } from "react";

export interface SupportMessage {
  id: string;
  from: string;
  fromRole: "dealer" | "admin";
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  dealerId: string;
  dealerName: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
}

const demoTickets: SupportTicket[] = [
  {
    id: "st-1",
    dealerId: "d-1",
    dealerName: "Prestige Motors",
    subject: "How do I add a custom cover template?",
    status: "resolved",
    priority: "medium",
    messages: [
      { id: "sm-1", from: "James Harrison", fromRole: "dealer", message: "Hi, I want to create a custom cover template for our premium packages but I'm not sure how to add conditional items. Can you help?", timestamp: "2025-01-20T10:00:00Z" },
      { id: "sm-2", from: "Platform Admin", fromRole: "admin", message: "Hi James, go to Cover Templates in your sidebar, click 'Add Template', then use the 'Conditional Items' tab to add items with conditions. Let me know if you need more help!", timestamp: "2025-01-20T11:30:00Z" },
      { id: "sm-3", from: "James Harrison", fromRole: "dealer", message: "Perfect, got it working. Thanks for the quick response!", timestamp: "2025-01-20T14:00:00Z" },
    ],
    createdAt: "2025-01-20T10:00:00Z",
    updatedAt: "2025-01-20T14:00:00Z",
  },
  {
    id: "st-2",
    dealerId: "d-1",
    dealerName: "Prestige Motors",
    subject: "Certificate not showing vehicle colour",
    status: "open",
    priority: "high",
    messages: [
      { id: "sm-4", from: "James Harrison", fromRole: "dealer", message: "When I generate a certificate for warranty W-6, the vehicle colour field is showing but it seems to be missing on some older warranties. Is this a known issue?", timestamp: "2025-02-15T09:30:00Z" },
    ],
    createdAt: "2025-02-15T09:30:00Z",
    updatedAt: "2025-02-15T09:30:00Z",
  },
  {
    id: "st-3",
    dealerId: "d-2",
    dealerName: "City Autos",
    subject: "Can we get a bulk import feature?",
    status: "in_progress",
    priority: "low",
    messages: [
      { id: "sm-5", from: "Sarah Mitchell", fromRole: "dealer", message: "We have about 30 existing warranties we'd like to import. Is there a way to bulk upload them via CSV?", timestamp: "2025-02-10T16:00:00Z" },
      { id: "sm-6", from: "Platform Admin", fromRole: "admin", message: "Thanks for the suggestion Sarah. We're looking into adding a bulk import feature. I'll keep you updated on progress.", timestamp: "2025-02-11T10:00:00Z" },
    ],
    createdAt: "2025-02-10T16:00:00Z",
    updatedAt: "2025-02-11T10:00:00Z",
  },
];

let tickets = [...demoTickets];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach(l => l());
}

export function useSupportStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  return {
    tickets,

    getTicketsForDealer(dealerId: string) {
      return tickets.filter(t => t.dealerId === dealerId);
    },

    addTicket(ticket: SupportTicket) {
      tickets = [ticket, ...tickets];
      notify();
    },

    addMessage(ticketId: string, msg: SupportMessage) {
      tickets = tickets.map(t => {
        if (t.id === ticketId) {
          return { ...t, messages: [...t.messages, msg], updatedAt: msg.timestamp };
        }
        return t;
      });
      notify();
    },

    updateStatus(ticketId: string, status: SupportTicket["status"]) {
      tickets = tickets.map(t => t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t);
      notify();
    },
  };
}
