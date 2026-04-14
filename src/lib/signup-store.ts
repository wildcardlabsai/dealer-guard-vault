import { useState, useEffect } from "react";
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

const STORAGE_KEY = "wv_signup_requests";

function loadRequests(): SignupRequest[] {
  const demoRequests: SignupRequest[] = [
    {
      id: "sr-1",
      dealershipName: "Apex Auto Group",
      contactName: "Marcus Reid",
      email: "marcus@apexautogroup.co.uk",
      phone: "07700 900100",
      address: "14 Station Road",
      city: "Bristol",
      postcode: "BS1 4DJ",
      fcaNumber: "FCA-567890",
      estimatedVolume: "15-25",
      message: "Looking to move away from our current warranty provider.",
      status: "pending",
      createdAt: "2025-03-28T10:30:00Z",
    },
    {
      id: "sr-2",
      dealershipName: "Northern Motors",
      contactName: "Fiona Clarke",
      email: "fiona@northernmotors.co.uk",
      phone: "07700 900200",
      address: "82 Westgate",
      city: "Newcastle",
      postcode: "NE1 4AG",
      fcaNumber: "",
      estimatedVolume: "5-10",
      message: "",
      status: "pending",
      createdAt: "2025-03-30T14:15:00Z",
    },
  ];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const added = JSON.parse(raw) as SignupRequest[];
      return [...added, ...demoRequests];
    }
  } catch {}
  return demoRequests;
}

function getAdded(): SignupRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveAdded(added: SignupRequest[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(added));
  } catch {}
}

let signupRequests: SignupRequest[] = loadRequests();
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach(l => l());
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

export function useSignupStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  return {
    signupRequests,

    addRequest(req: SignupRequest) {
      const added = getAdded();
      added.unshift(req);
      saveAdded(added);
      signupRequests = loadRequests();
      notify();
      // Send email notification to admin
      notifyAdminOfSignup(req);
    },

    approveRequest(id: string) {
      // Update in added list if present
      const added = getAdded();
      const addedIdx = added.findIndex(r => r.id === id);
      if (addedIdx >= 0) {
        added[addedIdx] = { ...added[addedIdx], status: "approved", reviewedAt: new Date().toISOString() };
        saveAdded(added);
      }
      signupRequests = signupRequests.map(r =>
        r.id === id ? { ...r, status: "approved" as const, reviewedAt: new Date().toISOString() } : r
      );
      notify();
    },

    rejectRequest(id: string, reason?: string) {
      const added = getAdded();
      const addedIdx = added.findIndex(r => r.id === id);
      if (addedIdx >= 0) {
        added[addedIdx] = { ...added[addedIdx], status: "rejected", reviewedAt: new Date().toISOString(), rejectionReason: reason };
        saveAdded(added);
      }
      signupRequests = signupRequests.map(r =>
        r.id === id ? { ...r, status: "rejected" as const, reviewedAt: new Date().toISOString(), rejectionReason: reason } : r
      );
      notify();
    },
  };
}
