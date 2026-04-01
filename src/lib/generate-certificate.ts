import { Warranty } from "@/data/demo-data";

export function generateCertificateHTML(warranty: Warranty): string {
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
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .cert { border: 3px solid #00323D; } }
</style>
</head>
<body>
<div class="cert">
  <div class="header">
    <h1>WARRANTY CERTIFICATE</h1>
    <p>WarrantyVault — Self-Funded Warranty Management</p>
    <div class="badge">VERIFIED</div>
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

  <div class="footer">
    <p>This certificate confirms that the above vehicle is covered under a self-funded warranty policy managed via WarrantyVault.</p>
    <p>For claims, visit your customer portal or contact your dealership directly.</p>
    <div class="ref">REF: ${warranty.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}</div>
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
