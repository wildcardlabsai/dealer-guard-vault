import {
  Shield, ClipboardCheck, UserCheck, BarChart3, Sparkles, Wallet, Phone,
  FileText, FolderOpen, Headphones, Gavel, CheckCircle2, Clock, AlertTriangle,
  TrendingUp, PoundSterling, Download,
  PhoneCall, Music, Voicemail, Plus, ChevronRight, Circle, MessageSquare
} from "lucide-react";

const TEAL = "hsl(172,66%,40%)";
const TEAL_DARK = "hsl(172,66%,32%)";

/**
 * Shared frame for all mocks — light "product screenshot" UI on a soft outer
 * gradient, designed to pop off the dark Features page background.
 */
function MockFrame({ children, gradient = "from-primary/20 via-primary/5 to-transparent" }: { children: React.ReactNode; gradient?: string }) {
  return (
    <div className="mock-halo">
      <div className={`feature-mock relative rounded-2xl p-3 bg-gradient-to-br ${gradient}`}>
        <div className="rounded-xl overflow-hidden bg-slate-900 shadow-[0_25px_50px_-12px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/20">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 bg-slate-950/60">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <div className="ml-3 text-[10px] text-slate-500 font-mono">warrantyvault.co.uk</div>
          </div>
          <div className="p-4 sm:p-5 text-slate-100 bg-slate-900">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ icon: Icon, label, value, accent = "text-[hsl(172,66%,40%)]" }: any) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={`w-3.5 h-3.5 ${accent}`} />
        <span className="text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
      </div>
      <div className="text-lg font-bold text-white font-display">{value}</div>
    </div>
  );
}

