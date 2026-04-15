import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generatePassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let pw = "";
  for (let i = 0; i < 12; i++) {
    pw += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pw;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { signupRequestId } = await req.json();
    if (!signupRequestId) {
      return new Response(JSON.stringify({ error: "Missing signupRequestId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Fetch the signup request
    const { data: reqData, error: reqErr } = await supabase
      .from("signup_requests")
      .select("*")
      .eq("id", signupRequestId)
      .single();

    if (reqErr || !reqData) {
      return new Response(JSON.stringify({ error: "Signup request not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Generate a dealer code and password
    const dealerCode = "DLR-" + reqData.dealership_name.replace(/[^A-Za-z0-9]/g, "").substring(0, 6).toUpperCase() + "-" + Date.now().toString(36).toUpperCase().slice(-4);
    const password = generatePassword();

    // 3. Create Supabase Auth user
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: reqData.email,
      password,
      email_confirm: true,
      user_metadata: {
        name: reqData.contact_name,
        role: "dealer",
        dealerId: dealerCode,
        dealerName: reqData.dealership_name,
        full_name: reqData.contact_name,
      },
    });

    if (authErr) {
      return new Response(JSON.stringify({ error: "Failed to create auth user: " + authErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Create dealer record
    await supabase.from("dealers").insert({
      dealer_code: dealerCode,
      name: reqData.dealership_name,
      email: reqData.email,
      phone: reqData.phone || null,
      fca_number: reqData.fca_number || null,
      address: reqData.address || null,
      city: reqData.city || null,
      postcode: reqData.postcode || null,
      status: "active",
    });

    // 5. Mark signup request as approved
    await supabase.from("signup_requests").update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
    }).eq("id", signupRequestId);

    // 6. Log the action
    await supabase.from("audit_log").insert({
      action: "dealer_approved",
      details: `Approved dealer signup: ${reqData.dealership_name} (${reqData.email})`,
    });

    return new Response(JSON.stringify({
      success: true,
      email: reqData.email,
      password,
      dealerName: reqData.dealership_name,
      dealerCode,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
