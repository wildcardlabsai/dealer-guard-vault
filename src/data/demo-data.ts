export type UserRole = "admin" | "dealer" | "customer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  dealerId?: string;
  dealerName?: string;
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
  paymentStatus?: "paid" | "pending" | "free";
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
