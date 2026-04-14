import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { table, action, id, updates, filters } = await req.json();

    const allowedTables = [
      "enquiries", "signup_requests", "warranties", "claims",
      "customer_requests", "audit_log", "customers", "dealers",
      "support_tickets", "cover_templates", "dispute_cases",
      "dealer_settings", "warranty_lines", "notifications",
    ];
    if (!allowedTables.includes(table)) {
      return new Response(JSON.stringify({ error: "Invalid table" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "select") {
      let query = supabase.from(table).select("*");
      if (filters?.dealer_id) query = query.eq("dealer_id", filters.dealer_id);
      if (filters?.customer_email) query = query.ilike("customer_email", filters.customer_email);
      if (filters?.status) query = query.eq("status", filters.status);
      if (filters?.user_id) query = query.eq("user_id", filters.user_id);
      const { data, error } = await query.order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "insert") {
      const { data, error } = await supabase.from(table).insert(updates).select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update" && id) {
      const { data, error } = await supabase.from(table).update(updates).eq("id", id).select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "upsert") {
      const { data, error } = await supabase.from(table).upsert(updates, { onConflict: filters?.onConflict || "id" }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete" && id) {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
