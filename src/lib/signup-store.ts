import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SignupRequest {
  id: string;
  dealershipName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  fcaNumber: string;
  estimatedVolume: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

function fromRow(row: any): SignupRequest {
  return {
    id: row.id,
    dealershipName: row.dealership_name,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone || "",
    address: row.address || "",
    city: row.city || "",
    postcode: row.postcode || "",
    fcaNumber: row.fca_number || "",
    estimatedVolume: row.estimated_volume || "",
    message: row.message || "",
    status: row.status,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at || undefined,
    rejectionReason: row.rejection_reason || undefined,
  };
}

// Send admin notification email when a new signup request is submitted
async function notifyAdminOfSignup(req: SignupRequest) {
  try {
    await supabase.functions.invoke("send-email", {
      body: {
        to: "dealeropsdms@gmail.com",
        subject: `New Dealer Signup Request — ${req.dealershipName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0f172a; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: #2dd4a0; margin: 0; font-size: 20px;">New Dealer Signup Request</h1>
            </div>
            <div style="background: #1e293b; padding: 24px; border-radius: 0 0 12px 12px; color: #e2e8f0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #94a3b8;">Dealership:</td><td style="padding: 8px 0; font-weight: bold;">${req.dealershipName}</td></tr>
                <tr><td style="padding: 8px 0; color: #94a3b8;">Contact:</td><td style="padding: 8px 0;">${req.contactName}</td></tr>
                <tr><td style="padding: 8px 0; color: #94a3b8;">Email:</td><td style="padding: 8px 0;">${req.email}</td></tr>
                <tr><td style="padding: 8px 0; color: #94a3b8;">Phone:</td><td style="padding: 8px 0;">${req.phone}</td></tr>
                <tr><td style="padding: 8px 0; color: #94a3b8;">City:</td><td style="padding: 8px 0;">${req.city || "—"}</td></tr>
                <tr><td style="padding: 8px 0; color: #94a3b8;">Postcode:</td><td style="padding: 8px 0;">${req.postcode || "—"}</td></tr>
                <tr><td style="padding: 8px 0; color: #94a3b8;">FCA Number:</td><td style="padding: 8px 0;">${req.fcaNumber || "—"}</td></tr>
                <tr><td style="padding: 8px 0; color: #94a3b8;">Est. Volume:</td><td style="padding: 8px 0;">${req.estimatedVolume || "—"}</td></tr>
                ${req.message ? `<tr><td style="padding: 8px 0; color: #94a3b8;">Message:</td><td style="padding: 8px 0;">${req.message}</td></tr>` : ""}
              </table>
              <div style="margin-top: 20px; padding: 12px; background: #0f172a; border-radius: 8px; text-align: center;">
                <p style="color: #94a3b8; margin: 0; font-size: 13px;">Log in to the Admin Panel to review and approve this request.</p>
              </div>
            </div>
          </div>
        `,
      },
    });
  } catch (err) {
    console.error("Failed to send admin signup notification:", err);
  }
}

let listeners: (() => void)[] = [];
function notify() {
  listeners.forEach(l => l());
}

export function useSignupStore() {
  const [signupRequests, setSignupRequests] = useState<SignupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);

  const fetchRequests = useCallback(async () => {
    try {
      const { data } = await supabase.functions.invoke("admin-data", {
        body: { table: "signup_requests", action: "select" },
      });
      if (data?.data) {
        setSignupRequests(data.data.map(fromRow));
      }
    } catch (err) {
      console.error("Failed to fetch signup requests:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();
    const cb = () => {
      setTick(t => t + 1);
      fetchRequests();
    };
    listeners.push(cb);
    return () => {
      listeners = listeners.filter(l => l !== cb);
    };
  }, [fetchRequests]);

  return {
    signupRequests,
    loading,

    async addRequest(req: Omit<SignupRequest, "id" | "createdAt" | "status"> & {
      acceptedTerms?: boolean;
      termsVersion?: string;
      ipAddress?: string | null;
      userAgent?: string;
    }) {
      try {
        await supabase.functions.invoke("admin-data", {
          body: {
            table: "signup_requests",
            action: "insert",
            updates: {
              dealership_name: req.dealershipName,
              contact_name: req.contactName,
              email: req.email,
              phone: req.phone,
              address: req.address,
              city: req.city,
              postcode: req.postcode,
              fca_number: req.fcaNumber,
              estimated_volume: req.estimatedVolume,
              message: req.message,
              status: "pending",
              accepted_signup_terms: !!req.acceptedTerms,
              accepted_signup_terms_at: req.acceptedTerms ? new Date().toISOString() : null,
              signup_terms_version: req.termsVersion || null,
              signup_ip_address: req.ipAddress || null,
              signup_user_agent: req.userAgent || null,
            },
          },
        });
      } catch (err) {
        console.error("Failed to save signup request:", err);
      }
      notify();
      // Send email notification
      notifyAdminOfSignup({
        ...req,
        id: "",
        status: "pending",
        createdAt: new Date().toISOString(),
      } as SignupRequest);
    },

    async approveRequest(id: string) {
      try {
        await supabase.functions.invoke("admin-data", {
          body: {
            table: "signup_requests",
            action: "update",
            id,
            updates: { status: "approved", reviewed_at: new Date().toISOString() },
          },
        });
      } catch (err) {
        console.error("Failed to approve request:", err);
      }
      notify();
    },

    async rejectRequest(id: string, reason?: string) {
      try {
        await supabase.functions.invoke("admin-data", {
          body: {
            table: "signup_requests",
            action: "update",
            id,
            updates: {
              status: "rejected",
              reviewed_at: new Date().toISOString(),
              rejection_reason: reason || null,
            },
          },
        });
      } catch (err) {
        console.error("Failed to reject request:", err);
      }
      notify();
    },
  };
}
