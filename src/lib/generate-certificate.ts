import { Warranty } from "@/data/demo-data";
import { demoCoverTemplates, warrantyTemplateMap } from "@/data/cover-templates";

export function generateCertificateHTML(warranty: Warranty): string {
  const templateId = warranty.coverTemplateId || warrantyTemplateMap[warranty.id];
  const template = templateId ? demoCoverTemplates.find(t => t.id === templateId) : null;

  const coveredHtml = template
    ? template.coveredItems.slice(0, 8).map(i => `<li>${i.name}</li>`).join("")
    : "";
  const excludedHtml = template
    ? template.excludedItems.slice(0, 6).map(i => `<li>${i.name}</li>`).join("")
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@500;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #fff; color: #1a1a2e; }
  .cert { max-width: 800px; margin: 0 auto; padding: 48px; border: 3px solid #00323D; position: relative; }
  .cert::before { content: ''; position: absolute; top: 8px; left: 8px; right: 8px; bottom: 8px; border: 1px solid #14b8a6; pointer-events: none; }
  .header { text-align: center; margin-bottom: 32px; border-bottom: 2px solid #00323D; padding-bottom: 24px; }
  .header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 28px; color: #00323D; letter-spacing: 2px; }
  .header p { color: #666; font-size: 13px; margin-top: 4px; }
  .badge { display: inline-block; background: #14b8a6; color: #fff; padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 12px; letter-spacing: 1px; }
  .section { margin-bottom: 24px; }
  .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; color: #00323D; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 32px; }
  .field label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
  .field p { font-size: 14px; font-weight: 600; margin-top: 2px; }
  .footer { text-align: center; margin-top: 40px; padding-top: 24px; border-top: 2px solid #00323D; }
  .footer p { font-size: 11px; color: #888; }
  .ref { font-family: monospace; font-size: 12px; color: #14b8a6; margin-top: 8px; }
  .cover-list { columns: 2; list-style: none; padding: 0; }
  .cover-list li { font-size: 12px; padding: 3px 0; padding-left: 16px; position: relative; }
  .cover-list.covered li::before { content: '✓'; position: absolute; left: 0; color: #14b8a6; font-weight: bold; }
  .cover-list.excluded li::before { content: '✗'; position: absolute; left: 0; color: #e53e3e; font-weight: bold; }
  .claim-box { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-top: 16px; }
  .claim-box h3 { font-size: 13px; font-weight: 700; margin-bottom: 8px; color: #00323D; }
  .claim-box p { font-size: 11px; color: #666; line-height: 1.6; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .cert { border: 3px solid #00323D; } }
</style>
</head>
<body>
<div class="cert">
  <div class="header">
    <h1>WARRANTY CERTIFICATE</h1>
    <p>WarrantyVault — Self-Funded Warranty Management</p>
    ${template ? `<div class="badge">${template.levelName.toUpperCase()} COVER</div>` : '<div class="badge">VERIFIED</div>'}
  </div>

  <div class="section">
    <div class="section-title">Vehicle Details</div>
    <div class="grid">
      <div class="field"><label>Registration</label><p>${warranty.vehicleReg}</p></div>
      <div class="field"><label>Make & Model</label><p>${warranty.vehicleMake} ${warranty.vehicleModel}</p></div>
      <div class="field"><label>Year</label><p>${warranty.vehicleYear}</p></div>
      <div class="field"><label>Colour</label><p>${warranty.vehicleColour}</p></div>
      <div class="field"><label>Mileage at Inception</label><p>${warranty.mileage.toLocaleString()} miles</p></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Customer Details</div>
    <div class="grid">
      <div class="field"><label>Name</label><p>${warranty.customerName}</p></div>
      <div class="field"><label>Dealer</label><p>${warranty.dealerName}</p></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Warranty Coverage</div>
    <div class="grid">
      <div class="field"><label>Start Date</label><p>${new Date(warranty.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p></div>
      <div class="field"><label>End Date</label><p>${new Date(warranty.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p></div>
      <div class="field"><label>Duration</label><p>${warranty.duration} Months</p></div>
      <div class="field"><label>Value</label><p>£${warranty.cost.toLocaleString()}</p></div>
    </div>
  </div>

  ${template ? `
  <div class="section">
    <div class="section-title">Key Covered Items</div>
    <ul class="cover-list covered">${coveredHtml}</ul>
  </div>

  <div class="section">
    <div class="section-title">Key Exclusions</div>
    <ul class="cover-list excluded">${excludedHtml}</ul>
  </div>
  ` : ''}

  <div class="claim-box">
    <h3>How to Make a Claim</h3>
    <p>1. Log into your customer portal at warrantyvault.com<br/>
    2. Start a new claim and upload supporting evidence<br/>
    3. Wait for your dealership to review before authorising repairs<br/>
    <strong>Please do not authorise repairs before contacting your dealership.</strong></p>
  </div>

  <div class="footer">
    <p>This certificate is a summary of your warranty. Full terms and conditions are available in your customer portal or from your dealership.</p>
    <div class="ref">REF: ${warranty.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}</div>
    <p style="margin-top: 12px; font-size: 10px; color: #aaa;">Issued ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
  </div>
</div>
</body>
</html>`;
}

export function openCertificate(warranty: Warranty) {
  const html = generateCertificateHTML(warranty);
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

export function printCertificate(warranty: Warranty) {
  const html = generateCertificateHTML(warranty);
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.onload = () => win.print();
  }
}

export function downloadCertificate(warranty: Warranty) {
  const html = generateCertificateHTML(warranty);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `warranty-certificate-${warranty.vehicleReg.replace(/\s/g, "")}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
