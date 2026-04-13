import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Handle tone adjustment
    if (body.action === "adjust") {
      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are a response editor for UK car dealer complaint letters. Adjust the text as instructed. Return ONLY the adjusted text, nothing else." },
            { role: "user", content: `Original text:\n${body.text}\n\nInstruction: ${body.instruction}` },
          ],
        }),
      });
      if (!resp.ok) {
        const t = await resp.text();
        console.error("AI error:", resp.status, t);
        if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (resp.status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error("AI error");
      }
      const data = await resp.json();
      return new Response(JSON.stringify({ adjustedText: data.choices?.[0]?.message?.content || body.text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Main analysis
    const systemPrompt = `You are DisputeIQ, an AI assistant that helps UK car dealers handle customer complaints. You provide structured guidance based on the Consumer Rights Act 2015.

CRITICAL RULES:
- You are NOT a solicitor and do NOT give legal advice
- You provide practical, plain-English guidance
- You help dealers avoid common mistakes
- You NEVER guarantee outcomes
- You are dealer-friendly but fair

Respond with a JSON object (no markdown, no code blocks) with these exact keys:
{
  "summary": "2-3 sentence situation summary",
  "position": "Plain English explanation of the dealer's likely position",
  "riskLevel": "low" | "medium" | "high",
  "approach": "Suggested approach in 2-3 sentences",
  "toneRecommendation": "How the dealer should communicate",
  "riskAlerts": ["array of specific risk warnings"],
  "responses": {
    "helpful": "Full email response - helpful and accommodating tone",
    "firm": "Full email response - firm but professional tone",
    "defensive": "Full email response - protective but not aggressive",
    "deescalation": "Full email response - calming and empathetic"
  },
  "responseScore": { "clarity": 0-100, "risk": 0-100, "tone": 0-100 },
  "strategyDoNots": ["things the dealer should NOT say"],
  "strategyKeyRisks": ["key risks in this situation"],
  "strategySuggestedStance": "Overall recommended stance"
}

Each response should:
- Start with "Hi [customer name]"
- Reference the specific situation
- Feel human and professional
- Be 3-5 paragraphs
- End with appropriate sign-off`;

    const userPrompt = `Analyse this complaint:

Complaint Type: ${body.complaintType}
Customer: ${body.customerName}
Vehicle: ${body.vehicleReg}
Sale Date: ${body.saleDate}
Issue Date: ${body.issueDate}
Mileage at Sale: ${body.mileageAtSale}
Mileage Now: ${body.mileageNow}
Drivable: ${body.drivable}
Repairs Authorised: ${body.repairsAuthorised}
Warranty Status: ${body.warrantyStatus}
CRA Window: ${body.craWindow} (${body.craExplanation})
Issue Classification: ${body.issueClassification}
Escalation Flags: ${(body.escalationFlags || []).join(", ") || "None"}

Customer's complaint:
${body.customerSummary}`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "provide_analysis",
            description: "Provide the structured dispute analysis",
            parameters: {
              type: "object",
              properties: {
                summary: { type: "string" },
                position: { type: "string" },
                riskLevel: { type: "string", enum: ["low", "medium", "high"] },
                approach: { type: "string" },
                toneRecommendation: { type: "string" },
                riskAlerts: { type: "array", items: { type: "string" } },
                responses: {
                  type: "object",
                  properties: {
                    helpful: { type: "string" },
                    firm: { type: "string" },
                    defensive: { type: "string" },
                    deescalation: { type: "string" },
                  },
                  required: ["helpful", "firm", "defensive", "deescalation"],
                },
                responseScore: {
                  type: "object",
                  properties: {
                    clarity: { type: "number" },
                    risk: { type: "number" },
                    tone: { type: "number" },
                  },
                  required: ["clarity", "risk", "tone"],
                },
                strategyDoNots: { type: "array", items: { type: "string" } },
                strategyKeyRisks: { type: "array", items: { type: "string" } },
                strategySuggestedStance: { type: "string" },
              },
              required: ["summary", "position", "riskLevel", "approach", "toneRecommendation", "riskAlerts", "responses", "responseScore", "strategyDoNots", "strategyKeyRisks", "strategySuggestedStance"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "provide_analysis" } },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI error:", resp.status, t);
      if (resp.status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (resp.status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error("AI analysis failed");
    }

    const data = await resp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("disputeiq-reason error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
