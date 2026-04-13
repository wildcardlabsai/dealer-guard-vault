import { useState, useEffect } from "react";

export type ComplaintType = "mechanical" | "cosmetic" | "misdescription" | "finance" | "service" | "other";
export type RiskLevel = "low" | "medium" | "high";
export type CaseStatus = "draft" | "assessed" | "responded" | "closed";

export interface DisputeCase {
  id: string;
  dealerId: string;
  createdAt: string;
  updatedAt: string;
  status: CaseStatus;

  // Step 1
  complaintType: ComplaintType;

  // Step 2
  saleDate: string;
  issueDate: string;
  mileageAtSale: number;
  mileageNow: number;
  drivable: "yes" | "no" | "limited";
  repairsAuthorised: "yes" | "no" | "partial";
  warrantyStatus: "active" | "expired" | "none";
  customerSummary: string;
  customerName: string;
  vehicleReg: string;

  // Step 3
  issueClassification: string;

  // CRA
  craWindow: "under30" | "30to6m" | "over6m";
  craExplanation: string;

  // AI outputs
  aiSummary?: string;
  aiPosition?: string;
  aiRiskLevel?: RiskLevel;
  aiApproach?: string;
  aiToneRecommendation?: string;
  riskAlerts?: string[];
  escalationFlags?: string[];

  // Responses
  responses?: {
    helpful?: string;
    firm?: string;
    defensive?: string;
    deescalation?: string;
  };
  responseScore?: { clarity: number; risk: number; tone: number };
  selectedResponse?: string;
  editedResponse?: string;

  // Strategy
  strategyDoNots?: string[];
  strategyKeyRisks?: string[];
  strategySuggestedStance?: string;

  // Notes
  notes?: string;
  outcome?: string;

  // Linked claim
  linkedClaimId?: string;
}

let cases: DisputeCase[] = [];
let listeners: (() => void)[] = [];
const notify = () => listeners.forEach(l => l());

function genId() {
  return "diq-" + Math.random().toString(36).slice(2, 9);
}

export function classifyCRA(saleDate: string, issueDate: string): { window: "under30" | "30to6m" | "over6m"; explanation: string } {
  const sale = new Date(saleDate);
  const issue = new Date(issueDate);
  const diffDays = Math.floor((issue.getTime() - sale.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 30) {
    return {
      window: "under30",
      explanation: `The issue was reported ${diffDays} day${diffDays !== 1 ? "s" : ""} after sale. Under the Consumer Rights Act 2015, the customer has a short-term right to reject within 30 days if the vehicle is of unsatisfactory quality. This is the strongest consumer protection window.`,
    };
  }
  if (diffDays <= 180) {
    return {
      window: "30to6m",
      explanation: `The issue was reported ${diffDays} days after sale (within 6 months). During this period, faults are presumed to have been present at the point of sale unless the dealer can prove otherwise. The burden of proof is on the dealer.`,
    };
  }
  return {
    window: "over6m",
    explanation: `The issue was reported ${diffDays} days after sale (over 6 months). The burden of proof shifts to the customer — they must demonstrate the fault was present or developing at the point of sale. The dealer's position is generally stronger.`,
  };
}

export function detectEscalationFlags(text: string): string[] {
  const flags: string[] = [];
  const lower = text.toLowerCase();
  const checks = [
    { keywords: ["finance company", "finance provider", "hire purchase"], flag: "Finance company involvement detected" },
    { keywords: ["ombudsman", "motor ombudsman"], flag: "Ombudsman reference detected" },
    { keywords: ["legal action", "solicitor", "lawyer", "court", "small claims"], flag: "Legal action threat detected" },
    { keywords: ["trading standards"], flag: "Trading Standards reference detected" },
    { keywords: ["chargeback", "charge back", "section 75"], flag: "Chargeback/Section 75 risk detected" },
    { keywords: ["social media", "review", "facebook", "google review"], flag: "Public reputation threat detected" },
    { keywords: ["refund", "full refund", "money back"], flag: "Refund demand detected" },
    { keywords: ["reject", "rejection", "right to reject"], flag: "Vehicle rejection attempt detected" },
  ];
  for (const c of checks) {
    if (c.keywords.some(k => lower.includes(k))) flags.push(c.flag);
  }
  return flags;
}

export function useDisputeIQStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  return {
    cases,
    getCasesForDealer(dealerId: string) {
      return cases.filter(c => c.dealerId === dealerId);
    },
    getCase(id: string) {
      return cases.find(c => c.id === id);
    },
    createCase(data: Omit<DisputeCase, "id" | "createdAt" | "updatedAt" | "status" | "craWindow" | "craExplanation">): DisputeCase {
      const cra = classifyCRA(data.saleDate, data.issueDate);
      const escalationFlags = detectEscalationFlags(data.customerSummary);
      const newCase: DisputeCase = {
        ...data,
        id: genId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "draft",
        craWindow: cra.window,
        craExplanation: cra.explanation,
        escalationFlags,
      };
      cases = [newCase, ...cases];
      notify();
      return newCase;
    },
    updateCase(id: string, updates: Partial<DisputeCase>) {
      cases = cases.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c);
      notify();
    },
    deleteCase(id: string) {
      cases = cases.filter(c => c.id !== id);
      notify();
    },
  };
}
