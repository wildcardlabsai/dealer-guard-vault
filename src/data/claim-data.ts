export type ClaimStatus =
  | "submitted"
  | "awaiting_review"
  | "awaiting_info"
  | "under_assessment"
  | "approved"
  | "partially_approved"
  | "rejected"
  | "closed";

export type ClaimPriority = "low" | "medium" | "high" | "urgent";

export type TriageOutcome =
  | "likely_covered"
  | "likely_excluded"
  | "more_info_needed"
  | "policy_check_needed"
  | "urgent"
  | "high_risk";

export type VehicleDrivable = "yes" | "limited" | "no";

export interface ClaimFile {
  id: string;
  name: string;
  type: "photo" | "invoice" | "diagnostic" | "service_history" | "other";
  url: string;
  uploadedAt: string;
}

export interface ClaimMessage {
  id: string;
  from: string;
  fromRole: "customer" | "dealer";
  message: string;
  timestamp: string;
  internal: boolean;
}

export interface ClaimTimelineEntry {
  date: string;
  action: string;
  by: string;
}

export interface ClaimChecklistItem {
  label: string;
  value: "yes" | "no" | "unknown";
  note?: string;
}

export interface ClaimDecision {
  type: "approved" | "partially_approved" | "rejected" | "info_requested" | "escalated";
  note: string;
  reason?: string;
  payoutAmount?: number;
  approvedItems?: string;
  rejectedItems?: string;
  timestamp: string;
  by: string;
}

export interface EnhancedClaim {
  id: string;
  reference: string;
  warrantyId: string;
  customerId: string;
  customerName: string;
  dealerId: string;
  dealerName: string;
  vehicleReg: string;
  vehicleMake: string;
  vehicleModel: string;
  issueTitle: string;
  description: string;
  issueStartDate: string;
  currentMileage: number;
  vehicleDrivable: VehicleDrivable;
  atGarage: boolean;
  garageName?: string;
  garageContact?: string;
  repairsAuthorised: boolean;
  status: ClaimStatus;
  priority: ClaimPriority;
  assignedTo?: string;
  triageOutcome?: TriageOutcome;
  files: ClaimFile[];
  messages: ClaimMessage[];
  timeline: ClaimTimelineEntry[];
  checklist: ClaimChecklistItem[];
  decision?: ClaimDecision;
  coverTemplateId?: string;
  createdAt: string;
}

export const claimStatusConfig: Record<ClaimStatus, { label: string; color: string }> = {
  submitted: { label: "Submitted", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  awaiting_review: { label: "Awaiting Review", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  awaiting_info: { label: "Awaiting Info", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  under_assessment: { label: "Under Assessment", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  approved: { label: "Approved", color: "bg-primary/10 text-primary border-primary/20" },
  partially_approved: { label: "Partially Approved", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  rejected: { label: "Rejected", color: "bg-destructive/10 text-destructive border-destructive/20" },
  closed: { label: "Closed", color: "bg-muted text-muted-foreground border-border" },
};

export const claimPriorityConfig: Record<ClaimPriority, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-muted text-muted-foreground border-border" },
  medium: { label: "Medium", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  high: { label: "High", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  urgent: { label: "Urgent", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

export const rejectionReasons = [
  "Outside warranty term",
  "Mileage issue",
  "Excluded item",
  "Insufficient evidence",
  "Wear and tear",
  "Service history issue",
  "Pre-existing condition",
  "Unauthorised repairs",
  "Other",
];

export const defaultChecklist: ClaimChecklistItem[] = [
  { label: "Warranty active at issue date?", value: "unknown" },
  { label: "Vehicle matches warranty?", value: "unknown" },
  { label: "Mileage within terms?", value: "unknown" },
  { label: "Issue appears potentially covered?", value: "unknown" },
  { label: "Service history provided?", value: "unknown" },
  { label: "Diagnostic evidence provided?", value: "unknown" },
  { label: "Any exclusions likely relevant?", value: "unknown" },
  { label: "More information required?", value: "unknown" },
  { label: "Safe to proceed?", value: "unknown" },
  { label: "Ready for decision?", value: "unknown" },
];

export const messageTemplates = [
  { label: "Claim received", text: "Thank you for submitting your claim. We have received your details and will review them shortly." },
  { label: "More information requested", text: "We need some additional information to progress your claim. Please provide the following:" },
  { label: "Under review", text: "Your claim is currently under assessment. We will update you as soon as a decision has been made." },
  { label: "Approved", text: "Good news — your claim has been approved. Please see below for details of the next steps." },
  { label: "Partially approved", text: "Your claim has been partially approved. Please see below for details of what has been approved and any items that were not covered." },
  { label: "Rejected", text: "Unfortunately, your claim has not been approved. Please see the reason below." },
];
