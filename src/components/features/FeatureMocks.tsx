import {
  Shield, UserCheck, ClipboardCheck, Gavel, FileSearch, Sparkles,
  Wallet, BarChart3, Phone, FileText, FolderOpen, Headphones,
  CheckCircle2, AlertCircle, Clock, TrendingUp, Search, Bell,
  Car, PoundSterling, Download, Upload, MessageSquare, ChevronRight,
  PhoneCall, Volume2, FileCheck, LifeBuoy, Sliders
} from "lucide-react";

/**
 * All mocks render in light mode (forced via the `light` class wrapper)
 * to contrast against the dark features page.
 * They are pure presentational components — no real data, no interaction.
 */

function MockFrame({ children, title = "warrantyvault.co.uk" }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="light rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[hsl(220,20%,97%)] text-[hsl(220,20%,10%)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[hsl(220,14%,92%)] border-b border-[hsl(220,13%,87%)]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-[10px] text-[hsl(220,10%,46%)] bg-white px-3 py-0.5 rounded-md inline-block">{title}</span>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function StatPill({ label, value, tone = "primary" }: { label: string; value: string; tone?: "primary" | "warn" | "neutral" | "success" }) {
  const tones = {
    primary: "bg-[hsl(172,66%,40%)]/10 text-[hsl(172,66%,30%)]",
    warn: "bg-amber-500/10 text-amber-700",
    neutral: "bg-[hsl(220,14%,92%)] text-[hsl(220,20%,30%)]",
    success: "bg-emerald-500/10 text-emerald-700",
  };
  return (
    <div className="flex-1 rounded-lg bg-white border border-[hsl(220,13%,87%)] p-3">
      <p className="text-[10px] text-[hsl(220,10%,46%)] uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold font-display">{value}</p>
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${tones[tone]}`}>●</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "active" | "expired" | "pending" | "approved" | "rejected" | "review" }) {
  const map = {
    active: "bg-emerald-100 text-emerald-700",
    approved: "bg-emerald-100 text-emerald-700",
    expired: "bg-red-100 text-red-700",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
    review: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${map[status]}`}>
      {status}
    </span>
  );
}

