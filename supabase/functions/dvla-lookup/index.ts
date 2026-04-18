import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DVLA_API_URL = "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DVLA_API_KEY = Deno.env.get("DVLA_API_KEY");
    if (!DVLA_API_KEY) {
      throw new Error("DVLA_API_KEY is not configured");
    }

    const { registration } = await req.json();
    if (!registration || typeof registration !== "string") {
      return new Response(JSON.stringify({ error: "Registration number is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanReg = registration.replace(/\s/g, "").toUpperCase();

    const response = await fetch(DVLA_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": DVLA_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ registrationNumber: cleanReg }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DVLA API error [${response.status}]:`, errorText);
      
      if (response.status === 404) {
        return new Response(JSON.stringify({ error: "Vehicle not found", vehicle: null }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`DVLA API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    // Map DVLA response to our DVLAVehicle format
    const vehicle = {
      make: data.make || "Unknown",
      model: data.model || data.genericMake || data.make || "Unknown",
      colour: data.colour || "Unknown",
      year: data.yearOfManufacture || 0,
      fuelType: data.fuelType || "Unknown",
      engineSize: data.engineCapacity ? `${data.engineCapacity}cc` : "Unknown",
      taxStatus: data.taxStatus || "Unknown",
      motStatus: data.motStatus || "Unknown",
      motExpiry: data.motExpiryDate || "",
      registration: cleanReg,
      // Additional useful fields from DVLA
      dateOfFirstRegistration: data.dateOfFirstRegistration || "",
      co2Emissions: data.co2Emissions || 0,
      euroStatus: data.euroStatus || "",
      wheelplan: data.wheelplan || "",
      monthOfFirstRegistration: data.monthOfFirstRegistration || "",
      revenueWeight: data.revenueWeight || 0,
      typeApproval: data.typeApproval || "",
      taxDueDate: data.taxDueDate || "",
      markedForExport: data.markedForExport || false,
    };

    return new Response(JSON.stringify({ vehicle }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("DVLA lookup error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
