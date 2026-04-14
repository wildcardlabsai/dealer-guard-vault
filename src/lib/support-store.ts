import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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

async function dbCall(body: Record<string, unknown>) {
  try {
    const { data } = await supabase.functions.invoke("admin-data", { body });
    return data?.data || null;
  } catch (err) {
    console.error("Support DB call failed:", err);
    return null;
  }
}

function rowToTicket(r: any): SupportTicket {
  return {
    id: r.id,
    dealerId: r.dealer_id,
    dealerName: r.dealer_name,
    subject: r.subject,
    status: r.status,
    priority: r.priority,
    messages: Array.isArray(r.messages) ? r.messages : [],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

let tickets: SupportTicket[] = [];
let listeners: (() => void)[] = [];
let loaded = false;

function notify() { listeners.forEach(l => l()); }

async function loadTickets() {
  const rows = await dbCall({ table: "support_tickets", action: "select" });
  if (rows) {
    tickets = rows.map(rowToTicket);
    loaded = true;
    notify();
  }
}

export function useSupportStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.push(listener);
    if (!loaded) loadTickets();
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  return {
    tickets,

    getTicketsForDealer(dealerId: string) {
      return tickets.filter(t => t.dealerId === dealerId);
    },

    async addTicket(ticket: SupportTicket) {
      await dbCall({
        table: "support_tickets", action: "insert",
        updates: {
          dealer_id: ticket.dealerId,
          dealer_name: ticket.dealerName,
          subject: ticket.subject,
          status: ticket.status || "open",
          priority: ticket.priority || "medium",
          messages: ticket.messages || [],
        },
      });
      await loadTickets();
    },

    async addMessage(ticketId: string, msg: SupportMessage) {
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) return;
      const newMessages = [...ticket.messages, msg];
      await dbCall({
        table: "support_tickets", action: "update", id: ticketId,
        updates: { messages: newMessages },
      });
      await loadTickets();
    },

    async updateStatus(ticketId: string, status: SupportTicket["status"]) {
      await dbCall({
        table: "support_tickets", action: "update", id: ticketId,
        updates: { status },
      });
      await loadTickets();
    },
  };
}
