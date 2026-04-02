import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, Car, Users, FileText, Search, Award, ClipboardCheck,
  ArrowRight, CheckCircle2, Star, ChevronRight, X, Zap, TrendingUp,
  BarChart3, FileCheck, UserCheck, PoundSterling, Clock, Settings, AlertTriangle
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
  { num: "01", title: "Add a warranty", desc: "Enter the reg and create a warranty in seconds." },
  { num: "02", title: "Customer gets access", desc: "They can view everything online instantly." },
  { num: "03", title: "Manage claims", desc: "Approve, reject or review — no delays." },
  { num: "04", title: "Track performance", desc: "See profit and activity in real-time." },
];

const comparisonRows = [
  { label: "MARGIN PER DEAL", icon: PoundSterling, left: "Reduced by external fees", right: "Kept in-house for your dealership" },
  { label: "CLAIM DECISIONS", icon: Clock, left: "Delayed by third-party queues", right: "Same-day decisions in your dashboard" },
  { label: "OPERATIONAL CONTROL", icon: Settings, left: "Limited rules and visibility", right: "Full control over approvals and payouts" },
  { label: "DEPENDENCY RISK", icon: AlertTriangle, left: "Provider outages and handoffs", right: "Fully in-house process you control" },
];

const testimonials = [
  { name: "Arjun K.", role: "Sales Director, Manchester", text: "Our team issues warranties in minutes now. No chasing providers and no spreadsheet mess." },
  { name: "Ben R.", role: "Independent Dealer, Bristol", text: "The customer portal has cut inbound calls and made us look far more professional." },
  { name: "Liam P.", role: "Used Car Dealer, Birmingham", text: "Switching to in-house warranties has increased our margins massively. WarrantyVault makes it simple to manage everything ourselves." },
  { name: "Chris W.", role: "Dealer Group Ops, Newcastle", text: "WarrantyVault gives us speed, consistency, and better margins across the group." },
  { name: "Chloe M.", role: "Dealer Owner, Nottingham", text: "Profit tracking is brilliant. We can see exactly what each warranty is doing for the business." },
  { name: "Tom H.", role: "Franchise Dealer, Liverpool", text: "Setup was straightforward and we had it up quickly. It just fits how we work." },
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
              <Link to="/login">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-40 px-6 relative overflow-hidden">
        <div className="absolute top-10 right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-[hsl(24,100%,50%)]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8"
              >
                <Car className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-white/60 font-medium tracking-wide uppercase">Built for UK car dealerships</span>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold font-display tracking-tight text-white leading-[1.08] mb-6"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
              >
                Take Control of Your Warranty Process<span className="text-cta">.</span>
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
                  <Link to="/login">Start Free Trial <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8 rounded-full h-12 border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent" asChild>
                  <a href="#how-it-works">See How It Works</a>
                </Button>
              </motion.div>

              <motion.p
                className="text-xs text-white/30 mt-5 tracking-wide"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              >
                £0/month · First 5 warranties free · No contracts
              </motion.p>
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
                  <span className="text-[10px] text-white/30 ml-2 font-mono">dealer-dashboard</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold font-display text-primary">£0</p>
                    <p className="text-[10px] text-white/40 mt-0.5">Monthly Fee</p>
                  </div>
                  <div className="bg-[hsl(222,20%,14%)] border border-white/5 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold font-display text-white">£19</p>
                    <p className="text-[10px] text-white/40 mt-0.5">Per Warranty</p>
                  </div>
                  <div className="bg-[hsl(222,20%,14%)] border border-white/5 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold font-display text-white">5</p>
                    <p className="text-[10px] text-white/40 mt-0.5">Free First</p>
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social proof */}
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

      {/* Problem */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.span className="text-cta text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                The Problem
              </motion.span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mb-8 leading-tight">Warranty providers are costing you more than you think</h2>
              <div className="space-y-4">
                {[
                  "You lose margin on every deal",
                  "Claims take too long to approve",
                  "You rely on third parties",
                  "Customers blame you when things go wrong",
                  "No clear view of profit vs payouts",
                ].map((issue, i) => (
                  <motion.div key={issue} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1 w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <X className="w-3 h-3 text-destructive" />
                    </div>
                    <span className="text-muted-foreground">{issue}</span>
                  </motion.div>
                ))}
              </div>
              <p className="mt-10 text-lg font-semibold font-display text-primary">There's a better way to run warranties.</p>
            </div>
            <motion.div
              className="glass-card-strong rounded-2xl p-10 text-center"
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            >
              <div className="w-16 h-16 rounded-2xl bg-cta/10 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-cta" />
              </div>
              <p className="text-4xl font-bold font-display mb-2">£300–£800</p>
              <p className="text-muted-foreground text-sm max-w-[250px] mx-auto">Extra profit per deal when you manage warranties in-house</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">The Solution</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-5 leading-tight">Run your warranties in-house with total control</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
              WarrantyVault gives you everything you need to manage self-funded warranties properly — without spreadsheets, paperwork, or chasing providers.
            </p>
            <Button size="lg" className="btn-cta rounded-full px-10 h-12" asChild>
              <Link to="/login">Sign Up <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-3">Start for free. No monthly fees.</p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">What You Get</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Everything you need, nothing you don't</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Built specifically for UK car dealerships who want better margins and full control.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass-card rounded-xl p-6 hover:border-primary/30 hover:glow-primary-sm transition-all duration-300 group"
                custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold font-display mb-2 text-[15px]">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Dealer Comparison</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">See the difference in one glance</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Built to make profit and control obvious, not hidden in paperwork and provider delays.</p>
          </div>
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-0 items-start">
            {/* Left - Providers */}
            <div>
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="font-semibold font-display text-lg text-muted-foreground">With Warranty Providers</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-destructive/10 text-destructive px-3 py-1 rounded-full">Less Control</span>
              </div>
              <div className="space-y-3">
                {comparisonRows.map(row => (
                  <div key={row.label} className="glass-card rounded-xl p-5">
                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/60 mb-2">{row.label}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <X className="w-2.5 h-2.5 text-destructive" />
                      </div>
                      <span className="text-sm text-muted-foreground">{row.left}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VS divider */}
            <div className="hidden md:flex flex-col items-center justify-center px-6 pt-16">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">vs</span>
              </div>
            </div>

            {/* Right - WarrantyVault */}
            <div>
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="font-semibold font-display text-lg">With WarrantyVault</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full">Higher Margin</span>
              </div>
              <div className="space-y-3">
                {comparisonRows.map(row => (
                  <div key={row.label} className="glass-card rounded-xl p-5 border-primary/20 bg-primary/[0.03]">
                    <div className="flex items-center gap-2 mb-2">
                      <row.icon className="w-3.5 h-3.5 text-primary" />
                      <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-primary/70">{row.label}</p>
                    </div>
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
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Up and running in minutes</h2>
            <p className="text-muted-foreground">No setup fees. No training needed. Just start issuing warranties.</p>
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
          <div className="text-center mt-12">
            <Button size="lg" className="btn-cta rounded-full px-10 h-12" asChild>
              <Link to="/login">Start Free Trial <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Differentiator + Dashboard */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Dealer Dashboard</span>
              <h2 className="text-3xl font-bold font-display mb-5 leading-tight">Built for how dealers actually work</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Most warranty systems are built for providers — not dealers. WarrantyVault is designed for dealerships who want control, speed and better margins without the hassle.
              </p>
              <div className="space-y-3 mb-8">
                {["Pay only when you use it", "No monthly fees", "No risk to get started", "Customer portal included from day one"].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Button className="btn-cta rounded-full px-8 h-11" asChild>
                <Link to="/login">Sign Up <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-3">Start for free. No monthly fees.</p>
            </div>

            <motion.div
              className="glass-card-strong rounded-2xl p-5 shadow-2xl"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(0,60%,50%)]/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(40,80%,55%)]/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(140,60%,45%)]/60" />
                <span className="text-[10px] text-muted-foreground ml-2 font-mono">dealer-dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 mb-5">
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold font-display text-primary">£0</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Monthly Fee</p>
                </div>
                <div className="bg-secondary/60 border border-border/30 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold font-display">£19</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Per Warranty</p>
                </div>
                <div className="bg-secondary/60 border border-border/30 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold font-display">5</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Free First</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { reg: "AB12 CDE", car: "BMW 320d M Sport", status: "Active" },
                  { reg: "CD34 FGH", car: "Audi A4 S Line", status: "Active" },
                  { reg: "GH78 LMN", car: "VW Golf R", status: "Expired" },
                ].map(w => (
                  <div key={w.reg} className="flex items-center justify-between p-3 bg-secondary/30 border border-border/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <code className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-mono tracking-wider">{w.reg}</code>
                      <span className="text-sm">{w.car}</span>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${w.status === "Active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{w.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Simple, risk-free pricing</h2>
          <p className="text-muted-foreground mb-14">No monthly fees. No contracts. Start now and only pay when you use it.</p>
          <motion.div
            className="glass-card-strong rounded-2xl p-10 sm:p-14 glow-primary relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-52 h-52 bg-primary/8 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative">
              <p className="text-5xl sm:text-6xl font-bold font-display mb-1">£0<span className="text-2xl text-muted-foreground font-normal">/month</span></p>
              <p className="text-xl font-semibold font-display mb-2">Only £19 per warranty</p>
              <p className="text-primary font-semibold text-sm mb-8">First 5 warranties FREE</p>

              <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">First 5 warranties completely free — get set up and try it properly.</p>

              <div className="grid grid-cols-2 gap-x-8 gap-y-3 max-w-xs mx-auto mb-8">
                {["No monthly fees", "No contracts", "Pay only when you use it", "Scale as you grow"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mb-3">Optional add-on: Dedicated Warranty Line - £25/month.</p>

              <div className="bg-secondary/40 rounded-xl p-4 mb-8 max-w-sm mx-auto border border-border/20">
                <p className="text-sm">
                  Keep an extra <span className="font-semibold">£300–£800 per deal</span> by managing warranties in-house.
                </p>
              </div>

              <Button size="lg" className="btn-cta rounded-full px-12 h-12" asChild>
                <Link to="/login">Sign Up</Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-3">Start for free. No monthly fees.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust / Testimonials */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Trust</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Built by someone with real dealership experience</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="glass-card rounded-xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-cta text-cta" />)}
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

      {/* Final CTA */}
      <section className="py-24 px-6 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[hsl(192,100%,12%)]/50 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">Start managing your warranties properly</h2>
          <p className="text-white/50 mb-8 text-lg">Join dealers taking control of their warranty process.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-cta rounded-full px-10 text-base h-12" asChild>
              <Link to="/login">Start Free Trial <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 text-base h-12 border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent">
              Book Demo
            </Button>
          </div>
          <p className="text-xs text-white/30 mt-5">No monthly fees. First 5 warranties free.</p>
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
