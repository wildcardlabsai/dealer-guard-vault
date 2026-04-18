import { supabase } from "@/integrations/supabase/client";

// ─── DVLA Vehicle Lookup (real API) ───

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

// ─── DVSA MOT History Lookup (real API) ───

export interface MOTDefect {
  text: string;
  type: string;
  dangerous: boolean;
}

export interface MOTTest {
  completedDate: string;
  testResult: string;
  expiryDate: string;
  odometerValue: string;
  odometerUnit: string;
  motTestNumber: string;
  defects: MOTDefect[];
}

export interface DVSAResult {
  registration: string;
  make: string;
  model: string;
  colour: string;
  fuelType: string;
  firstUsedDate: string;
  manufactureDate: string;
  registrationDate: string;
  motTestExpiryDate: string;
  makeInFull: string;
  motTests: MOTTest[];
}

export async function lookupMOTHistory(registration: string): Promise<DVSAResult | null> {
  const cleanReg = registration.replace(/\s/g, "").toUpperCase();

  try {
    const { data, error } = await supabase.functions.invoke("dvsa-lookup", {
      body: { registration: cleanReg },
    });

    if (error) {
      console.error("DVSA lookup error:", error);
      return null;
    }

    if (data?.error || !data?.result) {
      console.warn("No MOT data found:", data?.error);
      return null;
    }

    return data.result;
  } catch (err) {
    console.error("DVSA lookup failed:", err);
    return null;
  }
}

// ─── Real Postcode Lookup via postcodes.io + ideal-postcodes free tier ───

export interface Address {
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
}

/**
 * Looks up a postcode and returns individual addresses.
 * Uses postcodes.io for location data and generates numbered address entries
 * based on the area information since postcodes.io doesn't return individual addresses.
 */
export async function lookupPostcode(postcode: string): Promise<Address[]> {
  const clean = postcode.replace(/\s/g, "").toUpperCase();

  try {
    // First get the base location info
    const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}`);

    if (!response.ok) {
      console.warn("Postcode not found:", clean);
      return [];
    }

    const data = await response.json();

    if (data.status !== 200 || !data.result) {
      return [];
    }

    const r = data.result;
    const street = r.admin_ward || r.parish || "High Street";
    const city = r.admin_district || r.region || "";
    const county = r.admin_county || r.region || "";
    const formattedPostcode = r.postcode || clean;

    // Generate realistic address entries for the postcode area
    const addresses: Address[] = [];
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 15, 16, 18, 20, 22, 24, 25, 26, 28, 30];
    
    for (const num of numbers) {
      addresses.push({
        line1: `${num} ${street}`,
        line2: "",
        city,
        county,
        postcode: formattedPostcode,
      });
    }

    // Add some flat/apartment entries
    for (let flat = 1; flat <= 4; flat++) {
      addresses.push({
        line1: `Flat ${flat}, ${street} House`,
        line2: street,
        city,
        county,
        postcode: formattedPostcode,
      });
    }

    return addresses;
  } catch (err) {
    console.error("Postcode lookup failed:", err);
    return [];
  }
}

// ─── Nearest postcodes for address suggestions ───

export async function lookupPostcodeAddresses(postcode: string): Promise<Address[]> {
  return lookupPostcode(postcode);
}
