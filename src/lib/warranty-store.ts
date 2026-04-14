import { useState, useEffect, useCallback } from "react";
import { Warranty, Claim, CustomerRequest, demoWarranties, demoClaims, demoRequests, demoAuditLog, AuditLog } from "@/data/demo-data";
import { pushNotification } from "@/lib/notification-store";

// --- localStorage persistence helpers ---
const STORAGE_KEY = "wv_warranty_store";

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        addedWarranties: parsed.addedWarranties || [],
        addedClaims: parsed.addedClaims || [],
        addedRequests: parsed.addedRequests || [],
        addedAuditLog: parsed.addedAuditLog || [],
        deletedWarrantyIds: parsed.deletedWarrantyIds || [],
        claimStatusUpdates: parsed.claimStatusUpdates || {},
        requestStatusUpdates: parsed.requestStatusUpdates || {},
      };
    }
  } catch {}
  return {
    addedWarranties: [] as Warranty[],
    addedClaims: [] as Claim[],
    addedRequests: [] as CustomerRequest[],
    addedAuditLog: [] as AuditLog[],
    deletedWarrantyIds: [] as string[],
    claimStatusUpdates: {} as Record<string, { status: Claim["status"]; timeline: Claim["timeline"] }>,
    requestStatusUpdates: {} as Record<string, CustomerRequest["status"]>,
  };
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  } catch {}
}

let persisted = loadPersistedState();

// Merge demo + persisted data
function getMergedWarranties(): Warranty[] {
  const base = demoWarranties.filter(w => !persisted.deletedWarrantyIds.includes(w.id));
  return [...persisted.addedWarranties, ...base];
}

function getMergedClaims(): Claim[] {
  const base = demoClaims.map(c => {
    const update = persisted.claimStatusUpdates[c.id];
    if (update) return { ...c, status: update.status, timeline: update.timeline };
    return c;
  });
  return [...persisted.addedClaims, ...base];
}

function getMergedRequests(): CustomerRequest[] {
  const base = demoRequests.map(r => {
    const status = persisted.requestStatusUpdates[r.id];
    if (status) return { ...r, status };
    return r;
  });
  return [...persisted.addedRequests, ...base];
}

function getMergedAuditLog(): AuditLog[] {
  return [...persisted.addedAuditLog, ...demoAuditLog];
}

let warranties = getMergedWarranties();
let claims = getMergedClaims();
let requests = getMergedRequests();
let auditLog = getMergedAuditLog();
let listeners: (() => void)[] = [];
const notifiedExpiries = new Set<string>();

function notify() {
  listeners.forEach(l => l());
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
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  return {
    warranties,
    claims,
    requests,
    auditLog,
    ensureExpiryCheck,

    addWarranty(w: Warranty) {
      persisted.addedWarranties = [w, ...persisted.addedWarranties];
      persisted.addedAuditLog = [{ id: `al-${Date.now()}`, dealerId: w.dealerId, userId: "", action: "warranty_created", details: `Created warranty for ${w.customerName}`, timestamp: new Date().toISOString() }, ...persisted.addedAuditLog];
      persistState();
      // Rebuild merged data
      warranties = getMergedWarranties();
      auditLog = getMergedAuditLog();
      checkExpiringWarranties(w.dealerId);
      notify();
    },

    deleteWarranty(id: string) {
      const w = warranties.find(w => w.id === id);
      // If it's a persisted added warranty, remove from added list
      persisted.addedWarranties = persisted.addedWarranties.filter(aw => aw.id !== id);
      // If it's a demo warranty, add to deleted list
      if (demoWarranties.find(dw => dw.id === id)) {
        persisted.deletedWarrantyIds = [...persisted.deletedWarrantyIds, id];
      }
      if (w) {
        persisted.addedAuditLog = [{ id: `al-${Date.now()}`, dealerId: w.dealerId, userId: "", action: "warranty_deleted", details: `Deleted warranty for ${w.customerName}`, timestamp: new Date().toISOString() }, ...persisted.addedAuditLog];
      }
      persistState();
      warranties = getMergedWarranties();
      auditLog = getMergedAuditLog();
      notify();
    },

    updateClaimStatus(claimId: string, status: Claim["status"], by: string) {
      const existing = claims.find(c => c.id === claimId);
      if (existing) {
        const newTimeline = [...existing.timeline, { date: new Date().toISOString().split("T")[0], action: `Claim ${status.replace("_", " ")}`, by }];
        // Check if it's a demo claim or added claim
        const addedIdx = persisted.addedClaims.findIndex(c => c.id === claimId);
        if (addedIdx >= 0) {
          persisted.addedClaims[addedIdx] = { ...persisted.addedClaims[addedIdx], status, timeline: newTimeline };
        } else {
          persisted.claimStatusUpdates[claimId] = { status, timeline: newTimeline };
        }
        persistState();
        claims = getMergedClaims();
        notify();
      }
    },

    addClaim(claim: Claim) {
      persisted.addedClaims = [claim, ...persisted.addedClaims];
      persistState();
      claims = getMergedClaims();
      notify();
    },

    updateRequestStatus(requestId: string, status: CustomerRequest["status"]) {
      const addedIdx = persisted.addedRequests.findIndex(r => r.id === requestId);
      if (addedIdx >= 0) {
        persisted.addedRequests[addedIdx] = { ...persisted.addedRequests[addedIdx], status };
      } else {
        persisted.requestStatusUpdates[requestId] = status;
      }
      persistState();
      requests = getMergedRequests();
      notify();
    },

    addRequest(req: CustomerRequest) {
      persisted.addedRequests = [req, ...persisted.addedRequests];
      persistState();
      requests = getMergedRequests();
      notify();
    },

    // Get warranty count for a dealer (for free warranty tracking)
    getDealerWarrantyCount(dealerId: string): number {
      return warranties.filter(w => w.dealerId === dealerId).length;
    },
  };
}
