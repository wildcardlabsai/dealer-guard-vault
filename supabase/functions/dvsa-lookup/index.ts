import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// New DVSA MOT History API (replaces deprecated beta.check-mot.service.gov.uk)
const DVSA_API_BASE = "https://history.mot.api.gov.uk/v1/trade/vehicles/registration";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DVSA_API_KEY = Deno.env.get("DVSA_API_KEY");
    if (!DVSA_API_KEY) {
      throw new Error("DVSA_API_KEY is not configured");
    }

    const { registration } = await req.json();
    if (!registration || typeof registration !== "string") {
      return new Response(JSON.stringify({ error: "Registration number is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanReg = registration.replace(/\s/g, "").toUpperCase();

    const response = await fetch(`${DVSA_API_BASE}/${cleanReg}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "x-api-key": DVSA_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DVSA API error [${response.status}]:`, errorText);

      if (response.status === 404) {
        return new Response(JSON.stringify({ error: "No MOT data found", result: null }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`DVSA API returned ${response.status}: ${errorText}`);
    }

    const vehicle = await response.json();

    if (!vehicle) {
      return new Response(JSON.stringify({ error: "No MOT data found", result: null }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract MOT test history (most recent first)
    // The new API uses motTests array with slightly different field names
    const motTests = (vehicle.motTests || []).map((test: any) => ({
      completedDate: test.completedDate || "",
      testResult: test.testResult || "",
      expiryDate: test.expiryDate || "",
      odometerValue: test.odometerValue || "",
      odometerUnit: test.odometerUnit || "",
      motTestNumber: test.motTestNumber || "",
      defects: (test.defects || test.rfrAndComments || []).map((d: any) => ({
        text: d.text || "",
        type: d.type || "",
        dangerous: d.dangerous || false,
      })),
    }));

    const result = {
      registration: vehicle.registration || cleanReg,
      make: vehicle.make || "",
      model: vehicle.model || "",
      colour: vehicle.primaryColour || vehicle.colour || "",
      fuelType: vehicle.fuelType || "",
      firstUsedDate: vehicle.firstUsedDate || "",
      manufactureDate: vehicle.manufactureDate || "",
      registrationDate: vehicle.registrationDate || "",
      dvlaId: vehicle.dvlaId || "",
      motTestExpiryDate: vehicle.motTestExpiryDate || "",
      motTests,
      makeInFull: vehicle.makeInFull || "",
    };

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("DVSA lookup error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});