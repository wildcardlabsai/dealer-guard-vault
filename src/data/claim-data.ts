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

export const demoEnhancedClaims: EnhancedClaim[] = [
  {
    id: "ecl-1",
    reference: "CLM-2025-001",
    warrantyId: "w-1",
    customerId: "customer-1",
    customerName: "John Smith",
    dealerId: "d-1",
    dealerName: "Prestige Motors",
    vehicleReg: "AB12 CDE",
    vehicleMake: "BMW",
    vehicleModel: "320d M Sport",
    issueTitle: "Engine management light and rough idle",
    description: "Engine warning light came on last Tuesday. Vehicle has a rough idle at cold start and I noticed a loss of power when driving on the motorway. The issue seems to be getting worse.",
    issueStartDate: "2025-01-07",
    currentMileage: 34500,
    vehicleDrivable: "limited",
    atGarage: false,
    repairsAuthorised: false,
    status: "under_assessment",
    priority: "high",
    assignedTo: "James Harrison",
    triageOutcome: "likely_covered",
    coverTemplateId: "ct-2",
    files: [
      { id: "f-1", name: "dashboard-warning.jpg", type: "photo", url: "#", uploadedAt: "2025-01-10" },
      { id: "f-2", name: "diagnostic-report.pdf", type: "diagnostic", url: "#", uploadedAt: "2025-01-11" },
    ],
    messages: [
      { id: "m-1", from: "John Smith", fromRole: "customer", message: "I've attached a photo of the warning light and the diagnostic report from my local garage.", timestamp: "2025-01-10T10:30:00Z", internal: false },
      { id: "m-2", from: "James Harrison", fromRole: "dealer", message: "Thank you John, we've received your claim and diagnostic report. We're reviewing this now.", timestamp: "2025-01-11T09:15:00Z", internal: false },
      { id: "m-3", from: "James Harrison", fromRole: "dealer", message: "Diagnostic suggests injector issue. Checking cover template — this should be covered under standard.", timestamp: "2025-01-11T09:20:00Z", internal: true },
    ],
    timeline: [
      { date: "2025-01-10", action: "Claim submitted", by: "John Smith" },
      { date: "2025-01-10", action: "Photos and diagnostic report uploaded", by: "John Smith" },
      { date: "2025-01-11", action: "Claim received and under review", by: "James Harrison" },
      { date: "2025-01-12", action: "Moved to under assessment", by: "James Harrison" },
    ],
    checklist: [
      { label: "Warranty active at issue date?", value: "yes" },
      { label: "Vehicle matches warranty?", value: "yes" },
      { label: "Mileage within terms?", value: "yes" },
      { label: "Issue appears potentially covered?", value: "yes", note: "Fuel injector issue — covered under Standard" },
      { label: "Service history provided?", value: "no" },
      { label: "Diagnostic evidence provided?", value: "yes" },
      { label: "Any exclusions likely relevant?", value: "no" },
      { label: "More information required?", value: "unknown", note: "May need service history" },
      { label: "Safe to proceed?", value: "unknown" },
      { label: "Ready for decision?", value: "unknown" },
    ],
    createdAt: "2025-01-10",
  },
  {
    id: "ecl-2",
    reference: "CLM-2025-002",
    warrantyId: "w-2",
    customerId: "customer-2",
    customerName: "Emma Wilson",
    dealerId: "d-1",
    dealerName: "Prestige Motors",
    vehicleReg: "CD34 FGH",
    vehicleMake: "Audi",
    vehicleModel: "A4 S Line",
    issueTitle: "Gearbox grinding noise",
    description: "Grinding noise when shifting from 2nd to 3rd gear. Started about two weeks ago and is getting worse. No warning lights on dashboard.",
    issueStartDate: "2024-11-18",
    currentMileage: 47200,
    vehicleDrivable: "limited",
    atGarage: true,
    garageName: "Birmingham Audi Specialist",
    garageContact: "0121 555 1234",
    repairsAuthorised: false,
    status: "approved",
    priority: "high",
    assignedTo: "James Harrison",
    triageOutcome: "likely_covered",
    coverTemplateId: "ct-3",
    files: [
      { id: "f-3", name: "gearbox-noise-video.mp4", type: "other", url: "#", uploadedAt: "2024-12-01" },
      { id: "f-4", name: "repair-quote.pdf", type: "invoice", url: "#", uploadedAt: "2024-12-03" },
    ],
    messages: [
      { id: "m-4", from: "Emma Wilson", fromRole: "customer", message: "I've attached a video of the noise and a repair quote from the specialist.", timestamp: "2024-12-01T14:00:00Z", internal: false },
      { id: "m-5", from: "James Harrison", fromRole: "dealer", message: "Thank you Emma. We've reviewed the evidence and this is covered. Repair authorised — see decision details.", timestamp: "2024-12-05T09:00:00Z", internal: false },
    ],
    timeline: [
      { date: "2024-12-01", action: "Claim submitted", by: "Emma Wilson" },
      { date: "2024-12-01", action: "Evidence uploaded", by: "Emma Wilson" },
      { date: "2024-12-02", action: "Under review by dealer", by: "James Harrison" },
      { date: "2024-12-03", action: "Repair quote received", by: "Emma Wilson" },
      { date: "2024-12-05", action: "Claim approved — repair authorised", by: "James Harrison" },
    ],
    checklist: [
      { label: "Warranty active at issue date?", value: "yes" },
      { label: "Vehicle matches warranty?", value: "yes" },
      { label: "Mileage within terms?", value: "yes" },
      { label: "Issue appears potentially covered?", value: "yes" },
      { label: "Service history provided?", value: "yes" },
      { label: "Diagnostic evidence provided?", value: "yes" },
      { label: "Any exclusions likely relevant?", value: "no" },
      { label: "More information required?", value: "no" },
      { label: "Safe to proceed?", value: "yes" },
      { label: "Ready for decision?", value: "yes" },
    ],
    decision: {
      type: "approved",
      note: "Gearbox internals are covered under Premium warranty. Repair authorised at Birmingham Audi Specialist.",
      payoutAmount: 1200,
      timestamp: "2024-12-05T09:00:00Z",
      by: "James Harrison",
    },
    createdAt: "2024-12-01",
  },
  {
    id: "ecl-3",
    reference: "CLM-2025-003",
    warrantyId: "w-3",
    customerId: "customer-3",
    customerName: "David Brown",
    dealerId: "d-2",
    dealerName: "City Autos",
    vehicleReg: "EF56 IJK",
    vehicleMake: "Mercedes-Benz",
    vehicleModel: "C200 AMG Line",
    issueTitle: "Air conditioning not blowing cold",
    description: "Air conditioning stopped blowing cold air about a week ago. I can hear the compressor engaging but no cold air comes through the vents.",
    issueStartDate: "2025-02-14",
    currentMileage: 19500,
    vehicleDrivable: "yes",
    atGarage: false,
    repairsAuthorised: false,
    status: "awaiting_info",
    priority: "medium",
    triageOutcome: "more_info_needed",
    coverTemplateId: "ct-4",
    files: [],
    messages: [
      { id: "m-6", from: "David Brown", fromRole: "customer", message: "The AC just stopped working. No cold air at all.", timestamp: "2025-02-20T11:00:00Z", internal: false },
      { id: "m-7", from: "Sarah Mitchell", fromRole: "dealer", message: "Hi David, could you please get a diagnostic check done and send us the report? We need to identify whether this is a compressor issue or a refrigerant leak.", timestamp: "2025-02-21T10:00:00Z", internal: false },
    ],
    timeline: [
      { date: "2025-02-20", action: "Claim submitted", by: "David Brown" },
      { date: "2025-02-21", action: "More information requested", by: "Sarah Mitchell" },
    ],
    checklist: [
      { label: "Warranty active at issue date?", value: "yes" },
      { label: "Vehicle matches warranty?", value: "yes" },
      { label: "Mileage within terms?", value: "yes" },
      { label: "Issue appears potentially covered?", value: "unknown", note: "AC not in Standard cover for City Autos" },
      { label: "Service history provided?", value: "no" },
      { label: "Diagnostic evidence provided?", value: "no" },
      { label: "Any exclusions likely relevant?", value: "unknown" },
      { label: "More information required?", value: "yes" },
      { label: "Safe to proceed?", value: "no" },
      { label: "Ready for decision?", value: "no" },
    ],
    createdAt: "2025-02-20",
  },
  {
    id: "ecl-4",
    reference: "CLM-2025-004",
    warrantyId: "w-5",
    customerId: "customer-5",
    customerName: "Michael Taylor",
    dealerId: "d-2",
    dealerName: "City Autos",
    vehicleReg: "IJ90 OPQ",
    vehicleMake: "Ford",
    vehicleModel: "Focus ST",
    issueTitle: "Clutch slipping at high RPM",
    description: "Clutch has started slipping when accelerating hard in 3rd and 4th gear. Getting worse over the last month.",
    issueStartDate: "2024-11-01",
    currentMileage: 58200,
    vehicleDrivable: "limited",
    atGarage: false,
    repairsAuthorised: false,
    status: "rejected",
    priority: "medium",
    triageOutcome: "likely_excluded",
    coverTemplateId: "ct-4",
    files: [
      { id: "f-5", name: "clutch-assessment.pdf", type: "diagnostic", url: "#", uploadedAt: "2024-11-16" },
    ],
    messages: [
      { id: "m-8", from: "Michael Taylor", fromRole: "customer", message: "Clutch is slipping badly now, especially in higher gears.", timestamp: "2024-11-15T16:00:00Z", internal: false },
      { id: "m-9", from: "Sarah Mitchell", fromRole: "dealer", message: "Unfortunately the clutch is classified as a wear and tear item and is not covered under your warranty. See full details in the decision.", timestamp: "2024-11-18T16:45:00Z", internal: false },
    ],
    timeline: [
      { date: "2024-11-15", action: "Claim submitted", by: "Michael Taylor" },
      { date: "2024-11-16", action: "Diagnostic report uploaded", by: "Michael Taylor" },
      { date: "2024-11-16", action: "Under review", by: "Sarah Mitchell" },
      { date: "2024-11-18", action: "Claim rejected — wear and tear exclusion applies", by: "Sarah Mitchell" },
    ],
    checklist: [
      { label: "Warranty active at issue date?", value: "yes" },
      { label: "Vehicle matches warranty?", value: "yes" },
      { label: "Mileage within terms?", value: "yes" },
      { label: "Issue appears potentially covered?", value: "no", note: "Clutch is excluded — wear and tear" },
      { label: "Service history provided?", value: "no" },
      { label: "Diagnostic evidence provided?", value: "yes" },
      { label: "Any exclusions likely relevant?", value: "yes" },
      { label: "More information required?", value: "no" },
      { label: "Safe to proceed?", value: "yes" },
      { label: "Ready for decision?", value: "yes" },
    ],
    decision: {
      type: "rejected",
      note: "The clutch friction plate is classified as a wear and tear item and is excluded from all cover levels.",
      reason: "Wear and tear",
      timestamp: "2024-11-18T16:45:00Z",
      by: "Sarah Mitchell",
    },
    createdAt: "2024-11-15",
  },
  {
    id: "ecl-5",
    reference: "CLM-2025-005",
    warrantyId: "w-6",
    customerId: "customer-1",
    customerName: "John Smith",
    dealerId: "d-1",
    dealerName: "Prestige Motors",
    vehicleReg: "KL12 RST",
    vehicleMake: "Toyota",
    vehicleModel: "Yaris Hybrid",
    issueTitle: "Coolant leak and overheating warning",
    description: "Noticed coolant level dropping and overheating warning appeared twice on short journeys. Possible water pump or thermostat issue.",
    issueStartDate: "2025-03-25",
    currentMileage: 9200,
    vehicleDrivable: "no",
    atGarage: true,
    garageName: "Toyota Birmingham",
    garageContact: "0121 444 5678",
    repairsAuthorised: false,
    status: "submitted",
    priority: "urgent",
    triageOutcome: "urgent",
    coverTemplateId: "ct-3",
    files: [
      { id: "f-6", name: "overheating-warning.jpg", type: "photo", url: "#", uploadedAt: "2025-03-28" },
    ],
    messages: [
      { id: "m-10", from: "John Smith", fromRole: "customer", message: "Car overheated twice and is now at Toyota Birmingham. Not drivable. Please review urgently.", timestamp: "2025-03-28T08:00:00Z", internal: false },
    ],
    timeline: [
      { date: "2025-03-28", action: "Claim submitted — marked urgent", by: "John Smith" },
      { date: "2025-03-28", action: "Photo uploaded", by: "John Smith" },
    ],
    checklist: [
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
    ],
    createdAt: "2025-03-28",
  },
];
