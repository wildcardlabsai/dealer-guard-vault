import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// Convert DB row to Enquiry
function fromRow(row: any): Enquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    subject: row.subject,
    message: row.message,
    createdAt: row.created_at,
    read: row.read,
  };
}

export async function addEnquiry(e: Omit<Enquiry, "id" | "createdAt" | "read">): Promise<Enquiry> {
  // Insert into Supabase via edge function (no auth required for public forms)
  try {
    const { data } = await supabase.functions.invoke("admin-data", {
      body: {
        table: "enquiries",
        action: "insert",
        updates: {
          name: e.name,
          email: e.email,
          phone: e.phone || null,
          subject: e.subject,
          message: e.message,
        },
      },
    });
    if (data?.data) {
      const enquiry = fromRow(data.data);
      notify();
      return enquiry;
    }
  } catch (err) {
    console.error("Failed to save enquiry to database:", err);
  }

  // Fallback to local
  const enquiry: Enquiry = {
    ...e,
    id: `enq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  notify();
  return enquiry;
}

const listeners: Array<() => void> = [];
const notify = () => listeners.forEach(l => l());

export async function markEnquiryRead(id: string) {
  try {
    await supabase.functions.invoke("admin-data", {
      body: { table: "enquiries", action: "update", id, updates: { read: true } },
    });
  } catch (err) {
    console.error("Failed to mark enquiry read:", err);
  }
  notify();
}

export async function markAllEnquiriesRead(enquiries: Enquiry[]) {
  try {
    await Promise.all(
      enquiries.filter(e => !e.read).map(e =>
        supabase.functions.invoke("admin-data", {
          body: { table: "enquiries", action: "update", id: e.id, updates: { read: true } },
        })
      )
    );
  } catch (err) {
    console.error("Failed to mark all read:", err);
  }
  notify();
}

export function useEnquiryStore() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);

  const fetchEnquiries = useCallback(async () => {
    try {
      const { data } = await supabase.functions.invoke("admin-data", {
        body: { table: "enquiries", action: "select" },
      });
      if (data?.data) {
        setEnquiries(data.data.map(fromRow));
      }
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEnquiries();
    const cb = () => {
      setTick(t => t + 1);
      fetchEnquiries();
    };
    listeners.push(cb);
    return () => {
      const i = listeners.indexOf(cb);
      if (i >= 0) listeners.splice(i, 1);
    };
  }, [fetchEnquiries]);

  const unreadCount = enquiries.filter(e => !e.read).length;

  return {
    enquiries,
    unreadCount,
    loading,
    addEnquiry,
    markEnquiryRead: async (id: string) => {
      await markEnquiryRead(id);
    },
    markAllEnquiriesRead: async () => {
      await markAllEnquiriesRead(enquiries);
    },
  };
}
