import { supabase } from "@/integrations/supabase/client";

// Real DVLA vehicle lookup via edge function
export interface DVLAVehicle {
  make: string;
  model: string;
  colour: string;
  year: number;
  fuelType: string;
  engineSize: string;
  taxStatus: string;
  motStatus?: string;
  motExpiry: string;
  registration: string;
  dateOfFirstRegistration?: string;
  co2Emissions?: number;
  euroStatus?: string;
  wheelplan?: string;
}

export async function lookupVehicle(registration: string): Promise<DVLAVehicle | null> {
  const cleanReg = registration.replace(/\s/g, "").toUpperCase();
  
  try {
    const { data, error } = await supabase.functions.invoke("dvla-lookup", {
      body: { registration: cleanReg },
    });

    if (error) {
      console.error("DVLA lookup error:", error);
      return null;
    }

    if (data?.error || !data?.vehicle) {
      console.warn("Vehicle not found:", data?.error);
      return null;
    }

    return data.vehicle;
  } catch (err) {
    console.error("DVLA lookup failed:", err);
    return null;
  }
}

// Simulated Address Lookup (keeping postcode lookup as simulated for now)
const postcodeDatabase: Record<string, { line1: string; line2: string; city: string; county: string; postcode: string }[]> = {
  "SW1A1AA": [
    { line1: "Buckingham Palace", line2: "", city: "London", county: "Greater London", postcode: "SW1A 1AA" },
  ],
  "B11QT": [
    { line1: "1 Colmore Row", line2: "", city: "Birmingham", county: "West Midlands", postcode: "B1 1QT" },
    { line1: "2 Colmore Row", line2: "Suite 4", city: "Birmingham", county: "West Midlands", postcode: "B1 1QT" },
    { line1: "3 Colmore Row", line2: "", city: "Birmingham", county: "West Midlands", postcode: "B1 1QT" },
  ],
  "M11AA": [
    { line1: "1 Piccadilly", line2: "", city: "Manchester", county: "Greater Manchester", postcode: "M1 1AA" },
    { line1: "15 Portland Street", line2: "", city: "Manchester", county: "Greater Manchester", postcode: "M1 1AA" },
  ],
  "LS11UR": [
    { line1: "1 City Square", line2: "", city: "Leeds", county: "West Yorkshire", postcode: "LS1 1UR" },
    { line1: "10 Park Row", line2: "", city: "Leeds", county: "West Yorkshire", postcode: "LS1 1UR" },
  ],
};

export interface Address {
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
}

export async function lookupPostcode(postcode: string): Promise<Address[]> {
  await new Promise(r => setTimeout(r, 600));
  const clean = postcode.replace(/\s/g, "").toUpperCase();
  const results = postcodeDatabase[clean];
  if (results) return results;
  return [
    { line1: `${Math.floor(Math.random() * 100) + 1} High Street`, line2: "", city: "Anytown", county: "Countyshire", postcode: postcode.toUpperCase() },
    { line1: `${Math.floor(Math.random() * 100) + 1} Station Road`, line2: "Flat B", city: "Anytown", county: "Countyshire", postcode: postcode.toUpperCase() },
  ];
}
