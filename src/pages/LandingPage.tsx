import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, ArrowRight, CheckCircle2, Star,
  Headphones, Sparkles, Wallet, ClipboardList,
  ChevronLeft, ChevronRight, TrendingUp, AlertTriangle,
  MessageSquare, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: "easeOut" } }),
};

const coreFeatures = [
  { icon: Shield, title: "Warranty Management", desc: "Set up and manage warranties without spreadsheets or guesswork" },
  { icon: Headphones, title: "Claim Assist", desc: "Handle claims from first report to decision in one place" },
  { icon: Sparkles, title: "DisputeIQ", desc: "Know what to do and what to say when complaints come in" },
  { icon: Wallet, title: "Warranty Fund", desc: "Track your money, understand your risk, and stay profitable" },
];

const testimonials = [
  { name: "Arjun K.", role: "Sales Director, Manchester", text: "Our team issues warranties in minutes now. No chasing providers and no spreadsheet mess." },
  { name: "Ben R.", role: "Independent Dealer, Bristol", text: "The customer portal has cut inbound calls and made us look far more professional." },
  { name: "Liam P.", role: "Used Car Dealer, Birmingham", text: "Switching to in-house warranties has increased our margins massively. WarrantyVault makes it simple." },
  { name: "Chris W.", role: "Dealer Group Ops, Newcastle", text: "WarrantyVault gives us speed, consistency, and better margins across the group." },
  { name: "Chloe M.", role: "Dealer Owner, Nottingham", text: "Profit tracking is brilliant. We can see exactly what each warranty is doing for the business." },
  { name: "Tom H.", role: "Franchise Dealer, Liverpool", text: "Setup was straightforward and we had it up quickly. It just fits how we work." },
  { name: "Nadia S.", role: "General Manager, Sheffield", text: "No monthly fee and full control made this an easy yes for us." },
  { name: "Sarah T.", role: "Dealer Principal, Leeds", text: "Claims are no longer a bottleneck. We decide quickly and customers get clear updates." },
];

const steps = [
  { num: "01", title: "Set up your warranties", desc: "Create warranties with vehicle data pulled in automatically" },
  { num: "02", title: "Manage claims in one place", desc: "Review, decide, and communicate — all from one screen" },
  { num: "03", title: "Use DisputeIQ when issues arise", desc: "Get guided responses before complaints escalate" },
  { num: "04", title: "Track your fund and profit", desc: "See your balance, exposure, and what to adjust" },
];

