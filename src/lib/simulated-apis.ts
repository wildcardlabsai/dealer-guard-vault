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

// ─── Real Postcode Lookup via postcodes.io (free, no API key) ───

export interface Address {
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
}

export async function lookupPostcode(postcode: string): Promise<Address[]> {
  const clean = postcode.replace(/\s/g, "").toUpperCase();

  try {
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

    // postcodes.io returns location data, not individual addresses
    // We return the location info formatted as an address entry
    return [
      {
        line1: r.parish || r.admin_ward || "",
        line2: r.admin_district || "",
        city: r.admin_district || r.region || "",
        county: r.admin_county || r.region || "",
        postcode: r.postcode || clean,
      },
    ];
  } catch (err) {
    console.error("Postcode lookup failed:", err);
    return [];
  }
}

// ─── Nearest postcodes for address suggestions ───

export async function lookupPostcodeAddresses(postcode: string): Promise<Address[]> {
  const clean = postcode.replace(/\s/g, "").toUpperCase();

  try {
    // Use autocomplete to get nearby postcodes, then resolve each
    const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}/nearest`);

    if (!response.ok) {
      // Fall back to basic lookup
      return lookupPostcode(postcode);
    }

    const data = await response.json();

    if (data.status !== 200 || !data.result || !Array.isArray(data.result)) {
      return lookupPostcode(postcode);
    }

    return data.result.map((r: any) => ({
      line1: r.parish || r.admin_ward || "",
      line2: r.admin_district || "",
      city: r.admin_district || r.region || "",
      county: r.admin_county || r.region || "",
      postcode: r.postcode || clean,
    }));
  } catch (err) {
    console.error("Postcode addresses lookup failed:", err);
    return lookupPostcode(postcode);
  }
}
