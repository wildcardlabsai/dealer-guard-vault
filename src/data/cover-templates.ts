export interface CoverItem {
  name: string;
  category: string;
  explanation: string;
  note?: string;
  keywords: string[];
}

export interface CoverFAQ {
  question: string;
  answer: string;
}

export interface CoverTemplate {
  id: string;
  dealerId: string;
  name: string;
  levelName: string;
  description: string;
  brochureIntro: string;
  certificateSummary: string;
  claimInstructions: string;
  coveredItems: CoverItem[];
  excludedItems: CoverItem[];
  conditionalItems: CoverItem[];
  faqs: CoverFAQ[];
  termsDocUrl?: string;
  labourRate?: number;
  maxClaimLimit?: number;
  suggestedPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export const coverCategories = [
  "Engine", "Gearbox", "Electrical", "Cooling System", "Fuel System",
  "Suspension", "Steering", "Braking", "Other"
];