/* ============ Warranty Management ============ */
export function WarrantyManagementMock() {
  const rows = [
    { reg: "BD22 KXR", make: "BMW 320d", customer: "Mark Davies", status: "Active", days: 287, color: "bg-emerald-500/15 text-emerald-300" },
    { reg: "LK19 NHE", make: "Audi A4", customer: "Sarah Patel", status: "Active", days: 154, color: "bg-emerald-500/15 text-emerald-300" },
    { reg: "WP21 MTV", make: "VW Golf", customer: "James O'Connor", status: "Expiring", days: 12, color: "bg-amber-500/15 text-amber-300" },
    { reg: "GH20 RPL", make: "Ford Kuga", customer: "Emma Wilson", status: "Active", days: 198, color: "bg-emerald-500/15 text-emerald-300" },
    { reg: "RX18 BNT", make: "Mercedes A-Class", customer: "Daniel Hughes", status: "Claimed", days: 0, color: "bg-blue-500/15 text-blue-300" },
  ];
  return (
    <MockFrame gradient="from-emerald-400/30 via-primary/10 to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[hsl(172,66%,40%)]" />
          <h3 className="text-sm font-bold">Warranties</h3>
          <span className="text-[10px] text-slate-500">42 active</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-white text-[10px] font-semibold" style={{ background: TEAL }}>
          <Plus className="w-3 h-3" /> New Warranty
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatBlock icon={Shield} label="Active" value="42" />
        <StatBlock icon={Clock} label="Expiring" value="6" accent="text-amber-600" />
        <StatBlock icon={PoundSterling} label="Value" value="£12.6k" />
      </div>
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-white/5 text-[9px] uppercase tracking-wider text-slate-500">
          <div className="col-span-3">Vehicle</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-3 text-right">Expires in</div>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 px-3 py-2.5 text-[11px] border-t border-white/5 hover:bg-white/5">
            <div className="col-span-3">
              <div className="font-mono font-semibold text-white">{r.reg}</div>
              <div className="text-slate-500 text-[10px]">{r.make}</div>
            </div>
            <div className="col-span-3 text-slate-300 self-center">{r.customer}</div>
            <div className="col-span-3 self-center">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${r.color}`}>{r.status}</span>
            </div>
            <div className="col-span-3 text-right self-center text-slate-500">{r.days > 0 ? `${r.days} days` : "—"}</div>
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

/* ============ Customer Portal ============ */
export function CustomerPortalMock() {
  return (
    <MockFrame gradient="from-blue-400/30 via-primary/10 to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <UserCheck className="w-4 h-4 text-[hsl(172,66%,40%)]" />
        <h3 className="text-sm font-bold">Welcome back, Sarah</h3>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Your Vehicle</p>
            <p className="text-lg font-bold font-mono">LK19 NHE</p>
            <p className="text-xs text-slate-500">Audi A4 2.0 TDI · 2019</p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="4" fill="none" className="text-white/10" />
              <circle cx="32" cy="32" r="26" stroke={TEAL} strokeWidth="4" fill="none" strokeDasharray="163" strokeDashoffset="55" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-bold">154</span>
              <span className="text-[8px] text-slate-500">days</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
          <div>
            <p className="text-[10px] text-slate-500">Cover</p>
            <p className="text-xs font-medium">Gold Plus</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500">Expires</p>
            <p className="text-xs font-medium">14 Sept 2026</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[hsl(172,66%,40%)]/15 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-[hsl(172,66%,40%)]" />
          </div>
          <span className="text-[11px] font-medium">Submit a Claim</span>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-100 flex items-center justify-center">
            <Download className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <span className="text-[11px] font-medium">Certificate</span>
        </div>
      </div>
    </MockFrame>
  );
}

/* ============ Claims Management ============ */
export function ClaimsManagementMock() {
  const claims = [
    { ref: "CLM-2841", customer: "Mark Davies", issue: "Turbocharger failure", status: "Open", color: "bg-amber-500/15 text-amber-300", priority: "High" },
    { ref: "CLM-2840", customer: "Emma Wilson", issue: "Electrical fault", status: "Approved", color: "bg-emerald-500/15 text-emerald-300", priority: "Med" },
    { ref: "CLM-2839", customer: "Daniel Hughes", issue: "AC compressor", status: "Pending Info", color: "bg-blue-500/15 text-blue-300", priority: "Low" },
    { ref: "CLM-2838", customer: "Sarah Patel", issue: "Gearbox slipping", status: "Approved", color: "bg-emerald-500/15 text-emerald-300", priority: "High" },
  ];
  return (
    <MockFrame gradient="from-amber-400/30 via-primary/10 to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardCheck className="w-4 h-4 text-[hsl(172,66%,40%)]" />
        <h3 className="text-sm font-bold">Claims</h3>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatBlock icon={Clock} label="Open" value="3" accent="text-amber-600" />
        <StatBlock icon={CheckCircle2} label="Approved" value="18" />
        <StatBlock icon={PoundSterling} label="Paid Out" value="£4.2k" />
      </div>
      <div className="space-y-2">
        {claims.map(c => (
          <div key={c.ref} className="rounded-lg border border-white/10 bg-white/5 p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono text-slate-500">{c.ref}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${c.color}`}>{c.status}</span>
                <span className="text-[9px] text-slate-500">· {c.priority}</span>
              </div>
              <p className="text-xs font-medium truncate text-white">{c.issue}</p>
              <p className="text-[10px] text-slate-500">{c.customer}</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

/* ============ Claim Assist ============ */
export function ClaimAssistMock() {
  return (
    <MockFrame gradient="from-purple-400/30 via-primary/10 to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gavel className="w-4 h-4 text-[hsl(172,66%,40%)]" />
          <h3 className="text-sm font-bold">Claim Assist</h3>
          <span className="text-[10px] font-mono text-slate-500">CLM-2841</span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-500/15 text-amber-300">Triage: Investigate</span>
      </div>
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 mb-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5" />
          <div className="text-[11px]">
            <p className="font-semibold text-amber-300 mb-0.5">Triage Engine</p>
            <p className="text-slate-300 leading-relaxed">Turbocharger failure at 14k miles. Within CRA 6-month window. Recommend: request invoice + diagnostic report before decision.</p>
          </div>
        </div>
      </div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Checklist</p>
      <div className="space-y-1.5 mb-3">
        {[
          { done: true, label: "Customer details verified" },
          { done: true, label: "Warranty cover confirmed" },
          { done: false, label: "Garage diagnostic report" },
          { done: false, label: "Repair cost estimate" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px]">
            {item.done
              ? <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(172,66%,40%)]" />
              : <Circle className="w-3.5 h-3.5 text-slate-300" />}
            <span className={item.done ? "text-slate-500 line-through" : "text-white"}>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-md border border-white/10 bg-white py-2 text-center text-[10px] text-slate-300">Request Info</div>
        <div className="rounded-md border border-red-500/20 bg-red-500/10 py-2 text-center text-[10px] text-red-300">Reject</div>
        <div className="rounded-md py-2 text-center text-[10px] font-semibold text-white" style={{ background: TEAL }}>Approve</div>
      </div>
    </MockFrame>
  );
}

/* ============ Profit Tracking ============ */
export function ProfitTrackingMock() {
  const months = [42, 58, 51, 67, 72, 85];
  const payouts = [18, 22, 15, 28, 24, 31];
  const max = Math.max(...months);
  return (
    <MockFrame gradient="from-emerald-400/30 via-primary/15 to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-[hsl(172,66%,40%)]" />
        <h3 className="text-sm font-bold">Profit Tracking</h3>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatBlock icon={TrendingUp} label="Revenue" value="£12,840" />
        <StatBlock icon={PoundSterling} label="Paid Out" value="£3,940" accent="text-amber-600" />
        <StatBlock icon={CheckCircle2} label="Margin" value="69%" />
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Last 6 months</p>
          <div className="flex items-center gap-3 text-[9px] text-slate-400">
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-sm bg-[hsl(172,66%,45%)]" /> Revenue</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-sm bg-[hsl(38,92%,55%)]" /> Payouts</span>
          </div>
        </div>
        <div className="flex items-end gap-2 h-28">
          {months.map((m, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full">
              <div className="flex items-end gap-0.5 flex-1 w-full min-h-0">
                <div className="flex-1 rounded-t bg-[hsl(172,66%,45%)]" style={{ height: `${(m / max) * 100}%` }} />
                <div className="flex-1 rounded-t bg-[hsl(38,92%,55%)]" style={{ height: `${(payouts[i] / max) * 100}%` }} />
              </div>
              <span className="text-[8px] text-slate-500">{["May","Jun","Jul","Aug","Sep","Oct"][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

/* ============ DisputeIQ ============ */
export function DisputeIQMock() {
  return (
    <MockFrame gradient="from-purple-400/30 via-primary/15 to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-[hsl(172,66%,40%)]" />
        <h3 className="text-sm font-bold">DisputeIQ Analysis</h3>
        <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-[hsl(172,66%,40%)]/15 text-[hsl(172,66%,32%)] font-semibold">FREE</span>
      </div>
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 mb-3">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider">Medium Risk · CRA 6-Month Window</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">Customer purchased 4 months ago. Burden of proof sits with the dealer for inherent faults. Repair offered before refund is reasonable.</p>
      </div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Suggested Response · Helpful tone</p>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-[11px] text-slate-300 leading-relaxed mb-3">
        "Hi Mark, thank you for getting in touch about the issue with your BMW 320d. I'm sorry to hear about the turbo concern. As your warranty is active, we'd like to arrange an inspection at our authorised garage. Could you confirm your availability this week?"
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {["Helpful", "Firm", "Defensive", "De-escalate"].map((t, i) => (
          <div key={t} className={`text-center text-[9px] py-1.5 rounded-md border ${i === 0 ? "border-[hsl(172,66%,40%)] bg-[hsl(172,66%,40%)]/10 text-[hsl(172,66%,32%)] font-semibold" : "border-white/10 bg-white text-slate-500"}`}>
            {t}
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

/* ============ Warranty Fund ============ */
export function WarrantyFundMock() {
  return (
    <MockFrame gradient="from-emerald-400/30 via-primary/15 to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-4 h-4 text-[hsl(172,66%,40%)]" />
        <h3 className="text-sm font-bold">Warranty Fund</h3>
      </div>
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Health Score</p>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/15 text-emerald-300">HEALTHY</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold font-display text-white">82</p>
            <p className="text-[10px] text-slate-500">/ 100</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500">Balance</p>
            <p className="text-lg font-bold font-mono text-white">£8,900</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden border border-emerald-500/20">
          <div className="h-full" style={{ width: "82%", background: `linear-gradient(to right, #10b981, ${TEAL})` }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <StatBlock icon={TrendingUp} label="Buffer" value="2.3x" />
        <StatBlock icon={AlertTriangle} label="Exposure" value="£3,900" accent="text-amber-600" />
      </div>
      <div className="rounded-lg border border-[hsl(172,66%,40%)]/20 bg-[hsl(172,66%,40%)]/5 p-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-3 h-3 text-[hsl(172,66%,40%)]" />
          <p className="text-[10px] font-semibold text-[hsl(172,66%,32%)] uppercase tracking-wider">AI Recommendation</p>
        </div>
        <p className="text-[11px] text-slate-300">Increase contribution to £140/warranty to maintain 2.5x buffer ratio.</p>
      </div>
    </MockFrame>
  );
}

/* ============ Warranty Line ============ */
export function WarrantyLineMock() {
  return (
    <MockFrame gradient="from-blue-400/30 via-primary/15 to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <Phone className="w-4 h-4 text-[hsl(172,66%,40%)]" />
        <h3 className="text-sm font-bold">Warranty Line</h3>
        <span className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/15 text-emerald-300">ACTIVE</span>
      </div>
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 mb-3 text-center">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Your dedicated number</p>
        <p className="text-2xl font-bold font-mono text-white mb-1">0330 808 4127</p>
        <p className="text-[10px] text-slate-500">Forwards to: 07712 449 003</p>
      </div>
      <div className="space-y-2">
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <PhoneCall className="w-3.5 h-3.5 text-[hsl(172,66%,40%)]" />
            <p className="text-[11px] font-semibold">Greeting</p>
          </div>
          <p className="text-[10px] text-slate-500 italic">"Thanks for calling ABC Automotive warranty support. Press 1 to make a claim, 2 for cover questions, or 3 for general help."</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5 text-center">
            <Music className="w-3.5 h-3.5 text-slate-500 mx-auto mb-1" />
            <p className="text-[9px] text-slate-500">Hold Music</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5 text-center">
            <Voicemail className="w-3.5 h-3.5 text-slate-500 mx-auto mb-1" />
            <p className="text-[9px] text-slate-500">Voicemail</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5 text-center">
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 mx-auto mb-1" />
            <p className="text-[9px] text-slate-500">IVR Menu</p>
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

/* ============ Cover Templates ============ */
export function CoverTemplatesMock() {
  const tiers = [
    { name: "Bronze", price: "£89", bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-300", items: 12 },
    { name: "Silver", price: "£149", bg: "bg-white/[0.07]", border: "border-white/15", text: "text-slate-300", items: 24 },
    { name: "Gold", price: "£249", bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-300", items: 38 },
  ];
  return (
    <MockFrame gradient="from-yellow-400/30 via-primary/10 to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-[hsl(172,66%,40%)]" />
        <h3 className="text-sm font-bold">Cover Templates</h3>
        <span className="ml-auto text-[10px] text-slate-500">3 templates</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {tiers.map(t => (
          <div key={t.name} className={`rounded-xl border ${t.border} ${t.bg} p-3`}>
            <p className={`text-[10px] uppercase tracking-wider ${t.text} mb-1 font-semibold`}>{t.name}</p>
            <p className="text-base font-bold font-display mb-2 text-white">{t.price}</p>
            <div className="space-y-1">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-[hsl(172,66%,40%)]" />
                  <div className="h-1 flex-1 rounded-full bg-white/10 border border-white/10" />
                </div>
              ))}
            </div>
            <p className="text-[9px] text-slate-500 mt-2">{t.items} items covered</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Gold cover includes</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
          {["Engine & gearbox", "Turbocharger", "Air conditioning", "Electrical systems", "Cooling system", "Fuel injection"].map(x => (
            <div key={x} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-2.5 h-2.5 text-[hsl(172,66%,40%)]" />
              <span className="text-slate-300">{x}</span>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

/* ============ Documents ============ */
export function DocumentsMock() {
  const docs = [
    { name: "Warranty Certificate", type: "PDF", size: "248 KB", color: "bg-red-500/15 text-red-300" },
    { name: "Terms & Conditions", type: "PDF", size: "184 KB", color: "bg-red-500/15 text-red-300" },
    { name: "Claim Form Template", type: "DOCX", size: "92 KB", color: "bg-blue-500/15 text-blue-300" },
    { name: "FCA Compliance Notice", type: "PDF", size: "156 KB", color: "bg-red-500/15 text-red-300" },
    { name: "Vehicle Inspection Report", type: "DOCX", size: "118 KB", color: "bg-blue-500/15 text-blue-300" },
  ];
  return (
    <MockFrame gradient="from-orange-400/30 via-primary/10 to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <FolderOpen className="w-4 h-4 text-[hsl(172,66%,40%)]" />
        <h3 className="text-sm font-bold">Documents</h3>
      </div>
      <div className="space-y-2">
        {docs.map(d => (
          <div key={d.name} className="rounded-lg border border-white/10 bg-white/5 p-3 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center text-[9px] font-bold ${d.color}`}>
              {d.type}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate text-white">{d.name}</p>
              <p className="text-[10px] text-slate-500">{d.size}</p>
            </div>
            <Download className="w-3.5 h-3.5 text-slate-500" />
          </div>
        ))}
      </div>
    </MockFrame>
  );
}

/* ============ Support ============ */
export function SupportMock() {
  const tickets = [
    { ref: "TKT-104", subject: "How do I reset a customer password?", status: "Open", time: "2h ago", color: "bg-amber-500/15 text-amber-300" },
    { ref: "TKT-103", subject: "Bulk import warranties from CSV", status: "Resolved", time: "1d ago", color: "bg-emerald-500/15 text-emerald-300" },
    { ref: "TKT-102", subject: "Question about FCA exemption", status: "Resolved", time: "3d ago", color: "bg-emerald-500/15 text-emerald-300" },
  ];
  return (
    <MockFrame gradient="from-cyan-400/30 via-primary/10 to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-[hsl(172,66%,40%)]" />
          <h3 className="text-sm font-bold">Dealer Support</h3>
        </div>
        <div className="px-2.5 py-1 rounded-md text-white text-[10px] font-semibold flex items-center gap-1" style={{ background: TEAL }}>
          <Plus className="w-3 h-3" /> New Ticket
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatBlock icon={MessageSquare} label="Open" value="1" accent="text-amber-600" />
        <StatBlock icon={CheckCircle2} label="Resolved" value="14" />
        <StatBlock icon={Clock} label="Avg reply" value="2h" />
      </div>
      <div className="space-y-2">
        {tickets.map(t => (
          <div key={t.ref} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-slate-500">{t.ref}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${t.color}`}>{t.status}</span>
              <span className="ml-auto text-[10px] text-slate-500">{t.time}</span>
            </div>
            <p className="text-xs font-medium text-white">{t.subject}</p>
          </div>
        ))}
      </div>
    </MockFrame>
  );
}
