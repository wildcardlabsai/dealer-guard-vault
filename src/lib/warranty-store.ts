import { useState, useEffect, useCallback } from "react";
import { Warranty, Claim, CustomerRequest, demoWarranties, demoClaims, demoRequests, demoAuditLog, AuditLog } from "@/data/demo-data";
import { pushNotification } from "@/lib/notification-store";

let warranties = [...demoWarranties];
let claims = [...demoClaims];
let requests = [...demoRequests];
let auditLog = [...demoAuditLog];
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

// Run expiry check once per dealer on first access
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
      warranties = [w, ...warranties];
      auditLog = [{ id: `al-${Date.now()}`, dealerId: w.dealerId, userId: "", action: "warranty_created", details: `Created warranty for ${w.customerName}`, timestamp: new Date().toISOString() }, ...auditLog];
      // Check all warranties for upcoming expiries and notify
      checkExpiringWarranties(w.dealerId);
      notify();
    },

    deleteWarranty(id: string) {
      const w = warranties.find(w => w.id === id);
      warranties = warranties.filter(w => w.id !== id);
      if (w) {
        auditLog = [{ id: `al-${Date.now()}`, dealerId: w.dealerId, userId: "", action: "warranty_deleted", details: `Deleted warranty for ${w.customerName}`, timestamp: new Date().toISOString() }, ...auditLog];
      }
      notify();
    },

    updateClaimStatus(claimId: string, status: Claim["status"], by: string) {
      claims = claims.map(c => {
        if (c.id === claimId) {
          return { ...c, status, timeline: [...c.timeline, { date: new Date().toISOString().split("T")[0], action: `Claim ${status.replace("_", " ")}`, by }] };
        }
        return c;
      });
      notify();
    },

    addClaim(claim: Claim) {
      claims = [claim, ...claims];
      notify();
    },

    updateRequestStatus(requestId: string, status: CustomerRequest["status"]) {
      requests = requests.map(r => r.id === requestId ? { ...r, status } : r);
      notify();
    },

    addRequest(req: CustomerRequest) {
      requests = [req, ...requests];
      notify();
    },
  };
}
