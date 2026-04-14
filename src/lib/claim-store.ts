import { useState, useEffect } from "react";
import { pushNotification } from "@/lib/notification-store";
import { supabase } from "@/integrations/supabase/client";
import {
  EnhancedClaim, ClaimStatus, ClaimDecision, ClaimChecklistItem, ClaimMessage,
  ClaimFile, ClaimTimelineEntry, defaultChecklist,
  type TriageOutcome, type ClaimPriority, type VehicleDrivable,
} from "@/data/claim-data";

// --- DB helpers ---
async function dbCall(body: Record<string, unknown>) {
  try {
    const { data } = await supabase.functions.invoke("admin-data", { body });
    return data?.data || null;
  } catch (err) {
    console.error("Claim DB call failed:", err);
    return null;
  }
}

function rowToEnhancedClaim(r: any): EnhancedClaim {
  return {
    id: r.id,
    reference: r.reference,
    warrantyId: r.warranty_id || "",
    customerId: r.customer_id,
    customerName: r.customer_name,
    dealerId: r.dealer_id,
    dealerName: r.dealer_name,
    vehicleReg: r.vehicle_reg,
    vehicleMake: r.vehicle_make,
    vehicleModel: r.vehicle_model,
    issueTitle: r.issue_title,
    description: r.description || "",
    issueStartDate: r.issue_start_date || "",
    currentMileage: r.current_mileage || 0,
    vehicleDrivable: (r.vehicle_drivable as VehicleDrivable) || "yes",
    atGarage: r.at_garage || false,
    garageName: r.garage_name || undefined,
    garageContact: r.garage_contact || undefined,
    repairsAuthorised: r.repairs_authorised || false,
    status: r.status as ClaimStatus,
    priority: (r.priority as ClaimPriority) || "medium",
    assignedTo: r.assigned_to || undefined,
    triageOutcome: r.triage_outcome as TriageOutcome || undefined,
    files: Array.isArray(r.files) ? r.files : [],
    messages: Array.isArray(r.messages) ? r.messages : [],
    timeline: Array.isArray(r.timeline) ? r.timeline : [],
    checklist: Array.isArray(r.checklist) ? r.checklist : [...defaultChecklist],
    decision: r.decision_type ? {
      type: r.decision_type,
      note: r.decision_reason || "",
      payoutAmount: r.decision_amount ? parseFloat(r.decision_amount) : undefined,
      timestamp: r.decision_date || "",
      by: r.decision_by || "",
    } : undefined,
    coverTemplateId: r.cover_template_id || undefined,
    createdAt: r.created_at?.split("T")[0] || r.created_at,
  };
}

// --- Global state ---
let claims: EnhancedClaim[] = [];
let listeners: (() => void)[] = [];
let loaded = false;
let refCounter = 100;

function notify() { listeners.forEach(l => l()); }

function generateRef() {
  return `CLM-2025-${String(refCounter++).padStart(3, "0")}`;
}

async function loadClaims() {
  const rows = await dbCall({ table: "claims", action: "select" });
  if (rows) {
    claims = rows.map(rowToEnhancedClaim);
    loaded = true;
    notify();
  }
}

export function triageClaim(claim: Partial<EnhancedClaim>, excludedKeywords?: string[]): { outcome: TriageOutcome; priority: ClaimPriority; suggestion: string } {
  const desc = (claim.description || "").toLowerCase() + " " + (claim.issueTitle || "").toLowerCase();
  if (claim.vehicleDrivable === "no") {
    return { outcome: "urgent", priority: "urgent", suggestion: "Vehicle not drivable — review urgently" };
  }
  const highRiskTerms = ["engine failure", "gearbox", "overheating", "seized", "smoke", "fire", "total loss"];
  if (highRiskTerms.some(t => desc.includes(t))) {
    return { outcome: "high_risk", priority: "high", suggestion: "High-risk issue reported — review promptly" };
  }
  if (!claim.files || claim.files.length === 0) {
    return { outcome: "more_info_needed", priority: "medium", suggestion: "No evidence uploaded — request diagnostics" };
  }
  if (excludedKeywords && excludedKeywords.some(k => desc.includes(k.toLowerCase()))) {
    return { outcome: "likely_excluded", priority: "medium", suggestion: "Reported issue may match an exclusion — check cover template" };
  }
  return { outcome: "likely_covered", priority: "medium", suggestion: "Initial assessment — likely covered, proceed with review" };
}

