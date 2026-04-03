import { useState, useEffect } from "react";
import { pushNotification } from "@/lib/notification-store";
import {
  EnhancedClaim, ClaimStatus, ClaimDecision, ClaimChecklistItem, ClaimMessage,
  ClaimFile, ClaimTimelineEntry, demoEnhancedClaims, defaultChecklist,
  type TriageOutcome, type ClaimPriority, type VehicleDrivable,
} from "@/data/claim-data";

let claims = [...demoEnhancedClaims];
let listeners: (() => void)[] = [];
let refCounter = 6;

function notify() { listeners.forEach(l => l()); }

function generateRef() {
  return `CLM-2025-${String(refCounter++).padStart(3, "0")}`;
}

function generatePhone() {
  return `0330 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`;
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
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  return {
    claims,

    getClaim(id: string) {
      return claims.find(c => c.id === id);
    },

    getClaimsForCustomer(customerId: string) {
      return claims.filter(c => c.customerId === customerId);
    },

    getClaimsForDealer(dealerId: string) {
      return claims.filter(c => c.dealerId === dealerId);
    },

    submitClaim(data: {
      warrantyId: string; customerId: string; customerName: string; dealerId: string; dealerName: string;
      vehicleReg: string; vehicleMake: string; vehicleModel: string;
      issueTitle: string; description: string; issueStartDate: string; currentMileage: number;
      vehicleDrivable: VehicleDrivable; atGarage: boolean; garageName?: string; garageContact?: string;
      repairsAuthorised: boolean; files: ClaimFile[]; coverTemplateId?: string;
    }) {
      const triage = triageClaim(data);
      const newClaim: EnhancedClaim = {
        id: `ecl-${Date.now()}`,
        reference: generateRef(),
        ...data,
        status: "submitted",
        priority: triage.priority,
        triageOutcome: triage.outcome,
        messages: [],
        timeline: [{ date: new Date().toISOString().split("T")[0], action: "Claim submitted", by: data.customerName }],
        checklist: [...defaultChecklist],
        createdAt: new Date().toISOString().split("T")[0],
      };
      claims = [newClaim, ...claims];
      // Push notification to the dealer
      pushNotification(data.dealerId, {
        type: "claim",
        title: "New Claim Submitted",
        message: `${data.customerName} submitted a claim for ${data.vehicleReg} – ${data.issueTitle}`,
        link: "/dealer/claim-assist",
      });
      notify();
      return newClaim;
    },

    updateStatus(claimId: string, status: ClaimStatus, by: string) {
      claims = claims.map(c => {
        if (c.id === claimId) {
          return {
            ...c, status,
            timeline: [...c.timeline, { date: new Date().toISOString().split("T")[0], action: `Status changed to ${status.replace(/_/g, " ")}`, by }],
          };
        }
        return c;
      });
      notify();
    },

    addMessage(claimId: string, msg: Omit<ClaimMessage, "id">) {
      claims = claims.map(c => {
        if (c.id === claimId) {
          const newMsg = { ...msg, id: `m-${Date.now()}` };
          return {
            ...c,
            messages: [...c.messages, newMsg],
            timeline: msg.internal
              ? c.timeline
              : [...c.timeline, { date: new Date().toISOString().split("T")[0], action: `Message from ${msg.from}`, by: msg.from }],
          };
        }
        return c;
      });
      notify();
    },

    updateChecklist(claimId: string, checklist: ClaimChecklistItem[]) {
      claims = claims.map(c => c.id === claimId ? { ...c, checklist } : c);
      notify();
    },

    addFile(claimId: string, file: ClaimFile) {
      claims = claims.map(c => {
        if (c.id === claimId) {
          return {
            ...c,
            files: [...c.files, file],
            timeline: [...c.timeline, { date: new Date().toISOString().split("T")[0], action: `File uploaded: ${file.name}`, by: "System" }],
          };
        }
        return c;
      });
      notify();
    },

    makeDecision(claimId: string, decision: ClaimDecision) {
      const statusMap: Record<string, ClaimStatus> = {
        approved: "approved",
        partially_approved: "partially_approved",
        rejected: "rejected",
        info_requested: "awaiting_info",
        escalated: "under_assessment",
      };
      claims = claims.map(c => {
        if (c.id === claimId) {
          return {
            ...c,
            decision,
            status: statusMap[decision.type] || c.status,
            timeline: [...c.timeline, { date: new Date().toISOString().split("T")[0], action: `Decision: ${decision.type.replace(/_/g, " ")}`, by: decision.by }],
          };
        }
        return c;
      });
      notify();
    },

    assignClaim(claimId: string, assignedTo: string) {
      claims = claims.map(c => c.id === claimId ? { ...c, assignedTo } : c);
      notify();
    },
  };
}