/* ---------- 1. Warranty Management ---------- */
export function WarrantyManagementMock() {
  const rows = [
    { reg: "CJ72 ENK", make: "Dacia Jogger", customer: "James Wright", status: "active" as const, expires: "12 Mar 2026" },
    { reg: "LR21 KFG", make: "Ford Focus", customer: "Sarah Khan", status: "active" as const, expires: "04 Aug 2026" },
    { reg: "BD19 PXM", make: "BMW 320d", customer: "Tom Patel", status: "review" as const, expires: "29 Jan 2026" },
    { reg: "VK68 RTY", make: "VW Golf", customer: "Emma Hill", status: "expired" as const, expires: "08 Nov 2025" },
  ];
  return (
    <MockFrame title="warrantyvault.co.uk/dealer/warranties">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold font-display flex items-center gap-2"><Shield className="w-4 h-4 text-[hsl(172,66%,40%)]" /> Warranties</h4>
          <p className="text-[10px] text-[hsl(220,10%,46%)]">128 active · 12 in review · 31 expired</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-[hsl(220,13%,87%)] rounded-md px-2 py-1">
            <Search className="w-3 h-3 text-[hsl(220,10%,46%)]" />
            <span className="text-[10px] text-[hsl(220,10%,46%)]">Search reg…</span>
          </div>
          <button className="text-[10px] font-semibold bg-[hsl(172,66%,40%)] text-white rounded-md px-2.5 py-1.5">+ New</button>
        </div>
      </div>
      <div className="rounded-lg border border-[hsl(220,13%,87%)] overflow-hidden bg-white">
        <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-[hsl(220,14%,92%)] text-[9px] font-semibold uppercase tracking-wider text-[hsl(220,10%,46%)]">
          <div className="col-span-3">Reg / Vehicle</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Expires</div>
          <div className="col-span-3 text-right">Status</div>
        </div>
        {rows.map(r => (
          <div key={r.reg} className="grid grid-cols-12 gap-2 px-3 py-2.5 border-t border-[hsl(220,13%,87%)] items-center">
            <div className="col-span-3">
              <p className="text-[11px] font-semibold">{r.reg}</p>
              <p className="text-[10px] text-[hsl(220,10%,46%)]">{r.make}</p>
            </div>
            <div className="col-span-3 text-[11px]">{r.customer}</div>
            <div className="col-span-3 text-[11px] text-[hsl(220,10%,46%)] flex items-center gap-1"><Clock className="w-3 h-3" />{r.expires}</div>
            <div className="col-span-3 text-right"><StatusBadge status={r.status} /></div>
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

/* ---------- 2. Customer Portal ---------- */
export function CustomerPortalMock() {
  return (
    <MockFrame title="warrantyvault.co.uk/customer/dashboard">
      <div className="mb-4">
        <p className="text-[10px] text-[hsl(220,10%,46%)] uppercase tracking-wider">Welcome back</p>
        <h4 className="text-base font-bold font-display">James Wright</h4>
      </div>
      <div className="rounded-xl border border-[hsl(220,13%,87%)] bg-white p-4 mb-3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[10px] text-[hsl(220,10%,46%)] uppercase tracking-wider">Active warranty</p>
            <p className="text-sm font-bold font-display flex items-center gap-2"><Car className="w-4 h-4 text-[hsl(172,66%,40%)]" /> Dacia Jogger · CJ72 ENK</p>
          </div>
          <StatusBadge status="active" />
        </div>
        <div className="flex items-center gap-3">
          {/* Circular countdown */}
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(220,14%,92%)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(172,66%,40%)" strokeWidth="3" strokeDasharray="97.4" strokeDashoffset="22" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-bold leading-none">218</span>
              <span className="text-[8px] text-[hsl(220,10%,46%)]">days</span>
            </div>
          </div>
          <div className="flex-1 text-[10px] space-y-0.5">
            <div className="flex justify-between"><span className="text-[hsl(220,10%,46%)]">Started</span><span className="font-medium">12 Mar 2025</span></div>
            <div className="flex justify-between"><span className="text-[hsl(220,10%,46%)]">Expires</span><span className="font-medium">12 Mar 2026</span></div>
            <div className="flex justify-between"><span className="text-[hsl(220,10%,46%)]">Cover</span><span className="font-medium">Gold</span></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="flex items-center justify-center gap-1.5 bg-[hsl(172,66%,40%)] text-white text-[11px] font-semibold rounded-lg py-2"><Download className="w-3 h-3" /> Certificate</button>
        <button className="flex items-center justify-center gap-1.5 bg-white border border-[hsl(220,13%,87%)] text-[11px] font-semibold rounded-lg py-2"><AlertCircle className="w-3 h-3" /> Submit Claim</button>
      </div>
    </MockFrame>
  );
}

/* ---------- 3. Claims Management ---------- */
export function ClaimsManagementMock() {
  const claims = [
    { ref: "CLM-2041", vehicle: "Dacia Jogger", issue: "Gearbox noise", status: "review" as const, days: 2 },
    { ref: "CLM-2039", vehicle: "Ford Focus", issue: "AC not cooling", status: "approved" as const, days: 0 },
    { ref: "CLM-2037", vehicle: "BMW 320d", issue: "EGR fault code", status: "pending" as const, days: 4 },
  ];
  return (
    <MockFrame title="warrantyvault.co.uk/dealer/claims">
      <div className="flex gap-2 mb-3">
        <StatPill label="Open" value="7" tone="warn" />
        <StatPill label="Approved" value="42" tone="success" />
        <StatPill label="Avg. decision" value="6h" tone="primary" />
      </div>
      <div className="space-y-2">
        {claims.map(c => (
          <div key={c.ref} className="rounded-lg border border-[hsl(220,13%,87%)] bg-white p-3">
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <p className="text-[11px] font-semibold">{c.ref} · {c.vehicle}</p>
                <p className="text-[10px] text-[hsl(220,10%,46%)]">{c.issue}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[9px] text-[hsl(220,10%,46%)] flex items-center gap-1"><Clock className="w-3 h-3" /> {c.days}d in queue</span>
              <div className="flex gap-1">
                <button className="text-[9px] font-semibold bg-[hsl(172,66%,40%)] text-white rounded px-2 py-0.5">Approve</button>
                <button className="text-[9px] font-semibold bg-white border border-[hsl(220,13%,87%)] rounded px-2 py-0.5">Request info</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

/* ---------- 4. Claim Assist ---------- */
export function ClaimAssistMock() {
  const checklist = [
    { label: "Customer contacted", done: true },
    { label: "Photos & videos received", done: true },
    { label: "Diagnostic report uploaded", done: true },
    { label: "Garage estimate verified", done: false },
    { label: "Decision communicated", done: false },
  ];
  return (
    <MockFrame title="warrantyvault.co.uk/dealer/claim-assist">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold font-display flex items-center gap-2"><Gavel className="w-4 h-4 text-[hsl(172,66%,40%)]" /> CLM-2041 · Claim Assist</h4>
          <p className="text-[10px] text-[hsl(220,10%,46%)]">Dacia Jogger · Gearbox noise</p>
        </div>
        <span className="text-[9px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Triage: Likely Cover</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[hsl(220,13%,87%)] bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,46%)] mb-2">Checklist</p>
          <div className="space-y-1.5">
            {checklist.map(c => (
              <div key={c.label} className="flex items-center gap-2">
                <CheckCircle2 className={`w-3 h-3 flex-shrink-0 ${c.done ? "text-[hsl(172,66%,40%)]" : "text-[hsl(220,13%,80%)]"}`} />
                <span className={`text-[10px] ${c.done ? "" : "text-[hsl(220,10%,46%)]"}`}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-[hsl(220,13%,87%)] bg-white p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,46%)] mb-2 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Customer thread</p>
          <div className="space-y-2">
            <div className="bg-[hsl(220,14%,94%)] rounded-md p-2 text-[10px]">Hi, the gearbox is making a grinding noise above 40mph.</div>
            <div className="bg-[hsl(172,66%,40%)]/10 rounded-md p-2 text-[10px] ml-4">Thanks James — please book in at our partner garage. Authorisation sent.</div>
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

/* ---------- 5. Evidence Pack (reused for Claim Assist screenshot or future) ---------- */
export function EvidencePackMock() {
  return (
    <MockFrame title="Evidence Pack · CLM-2041.pdf">
      <div className="rounded-lg border border-[hsl(220,13%,87%)] bg-white p-4">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-[hsl(220,13%,87%)]">
          <div>
            <p className="text-[10px] text-[hsl(220,10%,46%)] uppercase tracking-wider">Evidence Pack</p>
            <p className="text-sm font-bold font-display">CLM-2041 · Dacia Jogger</p>
          </div>
          <FileCheck className="w-6 h-6 text-[hsl(172,66%,40%)]" />
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {["Diag.pdf", "Photo1.jpg", "Photo2.jpg", "Estimate.pdf", "MOT.pdf", "Invoice.pdf"].map(f => (
            <div key={f} className="rounded-md bg-[hsl(220,14%,94%)] p-2 flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-[hsl(220,10%,46%)]" />
              <span className="text-[9px] truncate">{f}</span>
            </div>
          ))}
        </div>
        <div className="text-[10px] space-y-1 text-[hsl(220,20%,30%)]">
          <p><span className="font-semibold">Decision:</span> Approved · £842.00</p>
          <p><span className="font-semibold">Triage:</span> Likely Cover (87% confidence)</p>
          <p><span className="font-semibold">CRA window:</span> Within 6 months — burden on dealer</p>
        </div>
      </div>
    </MockFrame>
  );
}

/* ---------- 6. DisputeIQ ---------- */
export function DisputeIQMock() {
  return (
    <MockFrame title="warrantyvault.co.uk/disputeiq">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold font-display flex items-center gap-2"><Sparkles className="w-4 h-4 text-[hsl(172,66%,40%)]" /> DisputeIQ Analysis</h4>
          <p className="text-[10px] text-[hsl(220,10%,46%)]">Customer: Sarah Khan · Sold 14 days ago</p>
        </div>
        <span className="text-[9px] font-semibold uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded-full">High Risk</span>
      </div>
      <div className="rounded-lg border border-[hsl(220,13%,87%)] bg-white p-3 mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,46%)] mb-1">CRA Position</p>
        <p className="text-[11px] leading-relaxed">Within <span className="font-semibold text-red-700">30-day short-term right to reject</span>. Customer can demand full refund unless dealer proves fault did not exist at point of sale.</p>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        {["Helpful", "Firm", "Defensive", "De-escalation"].map((tone, i) => (
          <button key={tone} className={`text-[10px] font-semibold rounded-md py-1.5 border ${i === 0 ? "bg-[hsl(172,66%,40%)] text-white border-transparent" : "bg-white border-[hsl(220,13%,87%)]"}`}>{tone}</button>
        ))}
      </div>
      <div className="rounded-lg bg-[hsl(220,14%,94%)] p-2.5">
        <p className="text-[10px] leading-relaxed text-[hsl(220,20%,20%)]">"Hi Sarah, thanks for getting in touch. We take faults reported within the first 30 days very seriously and would like to invite the vehicle back to inspect…"</p>
      </div>
    </MockFrame>
  );
}

/* ---------- 7. Warranty Fund ---------- */
export function WarrantyFundMock() {
  return (
    <MockFrame title="warrantyvault.co.uk/dealer/warranty-fund">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold font-display flex items-center gap-2"><Wallet className="w-4 h-4 text-[hsl(172,66%,40%)]" /> Warranty Fund</h4>
        <span className="text-[9px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Healthy</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="rounded-lg bg-white border border-[hsl(220,13%,87%)] p-3">
          <p className="text-[9px] text-[hsl(220,10%,46%)] uppercase tracking-wider">Balance</p>
          <p className="text-base font-bold font-display">£18,420</p>
        </div>
        <div className="rounded-lg bg-white border border-[hsl(220,13%,87%)] p-3">
          <p className="text-[9px] text-[hsl(220,10%,46%)] uppercase tracking-wider">Buffer</p>
          <p className="text-base font-bold font-display">£12,200</p>
        </div>
        <div className="rounded-lg bg-white border border-[hsl(220,13%,87%)] p-3">
          <p className="text-[9px] text-[hsl(220,10%,46%)] uppercase tracking-wider">Health</p>
          <p className="text-base font-bold font-display text-emerald-600">82</p>
        </div>
      </div>
      <div className="rounded-lg bg-white border border-[hsl(220,13%,87%)] p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,46%)]">Contributions vs Payouts</p>
          <span className="text-[9px] text-emerald-600 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> +14%</span>
        </div>
        <div className="flex items-end gap-1 h-16">
          {[40, 55, 48, 62, 70, 58, 75, 82].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col gap-0.5 items-center">
              <div className="w-full bg-[hsl(172,66%,40%)] rounded-sm" style={{ height: `${h}%` }} />
              <div className="w-full bg-[hsl(220,14%,80%)] rounded-sm" style={{ height: `${h * 0.45}%` }} />
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

/* ---------- 8. Profit Tracking ---------- */
export function ProfitTrackingMock() {
  return (
    <MockFrame title="warrantyvault.co.uk/dealer/dashboard">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold font-display flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[hsl(172,66%,40%)]" /> Profit Overview</h4>
        <select className="text-[10px] bg-white border border-[hsl(220,13%,87%)] rounded px-2 py-0.5">
          <option>Last 6 months</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="rounded-lg bg-white border border-[hsl(220,13%,87%)] p-3">
          <p className="text-[9px] text-[hsl(220,10%,46%)] uppercase tracking-wider">Revenue</p>
          <p className="text-lg font-bold font-display">£42,180</p>
          <p className="text-[9px] text-emerald-600 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> +18% MoM</p>
        </div>
        <div className="rounded-lg bg-white border border-[hsl(220,13%,87%)] p-3">
          <p className="text-[9px] text-[hsl(220,10%,46%)] uppercase tracking-wider">Net Profit</p>
          <p className="text-lg font-bold font-display text-[hsl(172,66%,30%)]">£28,640</p>
          <p className="text-[9px] text-[hsl(220,10%,46%)]">68% margin</p>
        </div>
      </div>
      <div className="rounded-lg bg-white border border-[hsl(220,13%,87%)] p-3">
        <svg viewBox="0 0 200 60" className="w-full h-16">
          <defs>
            <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(172,66%,40%)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(172,66%,40%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,45 L25,38 L50,42 L75,28 L100,32 L125,20 L150,24 L175,12 L200,15 L200,60 L0,60 Z" fill="url(#pg)" />
          <path d="M0,45 L25,38 L50,42 L75,28 L100,32 L125,20 L150,24 L175,12 L200,15" fill="none" stroke="hsl(172,66%,40%)" strokeWidth="1.5" />
        </svg>
        <div className="flex justify-between text-[9px] text-[hsl(220,10%,46%)] mt-1">
          <span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
        </div>
      </div>
    </MockFrame>
  );
}

/* ---------- 9. Warranty Line ---------- */
export function WarrantyLineMock() {
  return (
    <MockFrame title="warrantyvault.co.uk/dealer/warranty-line">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-bold font-display flex items-center gap-2"><Phone className="w-4 h-4 text-[hsl(172,66%,40%)]" /> Warranty Line</h4>
          <p className="text-[10px] text-[hsl(220,10%,46%)] font-mono">0330 818 2240</p>
        </div>
        <span className="text-[9px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Live</span>
      </div>
      <div className="rounded-lg border border-[hsl(220,13%,87%)] bg-white p-3 mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,46%)] mb-2">Greeting</p>
        <p className="text-[11px] italic">"Welcome to Apex Motors warranty support. Your call is important to us…"</p>
        <div className="flex items-center gap-2 mt-2">
          <Volume2 className="w-3 h-3 text-[hsl(172,66%,40%)]" />
          <div className="flex-1 h-1 bg-[hsl(220,14%,92%)] rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-[hsl(172,66%,40%)]" />
          </div>
          <span className="text-[9px] text-[hsl(220,10%,46%)]">0:08 / 0:24</span>
        </div>
      </div>
      <div className="rounded-lg border border-[hsl(220,13%,87%)] bg-white p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,46%)] mb-2">IVR Menu</p>
        <div className="space-y-1.5">
          {[
            { k: "1", l: "New claim" },
            { k: "2", l: "Existing claim" },
            { k: "3", l: "General enquiry" },
          ].map(o => (
            <div key={o.k} className="flex items-center gap-2 text-[10px]">
              <span className="w-5 h-5 rounded bg-[hsl(172,66%,40%)] text-white flex items-center justify-center text-[10px] font-bold">{o.k}</span>
              <span>{o.l}</span>
              <ChevronRight className="w-3 h-3 ml-auto text-[hsl(220,10%,46%)]" />
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

/* ---------- 10. Cover Templates ---------- */
export function CoverTemplatesMock() {
  const tiers = [
    { name: "Bronze", price: "£12", items: 8, colour: "bg-amber-100 text-amber-700" },
    { name: "Silver", price: "£18", items: 14, colour: "bg-slate-200 text-slate-700", active: true },
    { name: "Gold", price: "£25", items: 22, colour: "bg-yellow-100 text-yellow-700" },
  ];
  return (
    <MockFrame title="warrantyvault.co.uk/dealer/cover-templates">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold font-display flex items-center gap-2"><FileText className="w-4 h-4 text-[hsl(172,66%,40%)]" /> Cover Templates</h4>
        <button className="text-[10px] font-semibold bg-[hsl(172,66%,40%)] text-white rounded-md px-2.5 py-1">+ New</button>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {tiers.map(t => (
          <div key={t.name} className={`rounded-lg p-3 border ${t.active ? "border-[hsl(172,66%,40%)] bg-[hsl(172,66%,40%)]/5" : "border-[hsl(220,13%,87%)] bg-white"}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${t.colour}`}>{t.name}</span>
              {t.active && <CheckCircle2 className="w-3 h-3 text-[hsl(172,66%,40%)]" />}
            </div>
            <p className="text-lg font-bold font-display">{t.price}<span className="text-[9px] font-normal text-[hsl(220,10%,46%)]">/mo</span></p>
            <p className="text-[9px] text-[hsl(220,10%,46%)] mt-1">{t.items} components covered</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-[hsl(220,13%,87%)] bg-white p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(220,10%,46%)] mb-2 flex items-center gap-1"><Sliders className="w-3 h-3" /> Financial guardrails</p>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div><span className="text-[hsl(220,10%,46%)]">Max labour rate</span><p className="font-semibold">£75/hr</p></div>
          <div><span className="text-[hsl(220,10%,46%)]">Per claim limit</span><p className="font-semibold">£1,500</p></div>
        </div>
      </div>
    </MockFrame>
  );
}

/* ---------- 11. Documents ---------- */
export function DocumentsMock() {
  const docs = [
    { name: "Policy Certificate.pdf", size: "248 KB", date: "12 Apr" },
    { name: "Warranty T&Cs v3.2.pdf", size: "412 KB", date: "08 Apr" },
    { name: "Claim Form.pdf", size: "92 KB", date: "01 Apr" },
    { name: "FCA Compliance Pack.pdf", size: "1.2 MB", date: "28 Mar" },
  ];
  return (
    <MockFrame title="warrantyvault.co.uk/dealer/documents">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold font-display flex items-center gap-2"><FolderOpen className="w-4 h-4 text-[hsl(172,66%,40%)]" /> Documents</h4>
        <button className="text-[10px] font-semibold bg-white border border-[hsl(220,13%,87%)] rounded-md px-2.5 py-1 flex items-center gap-1"><Upload className="w-3 h-3" /> Upload</button>
      </div>
      <div className="rounded-lg border border-[hsl(220,13%,87%)] overflow-hidden bg-white">
        {docs.map((d, i) => (
          <div key={d.name} className={`flex items-center gap-3 px-3 py-2.5 ${i > 0 ? "border-t border-[hsl(220,13%,87%)]" : ""}`}>
            <div className="w-7 h-7 rounded-md bg-[hsl(172,66%,40%)]/10 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-[hsl(172,66%,40%)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold truncate">{d.name}</p>
              <p className="text-[9px] text-[hsl(220,10%,46%)]">{d.size} · Updated {d.date}</p>
            </div>
            <Download className="w-3.5 h-3.5 text-[hsl(220,10%,46%)]" />
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

/* ---------- 12. Support ---------- */
export function SupportMock() {
  const tickets = [
    { ref: "#4821", subject: "Cover template question", status: "open" as const, last: "2h ago" },
    { ref: "#4815", subject: "Renewal email not sent", status: "review" as const, last: "1d ago" },
    { ref: "#4807", subject: "Add second user", status: "approved" as const, last: "3d ago" },
  ];
  return (
    <MockFrame title="warrantyvault.co.uk/dealer/support">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold font-display flex items-center gap-2"><Headphones className="w-4 h-4 text-[hsl(172,66%,40%)]" /> Support</h4>
        <button className="text-[10px] font-semibold bg-[hsl(172,66%,40%)] text-white rounded-md px-2.5 py-1">New ticket</button>
      </div>
      <div className="space-y-2">
        {tickets.map(t => (
          <div key={t.ref} className="rounded-lg border border-[hsl(220,13%,87%)] bg-white p-3 flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[hsl(172,66%,40%)]/10 flex items-center justify-center">
              <LifeBuoy className="w-3.5 h-3.5 text-[hsl(172,66%,40%)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold truncate">{t.ref} · {t.subject}</p>
              <p className="text-[9px] text-[hsl(220,10%,46%)]">Last reply {t.last}</p>
            </div>
            <StatusBadge status={t.status === "open" ? "pending" : t.status} />
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-[hsl(172,66%,40%)]/5 border border-[hsl(172,66%,40%)]/20 p-2.5 flex items-center gap-2">
        <Bell className="w-3.5 h-3.5 text-[hsl(172,66%,40%)]" />
        <p className="text-[10px]">Average response time: <span className="font-semibold">under 4 hours</span></p>
      </div>
    </MockFrame>
  );
}
