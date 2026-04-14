import { useState, useEffect, useCallback } from "react";
import { Warranty, Claim, CustomerRequest, AuditLog } from "@/data/demo-data";
import { pushNotification } from "@/lib/notification-store";
import { supabase } from "@/integrations/supabase/client";

// --- DB helpers ---
async function dbCall(body: Record<string, unknown>) {
  try {
    const { data } = await supabase.functions.invoke("admin-data", { body });
    return data?.data || null;
  } catch (err) {
    console.error("DB call failed:", err);
    return null;
  }
}

// --- Map DB rows to app types ---
function rowToWarranty(r: any): Warranty {
  return {
    id: r.id,
    customerId: r.customer_id || "",
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    dealerId: r.dealer_id,
    dealerName: r.dealer_name,
    vehicleReg: r.vehicle_reg,
    vehicleMake: r.vehicle_make,
    vehicleModel: r.vehicle_model,
    vehicleYear: parseInt(r.vehicle_year) || 0,
    vehicleColour: "",
    mileage: r.vehicle_mileage || 0,
    duration: r.duration_months,
    startDate: r.start_date,
    endDate: r.end_date,
    cost: parseFloat(r.cost) || 0,
    status: r.status,
    notes: r.notes || "",
    createdAt: r.created_at,
    coverTemplateId: r.cover_template_id,
    paymentStatus: r.is_free ? "free" : "paid",
  };
}

function rowToClaim(r: any): Claim {
  return {
    id: r.id,
    warrantyId: r.warranty_id || "",
    customerId: r.customer_id,
    customerName: r.customer_name,
    dealerId: r.dealer_id,
    vehicleReg: r.vehicle_reg,
    description: r.description || r.issue_title || "",
    status: r.status === "submitted" ? "pending" : r.status,
    amount: r.decision_amount ? parseFloat(r.decision_amount) : undefined,
    photos: [],
    timeline: Array.isArray(r.timeline) ? r.timeline : [],
    createdAt: r.created_at,
  };
}

function rowToRequest(r: any): CustomerRequest {
  return {
    id: r.id,
    customerId: r.customer_id,
    customerName: r.customer_name,
    warrantyId: r.warranty_id || "",
    dealerId: r.dealer_id,
    type: r.type,
    description: r.description,
    status: r.status,
    createdAt: r.created_at,
  };
}

function rowToAudit(r: any): AuditLog {
  return {
    id: r.id,
    dealerId: r.dealer_id || "",
    userId: r.user_id || "",
    action: r.action,
    details: r.details || "",
    timestamp: r.created_at,
  };
}

// --- Global state ---
let warranties: Warranty[] = [];
let claims: Claim[] = [];
let requests: CustomerRequest[] = [];
let auditLog: AuditLog[] = [];
let listeners: (() => void)[] = [];
let loaded = false;
const notifiedExpiries = new Set<string>();

function notify() { listeners.forEach(l => l()); }

async function loadAll() {
  const [wRows, cRows, rRows, aRows] = await Promise.all([
    dbCall({ table: "warranties", action: "select" }),
    dbCall({ table: "claims", action: "select" }),
    dbCall({ table: "customer_requests", action: "select" }),
    dbCall({ table: "audit_log", action: "select" }),
  ]);
  warranties = (wRows || []).map(rowToWarranty);
  claims = (cRows || []).map(rowToClaim);
  requests = (rRows || []).map(rowToRequest);
  auditLog = (aRows || []).map(rowToAudit);
  loaded = true;
  notify();
}

function checkExpiringWarranties(dealerId: string) {
  const now = new Date();
  const in14Days = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  warranties
    .filter(w => w.dealerId === dealerId && w.status === "active")
    .forEach(w => {
      const end = new Date(w.endDate);
      if (end >= now && end <= in14Days && !notifiedExpiries.has(w.id)) {
        notifiedExpiries.add(w.id);
        const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        pushNotification(dealerId, {
          type: "expiry",
          title: "Warranty Expiring Soon",
          message: `Warranty for ${w.vehicleReg} (${w.vehicleMake} ${w.vehicleModel}) expires in ${daysLeft} days`,
          link: "/dealer/warranties",
        });
      }
    });
}

