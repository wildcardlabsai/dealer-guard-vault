import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, Car, Search, ArrowRight, CheckCircle2, ChevronRight, X,
  TrendingUp, BarChart3, FileCheck, UserCheck, ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/warrantylogo.png";
import SEOHead from "@/components/SEOHead";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

const features = [
  { icon: Shield, title: "Warranty Management", desc: "Create, edit and track all warranties in one place with full visibility." },
  { icon: FileCheck, title: "Branded Certificates", desc: "Generate professional, branded warranty certificates instantly." },
  { icon: Search, title: "DVLA Lookup", desc: "Enter a reg and instantly pull vehicle data — no manual input needed." },
  { icon: UserCheck, title: "Customer Portal", desc: "Give customers their own login to view warranties, download documents and submit claims." },
  { icon: ClipboardCheck, title: "Claims Management", desc: "Handle claims your way — approve, reject or request more info in seconds." },
  { icon: BarChart3, title: "Profit Tracking", desc: "See exactly what you're making from warranties vs what you're paying out." },
];

const steps = [
  { num: "01", title: "Sign up & get approved", desc: "Submit your details and get approved within 24 hours." },
  { num: "02", title: "Add a warranty", desc: "Enter the reg, customer details, and issue a warranty in seconds." },
  { num: "03", title: "Manage claims", desc: "Approve, reject or review — no delays, no third parties." },
  { num: "04", title: "Track performance", desc: "See profit, activity and claims data in real-time." },
];

const comparisonRows = [
  { label: "Margins", left: "Reduced by external fees", right: "Kept in-house — higher profit per deal" },
  { label: "Claim Decisions", left: "Delayed by third-party queues", right: "Same-day decisions in your dashboard" },
  { label: "Control", left: "Limited rules and visibility", right: "Full control over approvals and payouts" },
  { label: "Dependency", left: "Provider outages and handoffs", right: "Fully in-house process you control" },
];

