export type UserRole = "admin" | "dealer" | "customer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  dealerId?: string;
  avatar?: string;
}

export interface Dealer {
  id: string;
  name: string;
  email: string;
  phone: string;
  fcaNumber: string;
  logo?: string;
  address: string;
  city: string;
  postcode: string;
  createdAt: string;
  status: "active" | "suspended" | "trial";
  warrantyCount: number;
  monthlyFee: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  dealerId: string;
  createdAt: string;
}

export interface Warranty {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  dealerId: string;
  dealerName: string;
  vehicleReg: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleColour: string;
  mileage: number;
  duration: number; // months
  startDate: string;
  endDate: string;
  cost: number;
  status: "active" | "expired" | "cancelled";
  notes: string;
  createdAt: string;
  coverTemplateId?: string;
  paymentStatus?: "paid" | "pending";
}

export interface Claim {
  id: string;
  warrantyId: string;
  customerId: string;
  customerName: string;
  dealerId: string;
  vehicleReg: string;
  description: string;
  status: "pending" | "under_review" | "approved" | "rejected" | "info_requested";
  amount?: number;
  photos: string[];
  timeline: { date: string; action: string; by: string }[];
  createdAt: string;
}

export interface CustomerRequest {
  id: string;
  customerId: string;
  customerName: string;
  warrantyId: string;
  dealerId: string;
  type: "extension" | "cancellation" | "update";
  description: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface AuditLog {
  id: string;
  dealerId: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

// --- DEMO USERS ---
export const demoUsers: User[] = [
  { id: "admin-1", email: "admin@warrantyvault.com", name: "Platform Admin", role: "admin" },
  { id: "dealer-1", email: "dealer@prestige-motors.co.uk", name: "James Harrison", role: "dealer", dealerId: "d-1" },
  { id: "dealer-2", email: "dealer@cityautos.co.uk", name: "Sarah Mitchell", role: "dealer", dealerId: "d-2" },
  { id: "customer-1", email: "john@example.com", name: "John Smith", role: "customer", dealerId: "d-1" },
  { id: "customer-2", email: "emma@example.com", name: "Emma Wilson", role: "customer", dealerId: "d-1" },
  { id: "customer-3", email: "david@example.com", name: "David Brown", role: "customer", dealerId: "d-2" },
];

// --- DEMO DEALERS ---
export const demoDealers: Dealer[] = [
  {
    id: "d-1", name: "Prestige Motors", email: "info@prestige-motors.co.uk",
    phone: "0121 456 7890", fcaNumber: "FCA-123456", address: "45 Broad Street",
    city: "Birmingham", postcode: "B1 2HP", createdAt: "2024-01-15",
    status: "active", warrantyCount: 47, monthlyFee: 50,
  },
  {
    id: "d-2", name: "City Autos", email: "hello@cityautos.co.uk",
    phone: "0161 234 5678", fcaNumber: "FCA-789012", address: "12 Deansgate",
    city: "Manchester", postcode: "M3 2BY", createdAt: "2024-03-01",
    status: "active", warrantyCount: 23, monthlyFee: 50,
  },
  {
    id: "d-3", name: "Premier Cars Leeds", email: "sales@premierleeds.co.uk",
    phone: "0113 987 6543", fcaNumber: "FCA-345678", address: "8 The Headrow",
    city: "Leeds", postcode: "LS1 6PT", createdAt: "2024-06-10",
    status: "trial", warrantyCount: 5, monthlyFee: 50,
  },
];

// --- DEMO CUSTOMERS ---
export const demoCustomers: Customer[] = [
  { id: "customer-1", name: "John Smith", email: "john@example.com", phone: "07700 900001", address: "15 Oak Avenue", city: "Birmingham", postcode: "B15 2TT", dealerId: "d-1", createdAt: "2024-02-10" },
  { id: "customer-2", name: "Emma Wilson", email: "emma@example.com", phone: "07700 900002", address: "8 Elm Street", city: "Birmingham", postcode: "B16 8AA", dealerId: "d-1", createdAt: "2024-03-05" },
  { id: "customer-3", name: "David Brown", email: "david@example.com", phone: "07700 900003", address: "22 Maple Road", city: "Manchester", postcode: "M20 3BG", dealerId: "d-2", createdAt: "2024-04-12" },
  { id: "customer-4", name: "Sarah Jones", email: "sarah@example.com", phone: "07700 900004", address: "3 Pine Close", city: "Birmingham", postcode: "B17 0AB", dealerId: "d-1", createdAt: "2024-05-20" },
  { id: "customer-5", name: "Michael Taylor", email: "michael@example.com", phone: "07700 900005", address: "67 Cedar Lane", city: "Manchester", postcode: "M21 9PL", dealerId: "d-2", createdAt: "2024-06-15" },
];

// --- DEMO WARRANTIES ---
export const demoWarranties: Warranty[] = [
  { id: "w-1", customerId: "customer-1", customerName: "John Smith", customerEmail: "john@example.com", dealerId: "d-1", dealerName: "Prestige Motors", vehicleReg: "AB12 CDE", vehicleMake: "BMW", vehicleModel: "320d M Sport", vehicleYear: 2021, vehicleColour: "Black", mileage: 32000, duration: 12, startDate: "2024-06-01", endDate: "2025-06-01", cost: 599, status: "active", notes: "Premium cover", createdAt: "2024-06-01" },
  { id: "w-2", customerId: "customer-2", customerName: "Emma Wilson", customerEmail: "emma@example.com", dealerId: "d-1", dealerName: "Prestige Motors", vehicleReg: "CD34 FGH", vehicleMake: "Audi", vehicleModel: "A4 S Line", vehicleYear: 2020, vehicleColour: "White", mileage: 45000, duration: 24, startDate: "2024-04-15", endDate: "2026-04-15", cost: 899, status: "active", notes: "", createdAt: "2024-04-15" },
  { id: "w-3", customerId: "customer-3", customerName: "David Brown", customerEmail: "david@example.com", dealerId: "d-2", dealerName: "City Autos", vehicleReg: "EF56 IJK", vehicleMake: "Mercedes-Benz", vehicleModel: "C200 AMG Line", vehicleYear: 2022, vehicleColour: "Silver", mileage: 18000, duration: 12, startDate: "2024-07-01", endDate: "2025-07-01", cost: 749, status: "active", notes: "Extended drivetrain cover", createdAt: "2024-07-01" },
  { id: "w-4", customerId: "customer-4", customerName: "Sarah Jones", customerEmail: "sarah@example.com", dealerId: "d-1", dealerName: "Prestige Motors", vehicleReg: "GH78 LMN", vehicleMake: "Volkswagen", vehicleModel: "Golf R", vehicleYear: 2021, vehicleColour: "Blue", mileage: 28000, duration: 6, startDate: "2024-01-01", endDate: "2024-07-01", cost: 399, status: "expired", notes: "", createdAt: "2024-01-01" },
  { id: "w-5", customerId: "customer-5", customerName: "Michael Taylor", customerEmail: "michael@example.com", dealerId: "d-2", dealerName: "City Autos", vehicleReg: "IJ90 OPQ", vehicleMake: "Ford", vehicleModel: "Focus ST", vehicleYear: 2019, vehicleColour: "Red", mileage: 55000, duration: 12, startDate: "2024-03-15", endDate: "2025-03-15", cost: 499, status: "active", notes: "High mileage add-on", createdAt: "2024-03-15" },
  { id: "w-6", customerId: "customer-1", customerName: "John Smith", customerEmail: "john@example.com", dealerId: "d-1", dealerName: "Prestige Motors", vehicleReg: "KL12 RST", vehicleMake: "Toyota", vehicleModel: "Yaris Hybrid", vehicleYear: 2023, vehicleColour: "Grey", mileage: 8000, duration: 36, startDate: "2024-08-01", endDate: "2027-08-01", cost: 1199, status: "active", notes: "Full comprehensive", createdAt: "2024-08-01" },
];

// --- DEMO CLAIMS ---
export const demoClaims: Claim[] = [
  {
    id: "cl-1", warrantyId: "w-1", customerId: "customer-1", customerName: "John Smith", dealerId: "d-1", vehicleReg: "AB12 CDE",
    description: "Engine warning light on, rough idle at cold start. Loss of power on motorway.",
    status: "under_review", amount: 850, photos: [],
    timeline: [
      { date: "2025-01-10", action: "Claim submitted", by: "John Smith" },
      { date: "2025-01-11", action: "Claim received and under review", by: "Prestige Motors" },
    ],
    createdAt: "2025-01-10",
  },
  {
    id: "cl-2", warrantyId: "w-2", customerId: "customer-2", customerName: "Emma Wilson", dealerId: "d-1", vehicleReg: "CD34 FGH",
    description: "Gearbox grinding noise when shifting from 2nd to 3rd gear.",
    status: "approved", amount: 1200, photos: [],
    timeline: [
      { date: "2024-12-01", action: "Claim submitted", by: "Emma Wilson" },
      { date: "2024-12-02", action: "Under review by dealer", by: "Prestige Motors" },
      { date: "2024-12-05", action: "Approved — authorised for repair", by: "Prestige Motors" },
    ],
    createdAt: "2024-12-01",
  },
  {
    id: "cl-3", warrantyId: "w-3", customerId: "customer-3", customerName: "David Brown", dealerId: "d-2", vehicleReg: "EF56 IJK",
    description: "Air conditioning not blowing cold. Possible compressor failure.",
    status: "pending", photos: [],
    timeline: [
      { date: "2025-02-20", action: "Claim submitted", by: "David Brown" },
    ],
    createdAt: "2025-02-20",
  },
  {
    id: "cl-4", warrantyId: "w-5", customerId: "customer-5", customerName: "Michael Taylor", dealerId: "d-2", vehicleReg: "IJ90 OPQ",
    description: "Clutch slipping at high RPM. Worn clutch plate suspected.",
    status: "rejected", photos: [],
    timeline: [
      { date: "2024-11-15", action: "Claim submitted", by: "Michael Taylor" },
      { date: "2024-11-16", action: "Under review", by: "City Autos" },
      { date: "2024-11-18", action: "Rejected — wear and tear exclusion applies", by: "City Autos" },
    ],
    createdAt: "2024-11-15",
  },
];

// --- DEMO REQUESTS ---
export const demoRequests: CustomerRequest[] = [
  { id: "req-1", customerId: "customer-1", customerName: "John Smith", warrantyId: "w-1", dealerId: "d-1", type: "extension", description: "Would like to extend warranty by 6 months", status: "pending", createdAt: "2025-02-01" },
  { id: "req-2", customerId: "customer-4", customerName: "Sarah Jones", warrantyId: "w-4", dealerId: "d-1", type: "cancellation", description: "Vehicle sold, no longer need warranty", status: "approved", createdAt: "2024-06-20" },
  { id: "req-3", customerId: "customer-5", customerName: "Michael Taylor", warrantyId: "w-5", dealerId: "d-2", type: "update", description: "Please update mileage to 58,000", status: "pending", createdAt: "2025-01-25" },
];

// --- DEMO AUDIT LOG ---
export const demoAuditLog: AuditLog[] = [
  { id: "al-1", dealerId: "d-1", userId: "dealer-1", action: "warranty_created", details: "Created warranty W-1 for John Smith", timestamp: "2024-06-01T10:30:00Z" },
  { id: "al-2", dealerId: "d-1", userId: "dealer-1", action: "warranty_created", details: "Created warranty W-2 for Emma Wilson", timestamp: "2024-04-15T14:20:00Z" },
  { id: "al-3", dealerId: "d-1", userId: "dealer-1", action: "claim_reviewed", details: "Approved claim CL-2 for Emma Wilson", timestamp: "2024-12-05T09:00:00Z" },
  { id: "al-4", dealerId: "d-2", userId: "dealer-2", action: "warranty_created", details: "Created warranty W-3 for David Brown", timestamp: "2024-07-01T11:00:00Z" },
  { id: "al-5", dealerId: "d-2", userId: "dealer-2", action: "claim_rejected", details: "Rejected claim CL-4 for Michael Taylor", timestamp: "2024-11-18T16:45:00Z" },
  { id: "al-6", dealerId: "d-1", userId: "dealer-1", action: "customer_added", details: "Added customer Sarah Jones", timestamp: "2024-05-20T08:15:00Z" },
];
