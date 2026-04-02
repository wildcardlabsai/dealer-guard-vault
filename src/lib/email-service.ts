import { supabase } from "@/integrations/supabase/client";

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: { to, subject, html },
    });
    if (error) {
      console.error("Email send error:", error);
      return false;
    }
    return data?.success === true;
  } catch (err) {
    console.error("Email service error:", err);
    return false;
  }
}

const brandColor = "#2a9d8f";
const brandName = "WarrantyVault";

function layout(content: string): string {
  return `
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
          ${content}
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
}

function btn(text: string, url?: string): string {
  return `<a href="${url || 'https://warrantyvault.co.uk'}" style="display:inline-block;background-color:${brandColor};color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px;margin:16px 0;">${text}</a>`;
}

// ── Email templates ──

export async function sendDealerApprovalEmail(email: string, dealerName: string, password: string): Promise<boolean> {
  return sendEmail(email, `Your ${brandName} Dealer Account is Approved`, layout(`
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Welcome aboard, ${dealerName}! 🎉</h2>
    <p style="color:#4b5563;font-size:14px;line-height:1.6;">Your dealer application has been approved. You can now log in and start managing warranties.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdfa;border:1px solid #99f6e4;border-radius:6px;margin:20px 0;padding:0;">
      <tr><td style="padding:16px;">
        <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Your login credentials:</p>
        <p style="margin:0 0 4px;font-size:14px;color:#111827;"><strong>Email:</strong> ${email}</p>
        <p style="margin:0;font-size:14px;color:#111827;"><strong>Password:</strong> ${password}</p>
      </td></tr>
    </table>
    <p style="color:#4b5563;font-size:13px;">Please change your password after your first login.</p>
    ${btn("Log in to WarrantyVault", "https://warrantyvault.co.uk/login")}
  `));
}

export async function sendDealerRejectionEmail(email: string, dealerName: string, reason?: string): Promise<boolean> {
  return sendEmail(email, `${brandName} — Application Update`, layout(`
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Application Update</h2>
    <p style="color:#4b5563;font-size:14px;line-height:1.6;">Dear ${dealerName},</p>
    <p style="color:#4b5563;font-size:14px;line-height:1.6;">We've reviewed your dealer application and unfortunately we're unable to approve it at this time.</p>
    ${reason ? `<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef2f2;border:1px solid #fecaca;border-radius:6px;margin:16px 0;"><tr><td style="padding:16px;"><p style="margin:0;font-size:13px;color:#991b1b;"><strong>Reason:</strong> ${reason}</p></td></tr></table>` : ""}
    <p style="color:#4b5563;font-size:14px;line-height:1.6;">If you believe this is in error or would like to discuss further, please contact our support team.</p>
  `));
}

export async function sendWarrantyConfirmationEmail(
  email: string, customerName: string, vehicleReg: string, vehicleMake: string, vehicleModel: string,
  startDate: string, endDate: string, dealerName: string
): Promise<boolean> {
  return sendEmail(email, `Your Vehicle Warranty is Active — ${brandName}`, layout(`
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Warranty Confirmed ✅</h2>
    <p style="color:#4b5563;font-size:14px;line-height:1.6;">Hi ${customerName}, your vehicle warranty is now active.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdfa;border:1px solid #99f6e4;border-radius:6px;margin:20px 0;">
      <tr><td style="padding:16px;">
        <p style="margin:0 0 6px;font-size:14px;color:#111827;"><strong>Vehicle:</strong> ${vehicleMake} ${vehicleModel} (${vehicleReg})</p>
        <p style="margin:0 0 6px;font-size:14px;color:#111827;"><strong>Cover Period:</strong> ${startDate} — ${endDate}</p>
        <p style="margin:0;font-size:14px;color:#111827;"><strong>Dealer:</strong> ${dealerName}</p>
      </td></tr>
    </table>
    <p style="color:#4b5563;font-size:13px;">You can view your warranty details and submit claims by logging in.</p>
    ${btn("View Your Warranty", "https://warrantyvault.co.uk/login")}
  `));
}

export async function sendClaimSubmittedEmail(
  email: string, customerName: string, claimRef: string, vehicleReg: string, issueTitle: string
): Promise<boolean> {
  return sendEmail(email, `Claim ${claimRef} Submitted — ${brandName}`, layout(`
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Claim Received</h2>
    <p style="color:#4b5563;font-size:14px;line-height:1.6;">Hi ${customerName}, we've received your warranty claim.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdfa;border:1px solid #99f6e4;border-radius:6px;margin:20px 0;">
      <tr><td style="padding:16px;">
        <p style="margin:0 0 6px;font-size:14px;color:#111827;"><strong>Reference:</strong> ${claimRef}</p>
        <p style="margin:0 0 6px;font-size:14px;color:#111827;"><strong>Vehicle:</strong> ${vehicleReg}</p>
        <p style="margin:0;font-size:14px;color:#111827;"><strong>Issue:</strong> ${issueTitle}</p>
      </td></tr>
    </table>
    <p style="color:#4b5563;font-size:13px;">Our team will review your claim and be in touch shortly.</p>
    ${btn("Track Your Claim", "https://warrantyvault.co.uk/login")}
  `));
}

export async function sendClaimStatusEmail(
  email: string, customerName: string, claimRef: string, newStatus: string
): Promise<boolean> {
  const statusText: Record<string, string> = {
    approved: "Your claim has been <strong style='color:#16a34a;'>approved</strong>. We'll be in touch regarding next steps for the repair.",
    rejected: "After careful review, your claim has been <strong style='color:#dc2626;'>declined</strong>. Please check the claim details for more information.",
    partially_approved: "Your claim has been <strong style='color:#d97706;'>partially approved</strong>. Please review the details.",
    awaiting_info: "We need <strong>additional information</strong> to process your claim. Please log in to provide the requested details.",
    under_assessment: "Your claim is now <strong>under assessment</strong> by our technical team.",
  };
  const message = statusText[newStatus] || `Your claim status has been updated to <strong>${newStatus.replace(/_/g, " ")}</strong>.`;

  return sendEmail(email, `Claim ${claimRef} — Status Update`, layout(`
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Claim Status Update</h2>
    <p style="color:#4b5563;font-size:14px;line-height:1.6;">Hi ${customerName},</p>
    <p style="color:#4b5563;font-size:14px;line-height:1.6;">${message}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdfa;border:1px solid #99f6e4;border-radius:6px;margin:20px 0;">
      <tr><td style="padding:16px;">
        <p style="margin:0;font-size:14px;color:#111827;"><strong>Reference:</strong> ${claimRef}</p>
      </td></tr>
    </table>
    ${btn("View Claim Details", "https://warrantyvault.co.uk/login")}
  `));
}

export async function sendSupportTicketEmail(dealerEmail: string, dealerName: string, subject: string, ticketId: string): Promise<boolean> {
  return sendEmail(dealerEmail, `Support Ticket Received — ${brandName}`, layout(`
    <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Support Request Received</h2>
    <p style="color:#4b5563;font-size:14px;line-height:1.6;">Hi ${dealerName}, we've received your support request.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdfa;border:1px solid #99f6e4;border-radius:6px;margin:20px 0;">
      <tr><td style="padding:16px;">
        <p style="margin:0 0 6px;font-size:14px;color:#111827;"><strong>Subject:</strong> ${subject}</p>
        <p style="margin:0;font-size:14px;color:#111827;"><strong>Ticket ID:</strong> ${ticketId}</p>
      </td></tr>
    </table>
    <p style="color:#4b5563;font-size:13px;">Our admin team will respond as soon as possible.</p>
  `));
}

export async function sendDealerCreatedEmail(email: string, dealerName: string, password: string): Promise<boolean> {
  return sendDealerApprovalEmail(email, dealerName, password);
}
