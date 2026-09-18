import { useState, useEffect } from "react";

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

let signupRequests: SignupRequest[] = [
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

let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach(l => l());
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
      signupRequests = [req, ...signupRequests];
      notify();
    },

    approveRequest(id: string) {
      signupRequests = signupRequests.map(r =>
        r.id === id ? { ...r, status: "approved" as const, reviewedAt: new Date().toISOString() } : r
      );
      notify();
    },

    rejectRequest(id: string, reason?: string) {
      signupRequests = signupRequests.map(r =>
        r.id === id ? { ...r, status: "rejected" as const, reviewedAt: new Date().toISOString(), rejectionReason: reason } : r
      );
      notify();
    },
  };
}
