import { useState, useCallback } from "react";
import { Warranty, Claim, CustomerRequest, demoWarranties, demoClaims, demoRequests, demoAuditLog, AuditLog } from "@/data/demo-data";

// Simple global store for warranty platform state
let warranties = [...demoWarranties];
let claims = [...demoClaims];
let requests = [...demoRequests];
let auditLog = [...demoAuditLog];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach(l => l());
}

export function useWarrantyStore() {
  const [, setTick] = useState(0);

  const subscribe = useCallback(() => {
    const listener = () => setTick(t => t + 1);
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  // Subscribe on mount
  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  return {
    warranties,
    claims,
    requests,
    auditLog,

    addWarranty(w: Warranty) {
      warranties = [w, ...warranties];
      auditLog = [{ id: `al-${Date.now()}`, dealerId: w.dealerId, userId: "", action: "warranty_created", details: `Created warranty for ${w.customerName}`, timestamp: new Date().toISOString() }, ...auditLog];
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
          return {
            ...c,
            status,
            timeline: [...c.timeline, { date: new Date().toISOString().split("T")[0], action: `Claim ${status.replace("_", " ")}`, by }],
          };
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