const checkedDealers = new Set<string>();
function ensureExpiryCheck(dealerId: string) {
  if (checkedDealers.has(dealerId)) return;
  checkedDealers.add(dealerId);
  checkExpiringWarranties(dealerId);
}

export function useWarrantyStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.push(listener);
    if (!loaded) loadAll();
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  return {
    warranties,
    claims,
    requests,
    auditLog,
    ensureExpiryCheck,

    async addWarranty(w: Warranty) {
      const row = await dbCall({
        table: "warranties", action: "insert",
        updates: {
          reference: `WRN-${Date.now()}`,
          customer_id: w.customerId || null,
          customer_name: w.customerName,
          customer_email: w.customerEmail || "",
          dealer_id: w.dealerId,
          dealer_name: w.dealerName,
          vehicle_reg: w.vehicleReg,
          vehicle_make: w.vehicleMake,
          vehicle_model: w.vehicleModel,
          vehicle_year: String(w.vehicleYear),
          vehicle_mileage: w.mileage,
          duration_months: w.duration,
          start_date: w.startDate,
          end_date: w.endDate,
          cost: w.cost,
          status: w.status || "active",
          notes: w.notes,
          is_free: w.paymentStatus === "free",
          cover_template_id: w.coverTemplateId || null,
          cover_template_name: "",
        },
      });
      await dbCall({
        table: "audit_log", action: "insert",
        updates: { dealer_id: w.dealerId, user_id: "", action: "warranty_created", details: `Created warranty for ${w.customerName}` },
      });
      await loadAll();
      checkExpiringWarranties(w.dealerId);
    },

    async deleteWarranty(id: string) {
      const w = warranties.find(w => w.id === id);
      await dbCall({ table: "warranties", action: "delete", id });
      if (w) {
        await dbCall({
          table: "audit_log", action: "insert",
          updates: { dealer_id: w.dealerId, user_id: "", action: "warranty_deleted", details: `Deleted warranty for ${w.customerName}` },
        });
      }
      await loadAll();
    },

    async updateClaimStatus(claimId: string, status: Claim["status"], by: string) {
      const existing = claims.find(c => c.id === claimId);
      if (existing) {
        const newTimeline = [...existing.timeline, { date: new Date().toISOString().split("T")[0], action: `Claim ${status.replace("_", " ")}`, by }];
        await dbCall({ table: "claims", action: "update", id: claimId, updates: { status, timeline: newTimeline } });
        await loadAll();
      }
    },

    async addClaim(claim: Claim) {
      await dbCall({
        table: "claims", action: "insert",
        updates: {
          reference: `CLM-${Date.now()}`,
          warranty_id: claim.warrantyId || null,
          customer_id: claim.customerId,
          customer_name: claim.customerName,
          customer_email: "",
          dealer_id: claim.dealerId,
          dealer_name: "",
          vehicle_reg: claim.vehicleReg,
          vehicle_make: "",
          vehicle_model: "",
          issue_title: claim.description?.substring(0, 50) || "Claim",
          description: claim.description,
          status: claim.status || "submitted",
          timeline: claim.timeline || [],
        },
      });
      await loadAll();
    },

    async updateRequestStatus(requestId: string, status: CustomerRequest["status"]) {
      await dbCall({ table: "customer_requests", action: "update", id: requestId, updates: { status } });
      await loadAll();
    },

    async addRequest(req: CustomerRequest) {
      await dbCall({
        table: "customer_requests", action: "insert",
        updates: {
          customer_id: req.customerId,
          customer_name: req.customerName,
          customer_email: "",
          dealer_id: req.dealerId,
          type: req.type,
          description: req.description,
          status: req.status || "pending",
          warranty_id: req.warrantyId || null,
        },
      });
      await loadAll();
    },

    getDealerWarrantyCount(dealerId: string): number {
      return warranties.filter(w => w.dealerId === dealerId).length;
    },
  };
}