const problemCards = [
  "You lose margin on every deal you sell a warranty",
  "Claims take too long to get approved",
  "You rely on third parties to look after your customers",
  "Customers blame you when things go wrong anyway",
  "No clear view of your profit vs payouts",
  "You're paying for a service you could run yourself",
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Self-Funded Warranty Features & Comparison | WarrantyVault"
        description="Compare self-funded warranties vs third-party providers. See how WarrantyVault gives UK dealers full control, higher margins, and faster claim decisions."
        canonical="https://dealer-guard-vault.lovable.app/features"
      />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[hsl(var(--hero-bg))]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link to="/"><img src={logo} alt="WarrantyVault" className="h-10" /></Link>
          <div className="hidden md:flex items-center gap-10 text-[15px] text-white/70">
            <Link to="/features" className="text-white transition-colors">Features</Link>
            <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10 text-[15px]" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button size="sm" className="btn-cta rounded-full px-6 text-[15px] h-10" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Platform Features</span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-white mb-4">Everything you need to run warranties in-house</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">Built for UK dealers who want higher margins, faster claim decisions, and fewer admin headaches.</p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <motion.span className="text-[hsl(var(--cta))] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>The Problem</motion.span>
            <motion.h2 className="text-3xl sm:text-4xl font-bold font-display mb-4 leading-tight" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              Warranty providers are costing you more than you think
            </motion.h2>
            <motion.p className="text-muted-foreground max-w-xl mx-auto" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              Every delay, every fee, and every handoff eats into your profit.
            </motion.p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {problemCards.map((issue, i) => (
              <motion.div key={issue} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-card rounded-xl p-5 flex items-start gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-[hsl(var(--cta))]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--cta))]" />
                </div>
                <span className="text-sm leading-relaxed">{issue}</span>
              </motion.div>
            ))}
          </div>
          <motion.div className="text-center" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-3 glass-card-strong rounded-2xl px-8 py-5">
              <TrendingUp className="w-6 h-6 text-primary" />
              <div className="text-left">
                <p className="text-lg font-bold font-display">There's a better way to run warranties.</p>
                <p className="text-sm text-muted-foreground">Keep an extra £300–£800 per deal by managing warranties in-house.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Dealer Dashboard</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Built for how dealers actually work</h2>
              <p className="text-muted-foreground mb-8">Most warranty systems are built for providers — not dealers. WarrantyVault is designed for dealerships who want control, speed and better margins without the hassle.</p>
              <div className="space-y-3 mb-8">
                {["Pay only when you use it", "No monthly fees", "No risk to get started", "Customer portal included from day one"].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="btn-cta rounded-full px-8 h-12" asChild>
                <Link to="/signup">Sign Up <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-3">No monthly fees. £19 per warranty.</p>
            </div>
            <div className="bg-[hsl(222,25%,10%)] border border-white/8 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] text-white/30 font-mono">dealer-dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold font-display text-primary">£0</p>
                  <p className="text-[10px] text-white/40 mt-0.5">Monthly Fee</p>
                </div>
                <div className="bg-[hsl(222,20%,14%)] border border-white/5 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold font-display text-white">£19</p>
                  <p className="text-[10px] text-white/40 mt-0.5">Per Warranty</p>
                </div>
                <div className="bg-[hsl(222,20%,14%)] border border-white/5 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold font-display text-white">47</p>
                  <p className="text-[10px] text-white/40 mt-0.5">Active</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { reg: "AB12 CDE", car: "BMW 320d M Sport", status: "Active" },
                  { reg: "CD34 FGH", car: "Audi A4 S Line", status: "Active" },
                  { reg: "GH78 LMN", car: "VW Golf R", status: "Expired" },
                ].map(w => (
                  <div key={w.reg} className="flex items-center justify-between p-3 bg-[hsl(222,20%,12%)] border border-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <code className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-mono tracking-wider">{w.reg}</code>
                      <span className="text-sm text-white/80">{w.car}</span>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${w.status === "Active" ? "bg-primary/10 text-primary" : "bg-white/5 text-white/30"}`}>{w.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Core Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Everything you need to stay in control</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group" custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold font-display mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Dealer Comparison</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">See the difference in one glance</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Built to make profit and control obvious, not hidden in paperwork and provider delays.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-semibold font-display text-muted-foreground">With Warranty Providers</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-destructive/10 text-destructive px-3 py-1 rounded-full">Less Control</span>
              </div>
              <div className="space-y-3">
                {comparisonRows.map(row => (
                  <div key={row.label} className="glass-card rounded-xl p-5">
                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/60 mb-2">{row.label}</p>
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-destructive flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{row.left}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-semibold font-display">With WarrantyVault</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full">Higher Margin</span>
              </div>
              <div className="space-y-3">
                {comparisonRows.map(row => (
                  <div key={row.label} className="glass-card rounded-xl p-5 border-primary/20 bg-primary/[0.03]">
                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-primary/70 mb-2">{row.label}</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{row.right}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">How It Works</h2>
            <p className="text-muted-foreground">Get up and running fast with no risk.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={s.num} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center relative">
                <div className="text-4xl font-bold font-display gradient-text mb-3">{s.num}</div>
                <h3 className="font-semibold font-display mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < 3 && <ChevronRight className="hidden lg:block absolute top-8 -right-3 w-5 h-5 text-muted-foreground/30" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">Ready to take control?</h2>
          <p className="text-white/50 mb-8 text-lg">Join dealers who are keeping more profit and running warranties their way.</p>
          <Button size="lg" className="btn-cta rounded-full px-10 text-base h-12" asChild>
            <Link to="/signup">Sign Up <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
          <p className="text-xs text-white/30 mt-5">No monthly fees. £19 per warranty.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 hero-gradient">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/"><img src={logo} alt="WarrantyVault" className="h-6 opacity-60" /></Link>
          <p className="text-xs text-muted-foreground">Built by <span className="text-foreground font-medium">Wildcard Labs</span></p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
