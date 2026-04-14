import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ComplaintType = "mechanical" | "cosmetic" | "misdescription" | "finance" | "service" | "other";
export type RiskLevel = "low" | "medium" | "high";
export type CaseStatus = "draft" | "assessed" | "responded" | "closed";

export interface DisputeCase {
  id: string;
  dealerId: string;
  createdAt: string;
  updatedAt: string;
  status: CaseStatus;
  complaintType: ComplaintType;
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
  issueClassification: string;
  craWindow: "under30" | "30to6m" | "over6m";
  craExplanation: string;
  aiSummary?: string;
  aiPosition?: string;
  aiRiskLevel?: RiskLevel;
  aiApproach?: string;
  aiToneRecommendation?: string;
  riskAlerts?: string[];
  escalationFlags?: string[];
  responses?: { helpful?: string; firm?: string; defensive?: string; deescalation?: string };
  responseScore?: { clarity: number; risk: number; tone: number };
  selectedResponse?: string;
  editedResponse?: string;
  strategyDoNots?: string[];
  strategyKeyRisks?: string[];
  strategySuggestedStance?: string;
  notes?: string;
  outcome?: string;
  linkedClaimId?: string;
}

async function dbCall(body: Record<string, unknown>) {
  try {
    const { data } = await supabase.functions.invoke("admin-data", { body });
    return data?.data || null;
  } catch (err) {
    console.error("DisputeIQ DB call failed:", err);
    return null;
  }
}

function rowToCase(r: any): DisputeCase {
  return {
    id: r.id,
    dealerId: r.dealer_id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    status: r.status,
    complaintType: r.complaint_type,
    saleDate: r.sale_date,
    issueDate: r.issue_date,
    mileageAtSale: r.mileage_at_sale,
    mileageNow: r.mileage_now,
    drivable: r.drivable,
    repairsAuthorised: r.repairs_authorised,
    warrantyStatus: r.warranty_status,
    customerSummary: r.customer_summary,
    customerName: r.customer_name,
    vehicleReg: r.vehicle_reg,
    issueClassification: r.issue_classification || "",
    craWindow: r.cra_window || "over6m",
    craExplanation: r.cra_explanation || "",
    aiSummary: r.ai_summary || undefined,
    aiPosition: r.ai_position || undefined,
    aiRiskLevel: r.ai_risk_level || undefined,
    aiApproach: r.ai_approach || undefined,
    aiToneRecommendation: r.ai_tone_recommendation || undefined,
    riskAlerts: Array.isArray(r.risk_alerts) ? r.risk_alerts : [],
    escalationFlags: Array.isArray(r.escalation_flags) ? r.escalation_flags : [],
    responses: r.responses || undefined,
    responseScore: r.response_score || undefined,
    selectedResponse: r.selected_response || undefined,
    editedResponse: r.edited_response || undefined,
    strategyDoNots: Array.isArray(r.strategy_do_nots) ? r.strategy_do_nots : [],
    strategyKeyRisks: Array.isArray(r.strategy_key_risks) ? r.strategy_key_risks : [],
    strategySuggestedStance: r.strategy_suggested_stance || undefined,
    notes: r.notes || undefined,
    outcome: r.outcome || undefined,
    linkedClaimId: r.linked_claim_id || undefined,
  };
}

let cases: DisputeCase[] = [];
let listeners: (() => void)[] = [];
let loaded = false;
const notify = () => listeners.forEach(l => l());

async function loadCases() {
  const rows = await dbCall({ table: "dispute_cases", action: "select" });
  if (rows) {
    cases = rows.map(rowToCase);
    loaded = true;
    notify();
  }
}