function TestimonialCarousel() {
  const [page, setPage] = useState(0);
  const perPage = 4;
  const totalPages = Math.ceil(testimonials.length / perPage);

  useEffect(() => {
    const timer = setInterval(() => setPage(p => (p + 1) % totalPages), 6000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const visible = testimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visible.map((t, i) => (
          <motion.div key={t.name} custom={i} initial="hidden" animate="visible" variants={fadeUp} className="rounded-xl p-5 border border-white/[0.08] bg-white/[0.05]">
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-[hsl(var(--cta))] text-[hsl(var(--cta))]" />)}
            </div>
            <p className="text-[15px] text-foreground/80 mb-4 leading-relaxed">"{t.text}"</p>
            <div>
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-5">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === page ? "bg-primary" : "bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
}

function HeroMock() {
  return (
    <motion.div
      className="relative w-full max-w-[480px] mx-auto"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
      style={{ perspective: "1200px" }}
    >
      {/* Glow layers */}
      <div className="absolute -inset-6 bg-primary/8 rounded-3xl blur-[50px] pointer-events-none" />
      <div className="absolute -inset-3 bg-[hsl(var(--cta))]/5 rounded-3xl blur-[30px] pointer-events-none" />

      <motion.div
        className="relative rounded-3xl border border-white/[0.08] bg-[hsl(222_30%_9%)]/90 backdrop-blur-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5),0_0_40px_-10px_hsl(172,66%,40%,0.1)] overflow-hidden"
        style={{ transform: "rotateX(2deg) rotateY(-2deg)", transformStyle: "preserve-3d" }}
      >
        {/* Top status bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold text-white/70 tracking-wide">WarrantyVault</span>
            <div className="flex items-center gap-1 ml-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] text-white/30">Live</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {[
              { label: "124 Warranties", color: "bg-primary/15 text-primary" },
              { label: "9 Claims", color: "bg-white/[0.06] text-white/50" },
              { label: "Healthy Fund", color: "bg-emerald-500/15 text-emerald-400/80" },
            ].map(p => (
              <span key={p.label} className={`text-[8px] font-medium px-1.5 py-0.5 rounded-full ${p.color}`}>{p.label}</span>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-[1.1fr_1fr] gap-2.5 p-3">
          {/* Left column */}
          <div className="space-y-2.5">
            {/* Warranty Fund card */}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-semibold text-white/50">Warranty Fund</span>
                </div>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium">Healthy</span>
              </div>
              <div className="text-[28px] font-bold text-white leading-none mb-0.5 tracking-tight">£12,450</div>
              <div className="text-[10px] text-emerald-400/70 mb-2.5">+£2,300 this month</div>
              <div className="text-[9px] text-white/25 mb-2">Buffer: £2,650</div>
              {/* Balance / Liability bars */}
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-[8px] text-white/30 mb-0.5">
                    <span>Balance</span><span>£12,450</span>
                  </div>
                  <div className="h-1 bg-white/[0.04] rounded-full">
                    <div className="h-full w-[78%] bg-primary/50 rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[8px] text-white/30 mb-0.5">
                    <span>Liability</span><span>£9,800</span>
                  </div>
                  <div className="h-1 bg-white/[0.04] rounded-full">
                    <div className="h-full w-[62%] bg-[hsl(var(--cta))]/40 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Claim Assist card */}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
              <div className="flex items-center gap-1.5 mb-2">
                <Headphones className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-semibold text-white/50">Claim Assist</span>
              </div>
              <div className="space-y-1 mb-2.5">
                <div className="flex justify-between text-[9px]">
                  <span className="text-white/30">Ref</span>
                  <span className="text-white/60 font-medium">CLM-1042</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span className="text-white/30">Issue</span>
                  <span className="text-white/60">Engine warning light</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span className="text-white/30">Status</span>
                  <span className="text-[hsl(var(--cta))]/80 font-medium">Awaiting review</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-1 text-[8px] font-medium text-primary bg-primary/10 px-2 py-1 rounded-full cursor-default">
                <ClipboardList className="w-2.5 h-2.5" />
                Review Claim
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-2.5">
            {/* DisputeIQ card */}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-semibold text-white/50">DisputeIQ</span>
                </div>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[hsl(var(--cta))]/15 text-[hsl(var(--cta))] font-medium">Medium Risk</span>
              </div>
              <div className="space-y-1.5 mb-2.5">
                <div className="flex items-start gap-1.5 text-[9px] text-white/50">
                  <div className="w-1 h-1 rounded-full bg-[hsl(var(--cta))]/50 mt-1 shrink-0" />
                  <span>Within 6 months of sale</span>
                </div>
                <div className="flex items-start gap-1.5 text-[9px] text-white/50">
                  <div className="w-1 h-1 rounded-full bg-primary/50 mt-1 shrink-0" />
                  <span>Inspect vehicle and offer repair if fault confirmed</span>
                </div>
              </div>
              <div className="rounded-lg bg-primary/[0.06] border border-primary/10 p-2 mb-2">
                <div className="text-[8px] text-primary/50 mb-0.5">Suggested reply</div>
                <div className="text-[9px] text-white/55 leading-relaxed">
                  "Thanks for getting in touch. We'd like to arrange an inspection to assess the issue properly."
                </div>
              </div>
              <span className="text-[8px] text-primary/60 font-medium cursor-default hover:text-primary/80 transition-colors">View full response →</span>
            </div>

            {/* Quick links mini cards */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { icon: Shield, label: "Cover\nBreakdown" },
                { icon: MessageSquare, label: "Complaint\nGuidance" },
                { icon: TrendingUp, label: "Profit\nTracking" },
              ].map(item => (
                <div key={item.label} className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-2 text-center cursor-default hover:bg-white/[0.05] transition-colors">
                  <item.icon className="w-3 h-3 text-primary/60 mx-auto mb-1" />
                  <div className="text-[7px] text-white/30 leading-tight whitespace-pre-line">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DisputeIQMock() {
  return (
    <div className="glass-card rounded-xl p-5 max-w-sm w-full">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium text-white/50">DisputeIQ Response</span>
      </div>
      <div className="space-y-2.5">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-[11px] text-white/30 mb-1">Customer complaint</div>
          <div className="text-xs text-white/60">"The gearbox failed after 3 weeks. I want a full refund."</div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="text-[11px] text-primary/70 mb-1">Your position</div>
          <div className="text-xs text-white/70">This falls within warranty coverage. A repair is the appropriate remedy under CRA 2015. A refund is not required at this stage.</div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="h-1 flex-1 bg-primary/30 rounded-full">
            <div className="h-full w-4/5 bg-primary rounded-full" />
          </div>
          <span className="text-[10px] text-primary/70">Strong position</span>
        </div>
      </div>
    </div>
  );
}

function FundMock() {
  return (
    <div className="glass-card rounded-xl p-5 max-w-xs w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white/40 font-medium">Fund Balance</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">Healthy</span>
      </div>
      <div className="text-3xl font-bold text-white mb-3">£4,280</div>
      <div className="space-y-2">
        {[
          { label: "Contributions", val: "£6,140", color: "bg-primary/40" },
          { label: "Claims paid", val: "£1,860", color: "bg-[hsl(var(--cta))]/40" },
        ].map(r => (
          <div key={r.label}>
            <div className="flex justify-between text-[11px] text-white/40 mb-1">
              <span>{r.label}</span><span>{r.val}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full">
              <div className={`h-full ${r.color} rounded-full`} style={{ width: r.label === "Contributions" ? "100%" : "30%" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const demoResponses: Record<string, { risk: string; riskColor: string; action: string; response: string; legal: string }> = {
  "engine-under30-sudden": { risk: "High", riskColor: "text-[hsl(var(--cta))]", action: "Inspect and repair under warranty. Likely covered.", response: "Thanks for getting in touch. We take this seriously and would like to arrange an inspection at our earliest convenience to assess the issue properly.", legal: "Consumer Rights Act 2015 — fault within 30 days may entitle rejection or repair." },
  "engine-under30-wear": { risk: "Medium", riskColor: "text-[hsl(var(--cta))]", action: "Inspect vehicle. Wear and tear within 30 days is unusual — assess carefully.", response: "Thank you for contacting us. We'd like to inspect the vehicle to understand the issue before confirming next steps.", legal: "Wear and tear within 30 days is uncommon. Inspection recommended." },
  "engine-under30-unknown": { risk: "Medium", riskColor: "text-[hsl(var(--cta))]", action: "Arrange independent inspection to determine fault type.", response: "Thanks for your message. We'd like to arrange an independent inspection to determine the nature of the issue.", legal: "Burden of proof is on the dealer within 6 months of sale." },
  "engine-6months-sudden": { risk: "Medium", riskColor: "text-[hsl(var(--cta))]", action: "Offer inspection and repair if fault is confirmed.", response: "Thank you for letting us know. We'd like to book the vehicle in for inspection so we can assess the fault and discuss options.", legal: "Within 6 months, fault is presumed present at sale unless proven otherwise." },
  "engine-6months-wear": { risk: "Low", riskColor: "text-primary", action: "Inspect. Wear and tear is generally not covered.", response: "Thanks for getting in touch. We'll arrange an inspection to assess whether this is a manufacturing fault or general wear.", legal: "Wear and tear is not typically covered under CRA 2015." },
  "engine-6months-unknown": { risk: "Medium", riskColor: "text-[hsl(var(--cta))]", action: "Independent inspection recommended.", response: "We appreciate you raising this. We'd like to arrange an independent assessment to determine the nature of the fault.", legal: "Within 6 months — burden of proof on dealer." },
  "engine-over6-sudden": { risk: "Low", riskColor: "text-primary", action: "Customer must prove fault existed at point of sale.", response: "Thank you for contacting us. We'd recommend an independent inspection report to support your claim, as the vehicle is outside the 6-month period.", legal: "After 6 months, burden of proof shifts to the consumer." },
  "engine-over6-wear": { risk: "Low", riskColor: "text-primary", action: "Wear and tear after 6 months is expected. Unlikely to be covered.", response: "Thanks for your message. Wear and tear after this period is generally expected and not typically covered.", legal: "Wear and tear is not a fault under CRA 2015." },
  "engine-over6-unknown": { risk: "Low", riskColor: "text-primary", action: "Request independent inspection from customer.", response: "We'd suggest obtaining an independent report to confirm the nature of the fault before we can assess further.", legal: "After 6 months, consumer must prove fault was present at sale." },
  "gearbox-under30-sudden": { risk: "High", riskColor: "text-[hsl(var(--cta))]", action: "Inspect immediately. Likely requires repair or replacement under warranty.", response: "We're sorry to hear about this. We'd like to arrange an urgent inspection to assess the gearbox and discuss the appropriate resolution.", legal: "Sudden gearbox failure within 30 days — strong consumer position." },
  "gearbox-under30-wear": { risk: "Medium", riskColor: "text-[hsl(var(--cta))]", action: "Unusual for gearbox wear within 30 days. Inspect thoroughly.", response: "Thanks for letting us know. We'll arrange an inspection to assess the gearbox.", legal: "Wear within 30 days may indicate pre-sale issue." },
  "gearbox-under30-unknown": { risk: "High", riskColor: "text-[hsl(var(--cta))]", action: "Inspect and diagnose. Dealer bears burden of proof.", response: "Thank you for raising this. We'll arrange a full diagnostic to determine the cause.", legal: "Within 30 days — burden on dealer." },
  "gearbox-6months-sudden": { risk: "Medium", riskColor: "text-[hsl(var(--cta))]", action: "Offer inspection and repair if fault confirmed.", response: "Thank you for letting us know. We'd like to arrange an inspection to assess the gearbox fault.", legal: "Within 6 months — fault presumed present at sale." },
  "gearbox-6months-wear": { risk: "Low", riskColor: "text-primary", action: "Inspect. Gearbox wear may not be covered.", response: "We'll inspect the vehicle to determine the cause and advise accordingly.", legal: "Wear and tear generally not covered." },
  "gearbox-6months-unknown": { risk: "Medium", riskColor: "text-[hsl(var(--cta))]", action: "Independent inspection recommended.", response: "We'd like to arrange an assessment to understand the issue before confirming our position.", legal: "Burden of proof on dealer within 6 months." },
  "gearbox-over6-sudden": { risk: "Low", riskColor: "text-primary", action: "Customer to provide independent report.", response: "Thank you for contacting us. We'd recommend an independent inspection to support your claim.", legal: "After 6 months — consumer must prove fault existed at sale." },
  "gearbox-over6-wear": { risk: "Low", riskColor: "text-primary", action: "Wear and tear after 6 months is expected.", response: "Gearbox wear over this period is generally considered normal usage.", legal: "Wear and tear is not a manufacturing fault." },
  "gearbox-over6-unknown": { risk: "Low", riskColor: "text-primary", action: "Request independent inspection.", response: "We'd suggest an independent report to confirm the issue before we can advise further.", legal: "Consumer must prove fault after 6 months." },
  "electrical-under30-sudden": { risk: "High", riskColor: "text-[hsl(var(--cta))]", action: "Inspect immediately. Strong consumer rights apply.", response: "We're sorry about this issue. We'd like to inspect the vehicle as soon as possible to identify and resolve the electrical fault.", legal: "Electrical fault within 30 days — strong position for consumer." },
  "electrical-under30-wear": { risk: "Medium", riskColor: "text-[hsl(var(--cta))]", action: "Inspect. Electrical wear within 30 days is uncommon.", response: "Thanks for letting us know. We'll arrange an inspection to assess the electrical system.", legal: "Unusual wear within 30 days may indicate pre-sale issue." },
  "electrical-under30-unknown": { risk: "High", riskColor: "text-[hsl(var(--cta))]", action: "Inspect and diagnose. Dealer bears burden of proof.", response: "Thank you for raising this. We'll arrange a full diagnostic to determine the cause.", legal: "Within 30 days — burden on dealer." },
  "electrical-6months-sudden": { risk: "Medium", riskColor: "text-[hsl(var(--cta))]", action: "Offer diagnostic and repair if fault confirmed.", response: "We'd like to arrange a diagnostic to understand the electrical issue and discuss options.", legal: "Within 6 months — fault presumed present at sale." },
  "electrical-6months-wear": { risk: "Low", riskColor: "text-primary", action: "Inspect. Electrical wear may not be covered.", response: "We'll inspect the vehicle to determine whether this is a fault or general wear.", legal: "Wear and tear generally not covered under CRA." },
  "electrical-6months-unknown": { risk: "Medium", riskColor: "text-[hsl(var(--cta))]", action: "Arrange diagnostic inspection.", response: "Thanks for contacting us. We'll arrange a full diagnostic to establish the cause.", legal: "Within 6 months — dealer burden of proof." },
  "electrical-over6-sudden": { risk: "Low", riskColor: "text-primary", action: "Customer to provide independent diagnosis.", response: "Thank you. We'd recommend an independent diagnostic report to support your claim.", legal: "After 6 months — consumer must prove pre-existing fault." },
  "electrical-over6-wear": { risk: "Low", riskColor: "text-primary", action: "Electrical wear after 6 months is expected.", response: "Electrical component wear over this period is generally considered normal and not typically covered.", legal: "Wear and tear is not a fault." },
  "electrical-over6-unknown": { risk: "Low", riskColor: "text-primary", action: "Request independent diagnostic.", response: "We'd suggest an independent diagnostic to confirm the issue before we can advise further.", legal: "Consumer must prove fault after 6 months." },
};

function LiveDemoSection() {
  const [issue, setIssue] = useState("engine");
  const [time, setTime] = useState("under30");
  const [fault, setFault] = useState("sudden");
  const [result, setResult] = useState<(typeof demoResponses)[string] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const key = `${issue}-${time}-${fault}`;
      setResult(demoResponses[key] || demoResponses["engine-6months-sudden"]);
      setLoading(false);
    }, 800);
  };

  const radioGroup = (label: string, options: { value: string; label: string }[], selected: string, onChange: (v: string) => void) => (
    <div>
      <label className="text-xs font-medium text-white/40 mb-2 block">{label}</label>
      <div className="space-y-1.5">
        {options.map(o => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-all ${
              selected === o.value
                ? "border-primary/40 bg-primary/10 text-white"
                : "border-white/[0.06] bg-white/[0.02] text-white/50 hover:bg-white/[0.04] hover:text-white/70"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-16 px-6 bg-secondary/20">
      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">See how it works in seconds</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">Try a real example of how WarrantyVault helps you respond properly</p>
        </motion.div>

        <motion.div
          className="glass-card-strong rounded-2xl overflow-hidden relative"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-[hsl(var(--cta))]/5 rounded-full blur-[60px] pointer-events-none" />

          <div className="grid md:grid-cols-2 relative">
            {/* Left — inputs */}
            <div className="p-6 sm:p-8 border-r border-white/[0.06] space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-white/50 tracking-wide uppercase">DisputeIQ Demo</span>
              </div>

              {radioGroup("Customer issue", [
                { value: "engine", label: "Engine fault" },
                { value: "gearbox", label: "Gearbox issue" },
                { value: "electrical", label: "Electrical fault" },
              ], issue, setIssue)}

              {radioGroup("Time since purchase", [
                { value: "under30", label: "Under 30 days" },
                { value: "6months", label: "30 days – 6 months" },
                { value: "over6", label: "Over 6 months" },
              ], time, setTime)}

              {radioGroup("Fault type", [
                { value: "sudden", label: "Sudden failure" },
                { value: "wear", label: "Wear and tear" },
                { value: "unknown", label: "Unknown" },
              ], fault, setFault)}

              <Button onClick={handleGenerate} disabled={loading} className="btn-cta rounded-full w-full h-10 text-sm shadow-[0_0_20px_-4px_hsl(24,100%,50%,0.3)]">
                {loading ? "Analysing…" : "Get Recommendation"}
                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </div>

            {/* Right — output */}
            <div className="p-6 sm:p-8 flex flex-col justify-center min-h-[400px]">
              {!result && !loading && (
                <div className="text-center text-white/20">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-white/10" />
                  <p className="text-sm">Select a scenario and click<br />"Get Recommendation"</p>
                </div>
              )}

              {loading && (
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-white/30">Analysing scenario…</p>
                </div>
              )}

              {result && !loading && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Risk Level</span>
                    <span className={`text-sm font-bold ${result.riskColor}`}>{result.risk}</span>
                  </div>

                  <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                    <div className="text-[10px] text-white/30 mb-1 uppercase tracking-wide">Legal context</div>
                    <p className="text-xs text-white/60 leading-relaxed">{result.legal}</p>
                  </div>

                  <div className="rounded-lg bg-primary/[0.06] border border-primary/15 p-3">
                    <div className="text-[10px] text-primary/60 mb-1 uppercase tracking-wide">Recommended action</div>
                    <p className="text-sm text-white/70 leading-relaxed">{result.action}</p>
                  </div>

                  <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                    <div className="text-[10px] text-white/30 mb-1 uppercase tracking-wide">Suggested response</div>
                    <p className="text-sm text-white/60 leading-relaxed italic">"{result.response}"</p>
                  </div>

                  <div className="pt-1">
                    <Button variant="outline" size="sm" className="rounded-full text-xs border-white/10 text-white/50 hover:bg-white/5 hover:text-white bg-transparent" asChild>
                      <Link to="/signup">Try DisputeIQ with your own claims <ArrowRight className="ml-1.5 w-3 h-3" /></Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[hsl(222_30%_6%)]">
      <SEOHead
        title="Self-Funded Car Warranty Software for UK Dealers | WarrantyVault"
        description="Run self-funded warranties properly. Manage claims, handle complaints, and stay in control of your risk and profit — built for UK independent car dealers."
        canonical="https://dealer-guard-vault.lovable.app/"
      />

      <PublicNav />

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute top-10 right-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-[5%] w-[300px] h-[300px] bg-[hsl(var(--cta))]/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative pt-28 pb-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.p
                className="text-xs text-white/50 font-semibold tracking-[0.2em] uppercase mb-5"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              >
                Built specifically for UK independent car dealers
              </motion.p>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white leading-[1.05] mb-5"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
              >
                Run Your Own Warranties<br />— Properly<span className="text-[hsl(var(--cta))]">.</span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg text-white/45 max-w-md mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
              >
                Manage self-funded warranties with confidence. Handle claims, respond to complaints correctly, and stay in control of your risk and profit — all in one place.
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
                <Button size="lg" className="btn-cta text-base px-10 rounded-full h-13 shadow-[0_0_24px_-4px_hsl(24,100%,50%,0.4)]" asChild>
                  <Link to="/signup">Start Free — No Monthly Fees <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="text-sm px-8 rounded-full h-13 border-white/[0.1] text-white/50 hover:bg-white/[0.04] hover:text-white bg-transparent" asChild>
                  <a href="#how-it-works">See How It Works</a>
                </Button>
              </motion.div>

              <motion.p className="text-xs text-white/25 mt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                No monthly fees · First 5 warranties free · £15 per warranty after that
              </motion.p>
            </div>

            <div className="hidden lg:flex justify-center">
              <HeroMock />
            </div>
          </div>
        </div>

        <div className="relative left-1/2 w-screen -translate-x-1/2 -mb-px">
    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="block h-[60px] w-full" preserveAspectRatio="none">
            <path d="M0,50 C220,78 470,78 720,58 C980,36 1170,30 1440,55 L1440,80 L0,80 Z" fill="hsl(222 28% 10%)" />
          </svg>
        </div>
      </section>

      {/* Hook / Problem */}
      <section className="bg-[hsl(222_28%_10%)]">
        <motion.div className="max-w-2xl mx-auto text-center px-6 pt-14 pb-14" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white leading-[1.15] tracking-[-0.02em] mb-6">
            Most dealers want to run their own warranties…<br />
            <span className="text-white/35">but don't have the system to do it properly</span>
          </h2>
          <div className="text-left max-w-sm mx-auto mb-6 space-y-2.5">
            <p className="text-white/40 text-sm">So what happens?</p>
            {["Claims get messy", "Complaints escalate", "Dealers aren't sure what to say", "Money isn't tracked properly"].map(item => (
              <div key={item} className="flex items-center gap-3 text-white/40 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive/50 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
            <p className="text-white/25 text-xs pt-1">And suddenly it becomes more stress than it's worth.</p>
          </div>
          <p className="text-lg font-semibold font-display text-primary">WarrantyVault fixes that.</p>
        </motion.div>
        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      </section>

      {/* DisputeIQ Seller */}
      <section className="py-20 px-6 bg-[hsl(222_30%_6%)] relative border-t border-[hsl(var(--cta))]/[0.08]">
        <div className="absolute top-0 right-[10%] w-[300px] h-[300px] bg-[hsl(var(--cta))]/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <motion.div className="rounded-2xl p-8 sm:p-10 relative overflow-hidden border border-[hsl(var(--cta))]/10 bg-[hsl(222_28%_9%)] shadow-[0_0_40px_-12px_hsl(24,100%,50%,0.06)]" initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-[hsl(var(--cta))]/[0.04] rounded-full blur-[80px] pointer-events-none" />
            <div className="grid lg:grid-cols-2 gap-8 items-center relative">
              <div>
                <Sparkles className="w-7 h-7 text-[hsl(var(--cta))] mb-3" />
                <h2 className="text-2xl sm:text-3xl font-bold font-display mb-3">Not sure how to respond to a complaint?</h2>
                <p className="text-white/40 text-base mb-6 max-w-md">
                  DisputeIQ guides you through the situation and helps you send the right response — before things escalate.
                </p>
                <div className="space-y-2.5 mb-6">
                  {["Understand your position instantly", "Get clear next steps", "Send professional responses with confidence"].map(item => (
                    <div key={item} className="flex items-center gap-2.5 text-sm text-white/60">
                      <CheckCircle2 className="w-4 h-4 text-[hsl(var(--cta))]/70 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Button className="btn-cta rounded-full px-7 h-10 text-sm shadow-[0_0_16px_-4px_hsl(24,100%,50%,0.3)]" asChild>
                  <Link to="/disputeiq">See how DisputeIQ works <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </div>
              <div className="hidden lg:flex justify-center">
                <DisputeIQMock />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Live Demo */}
      <LiveDemoSection />

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Core Features — 4 cards */}
      <section className="py-16 px-6 bg-[hsl(222_28%_10%)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">Everything you need. Nothing you don't.</h2>
            <p className="text-white/35 text-sm max-w-md mx-auto">Four focused tools to run self-funded warranties properly.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {coreFeatures.map((f, i) => (
              <motion.div key={f.title} className="rounded-xl p-6 border border-white/[0.08] bg-white/[0.05] hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-[0_0_24px_-8px_hsl(172,66%,40%,0.1)] transition-all duration-300 group" custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold font-display mb-1.5 text-white/80">{f.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" className="rounded-full px-7 h-10 text-sm border-white/[0.08] text-white/50 hover:bg-white/[0.04] hover:text-white bg-transparent" asChild>
              <Link to="/features">See all features <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Differentiator */}
      <section className="py-16 px-6 bg-[hsl(222_30%_6%)]">
        <motion.div className="max-w-2xl mx-auto text-center" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl sm:text-3xl font-bold font-display mb-4">This isn't just warranty software</h2>
          <p className="text-white/35 mb-6 text-base max-w-md mx-auto">Most systems help you <strong className="text-white/60">log claims</strong>. WarrantyVault helps you:</p>
          <div className="grid sm:grid-cols-2 gap-3 max-w-md mx-auto text-left mb-8">
            {[
              "Understand your position",
              "Avoid saying the wrong thing",
              "Stay in control financially",
              "Run warranties properly end to end",
            ].map(item => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-white/60">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-sm italic">The system dealers wish they had before things go wrong.</p>
        </motion.div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Warranty Fund */}
      <section className="py-20 px-6 bg-[hsl(222_28%_10%)] relative border-t border-primary/[0.08]">
        <div className="absolute bottom-0 left-[5%] w-[250px] h-[250px] bg-primary/[0.03] rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <motion.div className="grid lg:grid-cols-2 gap-8 items-center" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div>
              <Wallet className="w-7 h-7 text-primary mb-3" />
              <h2 className="text-2xl sm:text-3xl font-bold font-display mb-4">Know exactly where you stand financially</h2>
              <p className="text-white/40 text-base mb-6 max-w-md">Running your own warranties shouldn't feel risky. WarrantyVault shows you:</p>
              <div className="space-y-2.5 mb-6">
                {["How much you've got set aside", "Your real exposure", "Whether you're underfunding", "What to adjust"].map(item => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-white/60">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/40 font-medium">Run warranties with confidence, not guesswork.</p>
            </div>
            <div className="hidden lg:flex justify-center">
              <FundMock />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6 bg-[hsl(222_30%_6%)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">How it works</h2>
            <p className="text-white/35 text-sm">Four steps. No complexity.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {steps.map((s, i) => (
              <motion.div key={s.num} className="rounded-xl p-6 border border-white/[0.08] bg-white/[0.05]" custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <span className="text-2xl font-bold font-display text-primary/25 mb-2 block">{s.num}</span>
                <h3 className="text-base font-semibold font-display mb-1.5 text-white/70">{s.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-[hsl(222_28%_10%)] relative border-t border-primary/[0.08]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">Simple, transparent pricing</h2>
          <p className="text-white/35 text-sm mb-8">No monthly fees. No contracts. Pay only when you issue a warranty.</p>
          <motion.div className="rounded-2xl p-8 sm:p-10 relative overflow-hidden border border-primary/15 bg-[hsl(222_28%_9%)] shadow-[0_0_40px_-12px_hsl(172,66%,40%,0.08)]" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="absolute top-0 right-0 w-44 h-44 bg-primary/[0.05] rounded-full blur-[80px] pointer-events-none" />
            <div className="relative">
              <p className="text-5xl sm:text-6xl font-bold font-display mb-0.5 text-white">£0<span className="text-xl text-white/30 font-normal">/month</span></p>
              <p className="text-lg font-semibold font-display mb-1.5 text-white/80">Only £15 per warranty</p>
              <p className="text-sm text-[hsl(var(--cta))] font-semibold mb-1">🎉 First 5 warranties FREE</p>
              <p className="text-white/25 text-xs mb-6 max-w-xs mx-auto">No contracts. No risk. Cancel anytime.</p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 max-w-xs mx-auto mb-6">
                {["No monthly fees", "No contracts", "Pay only when you use it", "Scale as you grow"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-white/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/[0.03] rounded-lg p-3 mb-6 max-w-xs mx-auto border border-white/[0.06]">
                <p className="text-xs text-white/40">
                  Optional add-on: <Link to="/warranty-line" className="font-semibold text-[hsl(var(--cta))] hover:underline">Dedicated Warranty Line — £25/month</Link>.
                </p>
              </div>

              <Button size="lg" className="btn-cta rounded-full px-10 h-12 shadow-[0_0_24px_-4px_hsl(24,100%,50%,0.4)]" asChild>
                <Link to="/signup">Start Free Today</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Testimonials */}
      <section className="py-16 px-6 bg-[hsl(222_30%_6%)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">Trusted by UK dealers</h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Final CTA */}
      <section className="hero-gradient pt-16 pb-14 px-6 relative">
        <div className="absolute top-0 left-[15%] w-[300px] h-[200px] bg-primary/[0.04] rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-3">Run your own warranties with confidence</h2>
          <p className="text-white/35 mb-3 text-base">No monthly fees. No unnecessary complexity. Just a system that works.</p>
          <p className="text-sm text-[hsl(var(--cta))] font-semibold mb-8">Start with 5 free warranties — no risk</p>
          <Button size="lg" className="btn-cta rounded-full px-14 text-base h-14 shadow-[0_0_30px_-4px_hsl(24,100%,50%,0.4)]" asChild>
            <Link to="/signup">Start Free Today <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
          <p className="text-xs text-white/20 mt-4">First 5 warranties free · £15 per warranty after that</p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
