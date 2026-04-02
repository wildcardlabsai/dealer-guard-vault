import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, Car, Users, FileText, Search, Award, ClipboardCheck,
  ArrowRight, CheckCircle2, Star, ChevronRight, X, Zap, TrendingUp,
  BarChart3, FileCheck, UserCheck, PoundSterling, Clock, Settings, AlertTriangle,
  Phone, PhoneCall, Headphones, Music, MessageSquare, PhoneForwarded
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/warrantylogo.png";

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

const problemCards = [
  "You lose margin on every deal you sell a warranty",
  "Claims take too long to get approved",
  "You rely on third parties to look after your customers",
  "Customers blame you when things go wrong anyway",
  "No clear view of your profit vs payouts",
  "You're paying for a service you could run yourself",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[hsl(192,100%,12%)]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src={logo} alt="WarrantyVault" className="h-8" />
          <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button size="sm" className="btn-cta rounded-full px-5" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-0 px-6 relative overflow-hidden">
        <div className="absolute top-10 right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-[hsl(24,100%,50%)]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <div className="w-8 h-[2px] bg-primary" />
                <span className="text-xs text-white/60 font-semibold tracking-[0.2em] uppercase">Built for UK Dealerships</span>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold font-display tracking-tight text-white leading-[1.08] mb-6"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
              >
                Take Control of Your Warranty Process<span className="text-[hsl(var(--cta))]">.</span>
              </motion.h1>

              <motion.p
                className="text-base sm:text-lg text-white/50 max-w-lg mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
              >
                Create, manage and handle self-funded warranties in-house. No third-party providers. Better margins, faster decisions, full control.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button size="lg" className="btn-cta text-base px-8 rounded-full h-12" asChild>
                  <Link to="/signup">Sign Up <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8 rounded-full h-12 border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent" asChild>
                  <a href="#how-it-works">See How It Works</a>
                </Button>
              </motion.div>

              <motion.div
                className="mt-6 space-y-1"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              >
                <p className="text-sm text-white/40">No monthly fees. Only pay when you use it.</p>
                <p className="text-xs text-white/25">£19 per warranty. No contracts.</p>
              </motion.div>
            </div>

            {/* Dashboard preview */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="bg-[hsl(222,25%,10%)]/80 backdrop-blur-md border border-white/8 rounded-2xl p-5 shadow-2xl">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(0,60%,50%)]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(40,80%,55%)]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(140,60%,45%)]/60" />
                </div>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">Active Warranties</span>
                    <span className="text-lg font-bold font-display text-primary">47</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full"><div className="h-1 bg-primary rounded-full" style={{ width: "70%" }} /></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">Per Warranty Fee</span>
                    <span className="text-lg font-bold font-display text-[hsl(var(--cta))]">£19</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full"><div className="h-1 bg-[hsl(var(--cta))] rounded-full" style={{ width: "85%" }} /></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">Monthly Fee</span>
                    <span className="text-lg font-bold font-display text-white">£0</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["BMW 320d", "Audi A4", "Mercedes C200"].map(car => (
                    <div key={car} className="bg-[hsl(222,20%,12%)] border border-white/5 rounded-lg p-3 text-center">
                      <Car className="w-4 h-4 text-primary mx-auto mb-1.5" />
                      <span className="text-xs text-white/60">{car}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Hero bottom swoosh */}
        <div className="relative -mb-px">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: '120px' }}>
            <path d="M0,40 C240,100 480,110 720,80 C960,50 1200,90 1440,60 L1440,120 L0,120 Z" fill="hsl(192,100%,8%)" opacity="0.4" />
            <path d="M0,60 C320,110 640,100 960,70 C1150,50 1320,80 1440,70 L1440,120 L0,120 Z" fill="hsl(192,100%,8%)" opacity="0.6" />
            <path d="M0,80 C400,110 800,90 1100,75 C1280,65 1380,85 1440,80 L1440,120 L0,120 Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="py-6 px-6 border-b border-border/20">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-muted-foreground">
          {["Trusted by 50+ dealerships", "2,000+ warranties issued", "£0/month — pay per warranty", "Cancel anytime"].map(item => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Transition statement */}
      <section className="py-24 px-6 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[hsl(192,100%,12%)]/40 pointer-events-none" />
        <motion.div
          className="max-w-4xl mx-auto text-center relative"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white leading-tight mb-5">
            Most dealers are already moving away from warranty providers…
          </p>
          <p className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto">
            The problem is they don't have the right system to manage it properly.
          </p>
        </motion.div>
      </section>

      {/* Pricing trust bar */}
      <section className="py-5 px-6 border-y border-border/20 bg-secondary/20">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {["£0/month", "Only pay per warranty", "£19 per warranty issued", "No contracts or upfront costs"].map(item => (
            <div key={item} className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <motion.span
              className="text-[hsl(var(--cta))] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            >
              The Problem
            </motion.span>
            <motion.h2
              className="text-3xl sm:text-4xl font-bold font-display mb-4 leading-tight"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            >
              Warranty providers are costing you more than you think
            </motion.h2>
            <motion.p
              className="text-muted-foreground max-w-xl mx-auto"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            >
              Every delay, every fee, and every handoff eats into your profit.
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {problemCards.map((issue, i) => (
              <motion.div
                key={issue} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="glass-card rounded-xl p-5 flex items-start gap-3"
              >
                <div className="mt-0.5 w-6 h-6 rounded-full bg-[hsl(var(--cta))]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--cta))]" />
                </div>
                <span className="text-sm leading-relaxed">{issue}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          >
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
      <section className="py-24 px-6 bg-secondary/30">
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
            {/* Mini dashboard preview */}
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

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Platform Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Everything you need to stay in control</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Built for UK dealers who want higher margins, faster claim decisions, and fewer admin headaches.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group"
                custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold font-display mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" className="btn-cta rounded-full px-10 h-12" asChild>
              <Link to="/signup">Sign Up <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-3">No monthly fees. No contracts.</p>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
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
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
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

      {/* Optional Add-on: Dedicated Warranty Line */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[hsl(var(--cta))] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Optional Add-On</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Look like a proper warranty department</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Give your customers a dedicated line for warranty enquiries and claims.</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: MessageSquare, title: "Custom Greeting", desc: "Answer calls with your dealership name and a professional warranty message." },
                { icon: Music, title: "Hold Music & Branding", desc: "Custom hold music that reinforces your brand while customers wait." },
                { icon: Phone, title: "Simple Menu System", desc: "Route callers to the right person — claims, enquiries, or general support." },
                { icon: PhoneForwarded, title: "Calls Routed to You", desc: "Calls go straight to your team. No third-party call centres." },
                { icon: Shield, title: "Separate from Sales Line", desc: "Keep warranty calls separate from your main sales number." },
                { icon: Zap, title: "Set Up in 24 Hours", desc: "We handle the setup. You just start answering warranty calls." },
              ].map((item, i) => (
                <motion.div
                  key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="glass-card rounded-xl p-5"
                >
                  <div className="w-9 h-9 rounded-lg bg-[hsl(var(--cta))]/10 flex items-center justify-center mb-3">
                    <item.icon className="w-4 h-4 text-[hsl(var(--cta))]" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="glass-card-strong rounded-2xl p-8 text-center sticky top-24"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[hsl(var(--cta))]/10 flex items-center justify-center mx-auto mb-5">
                <Headphones className="w-7 h-7 text-[hsl(var(--cta))]" />
              </div>
              <h3 className="text-xl font-bold font-display mb-1">Dedicated Warranty Line</h3>
              <p className="text-3xl font-bold font-display mb-1">£25<span className="text-base text-muted-foreground font-normal">/month</span></p>
              <p className="text-xs text-muted-foreground mb-6">Add to any WarrantyVault plan</p>

              <div className="space-y-3 text-left mb-6">
                {["Dedicated phone number", "Custom greeting with your name", "Hold music & branding", "Call routing to your team", "No long-term contract"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--cta))] flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full rounded-full h-11 btn-cta" asChild>
                <Link to="/signup">Add Warranty Line</Link>
              </Button>
              <p className="text-[11px] text-muted-foreground mt-3">Cancel anytime. Set up in 24 hours.</p>
            </motion.div>
          </div>

          <motion.p
            className="text-center text-muted-foreground text-sm mt-10 max-w-lg mx-auto"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          >
            Stop giving out personal mobiles for warranty calls. Give your customers a proper number and keep it professional.
          </motion.p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground mb-14">No monthly fees. No contracts. Pay only when you issue a warranty.</p>
          <motion.div
            className="glass-card-strong rounded-2xl p-10 sm:p-14 glow-primary relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-52 h-52 bg-primary/8 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative">
              <p className="text-5xl sm:text-6xl font-bold font-display mb-1">£0<span className="text-2xl text-muted-foreground font-normal">/month</span></p>
              <p className="text-xl font-semibold font-display mb-2">Only £19 per warranty</p>
              <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">Charged via Stripe when you issue each warranty. No hidden fees, no surprises.</p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-3 max-w-xs mx-auto mb-8">
                {["No monthly fees", "No contracts", "Pay only when you use it", "Scale as you grow"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="bg-secondary/40 rounded-xl p-4 mb-8 max-w-sm mx-auto border border-border/20">
                <p className="text-sm">
                  Optional add-on: <span className="font-semibold">Dedicated Warranty Line — £25/month</span>.
                </p>
              </div>

              <div className="bg-secondary/40 rounded-xl p-4 mb-8 max-w-sm mx-auto border border-border/20">
                <p className="text-sm">
                  Keep an extra <span className="font-semibold">£300–£800 per deal</span> by managing warranties in-house.
                </p>
              </div>

              <Button size="lg" className="btn-cta rounded-full px-12 h-12" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-3">No monthly fees. No contracts.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Trust</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3">Built by someone with real dealership experience</h2>
            <p className="text-muted-foreground">Don't just take our word for it.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="glass-card rounded-xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-[hsl(var(--cta))] text-[hsl(var(--cta))]" />)}
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA with swoosh */}
      <section className="relative overflow-hidden">
        {/* Swoosh - layered wave from light bg into dark CTA */}
        <div className="relative bg-background -mb-px">
          <svg viewBox="0 0 1440 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: '180px' }}>
            <path d="M0,90 C200,140 500,160 720,120 C940,80 1200,110 1440,80 L1440,180 L0,180 Z" fill="hsl(192,100%,8%)" opacity="0.25" />
            <path d="M0,110 C280,150 560,140 840,110 C1060,85 1300,120 1440,100 L1440,180 L0,180 Z" fill="hsl(192,100%,8%)" opacity="0.5" />
            <path d="M0,130 C360,155 720,140 1080,120 C1280,105 1400,125 1440,115 L1440,180 L0,180 Z" fill="hsl(192,100%,8%)" />
          </svg>
        </div>
        <div className="bg-[hsl(192,100%,8%)] pt-16 pb-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">Start managing your warranties properly</h2>
            <p className="text-white/50 mb-8 text-lg">Join dealers taking control of their warranty process.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-cta rounded-full px-10 text-base h-12" asChild>
                <Link to="/signup">Sign Up <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-10 text-base h-12 border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent">
                Book Demo
              </Button>
            </div>
            <p className="text-xs text-white/30 mt-5">No monthly fees. £19 per warranty.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={logo} alt="WarrantyVault" className="h-6 opacity-60" />
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
