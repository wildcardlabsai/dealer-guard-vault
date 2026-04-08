import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

interface InviteRequest {
  email: string;
  customerName: string;
  dealerName: string;
  vehicleReg?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  startDate?: string;
  endDate?: string;
}

function generatePassword(): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let pw = "";
  for (let i = 0; i < 12; i++) {
    pw += chars[Math.floor(Math.random() * chars.length)];
  }
  return pw;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      throw new Error("Email API keys not configured");
    }

    const body: InviteRequest = await req.json();
    const { email, customerName, dealerName, vehicleReg, vehicleMake, vehicleModel, startDate, endDate } = body;

    if (!email || !customerName || !dealerName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, customerName, dealerName" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    let password: string | null = null;
    let userId: string;
    let isNewAccount = false;

    if (existingUser) {
      userId = existingUser.id;
      // User exists — we'll send a reminder email instead
    } else {
      // Create new auth account
      password = generatePassword();
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: customerName, role: "customer" },
      });

      if (createError) {
        console.error("User creation error:", createError);
        throw new Error(`Failed to create user: ${createError.message}`);
      }

      userId = newUser.user.id;
      isNewAccount = true;
    }

    // Build email content
    const brandColor = "#2a9d8f";
    const brandName = "WarrantyVault";

    const warrantyInfo = vehicleReg
      ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdfa;border:1px solid #99f6e4;border-radius:6px;margin:20px 0;">
        <tr><td style="padding:16px;">
          <p style="margin:0 0 6px;font-size:14px;color:#111827;"><strong>Vehicle:</strong> ${vehicleMake || ""} ${vehicleModel || ""} (${vehicleReg})</p>
          ${startDate ? `<p style="margin:0 0 6px;font-size:14px;color:#111827;"><strong>Cover Period:</strong> ${startDate} — ${endDate}</p>` : ""}
          <p style="margin:0;font-size:14px;color:#111827;"><strong>Dealer:</strong> ${dealerName}</p>
        </td></tr>
      </table>`
      : "";

    const credentialsBlock = isNewAccount && password
      ? `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdfa;border:1px solid #99f6e4;border-radius:6px;margin:20px 0;">
        <tr><td style="padding:16px;">
          <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Your login credentials:</p>
          <p style="margin:0 0 4px;font-size:14px;color:#111827;"><strong>Email:</strong> ${email}</p>
          <p style="margin:0;font-size:14px;color:#111827;"><strong>Password:</strong> ${password}</p>
        </td></tr>
      </table>
      <p style="color:#4b5563;font-size:13px;">Please change your password after your first login.</p>`
      : `<p style="color:#4b5563;font-size:14px;line-height:1.6;">You already have an account — just log in with your existing credentials.</p>`;

    const subject = isNewAccount
      ? vehicleReg
        ? `Your Vehicle Warranty & Portal Access — ${brandName}`
        : `Welcome to ${brandName} — Your Customer Portal`
      : vehicleReg
        ? `New Warranty Added — ${vehicleReg} — ${brandName}`
        : `You've Been Invited — ${brandName}`;

    const heading = isNewAccount
      ? vehicleReg
        ? "Warranty Confirmed & Portal Access ✅"
        : `Welcome to ${brandName}! 🎉`
      : vehicleReg
        ? "New Warranty Added ✅"
        : "Portal Access Reminder";

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <tr><td style="background-color:${brandColor};padding:24px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;">${brandName}</h1>
            </td></tr>
            <tr><td style="padding:32px;">
              <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">${heading}</h2>
              <p style="color:#4b5563;font-size:14px;line-height:1.6;">Hi ${customerName},</p>
              <p style="color:#4b5563;font-size:14px;line-height:1.6;">${dealerName} has ${vehicleReg ? "set up a warranty for your vehicle" : "invited you to their customer portal"} on ${brandName}.</p>
              ${warrantyInfo}
              ${credentialsBlock}
              <a href="https://warrantyvault.co.uk/customers" style="display:inline-block;background-color:${brandColor};color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px;margin:16px 0;">Log in to Your Portal</a>
            </td></tr>
            <tr><td style="padding:20px 32px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                © ${new Date().getFullYear()} ${brandName}. All rights reserved.<br>
                <a href="https://warrantyvault.co.uk" style="color:${brandColor};text-decoration:none;">warrantyvault.co.uk</a>
              </p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>`;

    // Send email via Resend
    const emailResponse = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: `${brandName} <noreply@warrantyvault.co.uk>`,
        to: [email],
        subject,
        html,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Email send failed:", JSON.stringify(emailData));
      throw new Error(`Email send failed: ${JSON.stringify(emailData)}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        isNewAccount,
        userId,
        emailId: emailData.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Invite error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
