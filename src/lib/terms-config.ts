// Centralized terms versioning for WarrantyVault.
// When dealer terms change, bump CURRENT_DASHBOARD_TERMS_VERSION to force re-acceptance.
export const CURRENT_SIGNUP_TERMS_VERSION = "v1.0";
export const CURRENT_DASHBOARD_TERMS_VERSION = "v1.0";

export const DEALER_AGREEMENT_SUMMARY = [
  "You are responsible for all warranties created through the platform",
  "You operate a self-funded warranty model",
  "WarrantyVault is not a warranty provider or insurer",
  "You remain responsible for all claims, customer outcomes, and legal compliance",
  "Warranties do not replace a customer's statutory rights",
  "You agree to comply with the Consumer Rights Act 2015 and other applicable UK laws",
] as const;