export function classifyCRA(saleDate: string, issueDate: string): { window: "under30" | "30to6m" | "over6m"; explanation: string } {
  const sale = new Date(saleDate);
  const issue = new Date(issueDate);
  const diffDays = Math.floor((issue.getTime() - sale.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 30) {
    return { window: "under30", explanation: `The issue was reported ${diffDays} day${diffDays !== 1 ? "s" : ""} after sale. Under the Consumer Rights Act 2015, the customer has a short-term right to reject within 30 days.` };
  }
  if (diffDays <= 180) {
    return { window: "30to6m", explanation: `The issue was reported ${diffDays} days after sale (within 6 months). Faults are presumed present at sale unless the dealer can prove otherwise.` };
  }
  return { window: "over6m", explanation: `The issue was reported ${diffDays} days after sale (over 6 months). The burden of proof shifts to the customer.` };
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
    if (!loaded) loadCases();
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  return {
    cases,
    getCasesForDealer(dealerId: string) { return cases.filter(c => c.dealerId === dealerId); },
    getCase(id: string) { return cases.find(c => c.id === id); },

    async createCase(data: Omit<DisputeCase, "id" | "createdAt" | "updatedAt" | "status" | "craWindow" | "craExplanation">): Promise<DisputeCase> {
      const cra = classifyCRA(data.saleDate, data.issueDate);
      const escalationFlags = detectEscalationFlags(data.customerSummary);
      const row = await dbCall({
        table: "dispute_cases", action: "insert",
        updates: {
          dealer_id: data.dealerId,
          status: "draft",
          complaint_type: data.complaintType,
          sale_date: data.saleDate,
          issue_date: data.issueDate,
          mileage_at_sale: data.mileageAtSale,
          mileage_now: data.mileageNow,
          drivable: data.drivable,
          repairs_authorised: data.repairsAuthorised,
          warranty_status: data.warrantyStatus,
          customer_summary: data.customerSummary,
          customer_name: data.customerName,
          vehicle_reg: data.vehicleReg,
          issue_classification: data.issueClassification || "",
          cra_window: cra.window,
          cra_explanation: cra.explanation,
          escalation_flags: escalationFlags,
          linked_claim_id: data.linkedClaimId || null,
        },
      });
      await loadCases();
      if (row) return rowToCase(row);
      return { ...data, id: `diq-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: "draft", craWindow: cra.window, craExplanation: cra.explanation, escalationFlags } as DisputeCase;
    },

    async updateCase(id: string, updates: Partial<DisputeCase>) {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.aiSummary !== undefined) dbUpdates.ai_summary = updates.aiSummary;
      if (updates.aiPosition !== undefined) dbUpdates.ai_position = updates.aiPosition;
      if (updates.aiRiskLevel !== undefined) dbUpdates.ai_risk_level = updates.aiRiskLevel;
      if (updates.aiApproach !== undefined) dbUpdates.ai_approach = updates.aiApproach;
      if (updates.aiToneRecommendation !== undefined) dbUpdates.ai_tone_recommendation = updates.aiToneRecommendation;
      if (updates.riskAlerts !== undefined) dbUpdates.risk_alerts = updates.riskAlerts;
      if (updates.escalationFlags !== undefined) dbUpdates.escalation_flags = updates.escalationFlags;
      if (updates.responses !== undefined) dbUpdates.responses = updates.responses;
      if (updates.responseScore !== undefined) dbUpdates.response_score = updates.responseScore;
      if (updates.selectedResponse !== undefined) dbUpdates.selected_response = updates.selectedResponse;
      if (updates.editedResponse !== undefined) dbUpdates.edited_response = updates.editedResponse;
      if (updates.strategyDoNots !== undefined) dbUpdates.strategy_do_nots = updates.strategyDoNots;
      if (updates.strategyKeyRisks !== undefined) dbUpdates.strategy_key_risks = updates.strategyKeyRisks;
      if (updates.strategySuggestedStance !== undefined) dbUpdates.strategy_suggested_stance = updates.strategySuggestedStance;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.outcome !== undefined) dbUpdates.outcome = updates.outcome;
      if (Object.keys(dbUpdates).length > 0) {
        await dbCall({ table: "dispute_cases", action: "update", id, updates: dbUpdates });
      }
      await loadCases();
    },

    async deleteCase(id: string) {
      await dbCall({ table: "dispute_cases", action: "delete", id });
      await loadCases();
    },
  };
}