export function useClaimStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.push(listener);
    if (!loaded) loadClaims();
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  return {
    claims,

    getClaim(id: string) { return claims.find(c => c.id === id); },
    getClaimsForCustomer(customerId: string) { return claims.filter(c => c.customerId === customerId); },
    getClaimsForDealer(dealerId: string) { return claims.filter(c => c.dealerId === dealerId); },

    async submitClaim(data: {
      warrantyId: string; customerId: string; customerName: string; dealerId: string; dealerName: string;
      vehicleReg: string; vehicleMake: string; vehicleModel: string;
      issueTitle: string; description: string; issueStartDate: string; currentMileage: number;
      vehicleDrivable: VehicleDrivable; atGarage: boolean; garageName?: string; garageContact?: string;
      repairsAuthorised: boolean; files: ClaimFile[]; coverTemplateId?: string;
    }) {
      const triage = triageClaim(data);
      const ref = generateRef();
      const timeline = [{ date: new Date().toISOString().split("T")[0], action: "Claim submitted", by: data.customerName }];
      const row = await dbCall({
        table: "claims", action: "insert",
        updates: {
          reference: ref,
          warranty_id: data.warrantyId || null,
          customer_id: data.customerId,
          customer_name: data.customerName,
          customer_email: "",
          dealer_id: data.dealerId,
          dealer_name: data.dealerName,
          vehicle_reg: data.vehicleReg,
          vehicle_make: data.vehicleMake,
          vehicle_model: data.vehicleModel,
          issue_title: data.issueTitle,
          description: data.description,
          issue_start_date: data.issueStartDate || null,
          current_mileage: data.currentMileage,
          vehicle_drivable: data.vehicleDrivable,
          at_garage: data.atGarage,
          garage_name: data.garageName || null,
          garage_contact: data.garageContact || null,
          repairs_authorised: data.repairsAuthorised,
          status: "submitted",
          priority: triage.priority,
          triage_outcome: triage.outcome,
          files: data.files,
          messages: [],
          timeline,
          checklist: [...defaultChecklist],
          cover_template_id: data.coverTemplateId || null,
        },
      });
      pushNotification(data.dealerId, {
        type: "claim",
        title: "New Claim Submitted",
        message: `${data.customerName} submitted a claim for ${data.vehicleReg} – ${data.issueTitle}`,
        link: "/dealer/claim-assist",
      });
      await loadClaims();
      return row ? rowToEnhancedClaim(row) : { ...data, id: `ecl-${Date.now()}`, reference: ref, status: "submitted" as ClaimStatus, priority: triage.priority, triageOutcome: triage.outcome, messages: [], timeline, checklist: [...defaultChecklist], files: data.files, createdAt: new Date().toISOString().split("T")[0] };
    },

    async updateStatus(claimId: string, status: ClaimStatus, by: string) {
      const existing = claims.find(c => c.id === claimId);
      if (!existing) return;
      const newTimeline = [...existing.timeline, { date: new Date().toISOString().split("T")[0], action: `Status changed to ${status.replace(/_/g, " ")}`, by }];
      await dbCall({ table: "claims", action: "update", id: claimId, updates: { status, timeline: newTimeline } });
      pushNotification(existing.customerId, {
        type: "claim", title: "Claim Status Updated",
        message: `Your claim for ${existing.vehicleReg} is now "${status.replace(/_/g, " ")}"`,
        link: "/customer/claims",
      });
      await loadClaims();
    },

    async addMessage(claimId: string, msg: Omit<ClaimMessage, "id">) {
      const existing = claims.find(c => c.id === claimId);
      if (!existing) return;
      const newMsg = { ...msg, id: `m-${Date.now()}` };
      const newMessages = [...existing.messages, newMsg];
      const newTimeline = msg.internal ? existing.timeline : [...existing.timeline, { date: new Date().toISOString().split("T")[0], action: `Message from ${msg.from}`, by: msg.from }];
      await dbCall({ table: "claims", action: "update", id: claimId, updates: { messages: newMessages, timeline: newTimeline } });
      await loadClaims();
    },

    async updateChecklist(claimId: string, checklist: ClaimChecklistItem[]) {
      await dbCall({ table: "claims", action: "update", id: claimId, updates: { checklist } });
      await loadClaims();
    },

    async addFile(claimId: string, file: ClaimFile) {
      const existing = claims.find(c => c.id === claimId);
      if (!existing) return;
      const newFiles = [...existing.files, file];
      const newTimeline = [...existing.timeline, { date: new Date().toISOString().split("T")[0], action: `File uploaded: ${file.name}`, by: "System" }];
      await dbCall({ table: "claims", action: "update", id: claimId, updates: { files: newFiles, timeline: newTimeline } });
      await loadClaims();
    },

    async makeDecision(claimId: string, decision: ClaimDecision) {
      const statusMap: Record<string, ClaimStatus> = {
        approved: "approved", partially_approved: "partially_approved",
        rejected: "rejected", info_requested: "awaiting_info", escalated: "under_assessment",
      };
      const existing = claims.find(c => c.id === claimId);
      if (!existing) return;
      const newTimeline = [...existing.timeline, { date: new Date().toISOString().split("T")[0], action: `Decision: ${decision.type.replace(/_/g, " ")}`, by: decision.by }];
      await dbCall({
        table: "claims", action: "update", id: claimId,
        updates: {
          status: statusMap[decision.type] || existing.status,
          timeline: newTimeline,
          decision_type: decision.type,
          decision_amount: decision.payoutAmount || null,
          decision_reason: decision.note,
          decision_by: decision.by,
          decision_date: decision.timestamp,
        },
      });
      await loadClaims();
    },

    async assignClaim(claimId: string, assignedTo: string) {
      await dbCall({ table: "claims", action: "update", id: claimId, updates: { assigned_to: assignedTo } });
      await loadClaims();
    },
  };
}
