import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Car, Users, FileText, Search, MapPin, Award, ClipboardCheck, ArrowRight, CheckCircle2, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/warrantylogo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: Shield, title: "Unlimited Warranties", desc: "Issue as many warranties as you need with no caps or restrictions." },
  { icon: Car, title: "Self-Funded Control", desc: "Keep full control of your warranty fund — no third-party middlemen." },
  { icon: Users, title: "Customer Portal", desc: "Give customers their own login to view warranties and submit claims." },
  { icon: ClipboardCheck, title: "Claims Management", desc: "Review, approve or reject claims with a full audit trail." },
  { icon: Search, title: "DVLA Vehicle Lookup", desc: "Instantly pull vehicle details by registration number." },
  { icon: MapPin, title: "Address Autocomplete", desc: "Fast UK postcode lookup for quick customer onboarding." },
  { icon: FileText, title: "Branded Documents", desc: "Generate professional warranty certificates and agreements." },
  { icon: Award, title: "Revenue Tracking", desc: "Track warranty income, claims costs and net revenue in real time." },
];

const steps = [
  { num: "01", title: "Add Warranty", desc: "Enter the vehicle reg and customer details. We auto-fill the rest." },
  { num: "02", title: "Customer Gets Login", desc: "Your customer receives access to their own warranty portal." },
  { num: "03", title: "Manage Claims", desc: "Review and manage claims directly from your dashboard." },
  { num: "04", title: "Full Control", desc: "Track revenue, renewals and keep complete oversight." },
];

const testimonials = [
  { name: "James P.", role: "Prestige Motors, Birmingham", text: "WarrantyVault has completely changed how we handle warranties. No more third-party fees eating into our margins." },
  { name: "Sarah M.", role: "City Autos, Manchester", text: "The customer portal alone is worth it. Our customers love being able to check their warranty status online." },
  { name: "Tom R.", role: "Premier Cars, Leeds", text: "Setup took 10 minutes and we were issuing warranties the same day. Brilliant platform." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[hsl(192,100%,12%)]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="WarrantyVault" className="h-8" />
            <span className="text-white font-display font-bold text-lg hidden sm:inline">WarrantyVault</span>
          </div>
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
      <section className="hero-gradient pt-28 pb-32 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-2xl">
            {/* Orange accent line */}
            <motion.div
              initial={{ height: 0 }} animate={{ height: 64 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-1 bg-cta rounded-full mb-8"
            />

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold font-display tracking-tight text-white leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            >
              Run Your Own Warranty Company<span className="text-cta">.</span>
            </motion.h1>

            <motion.p
              className="text-lg text-white/60 max-w-xl mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
            >
              Manage, issue and control warranties without relying on third-party providers. Keep your margins. Keep your customers.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Button size="lg" className="btn-cta text-base px-8 rounded-full h-12" asChild>
                <Link to="/login">Get started today <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 rounded-full h-12 border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent">
                Book Demo
              </Button>
            </motion.div>
          </div>

          {/* Dashboard preview mockup on the right */}
          <motion.div
            className="hidden lg:block absolute top-8 right-0 w-[420px]"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="bg-card/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">Active Warranties</span>
                  <span className="text-primary font-bold text-lg font-display">47</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full"><div className="h-full w-3/4 bg-primary rounded-full" /></div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">Monthly Revenue</span>
                  <span className="text-white font-bold text-lg font-display">£4,500</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full"><div className="h-full w-1/2 bg-cta rounded-full" /></div>
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">Open Claims</span>
                  <span className="text-white font-bold text-lg font-display">3</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {["BMW 320d", "Audi A4", "Mercedes C200"].map(v => (
                    <div key={v} className="bg-white/5 rounded-lg p-2 text-center">
                      <Car className="w-4 h-4 text-primary mx-auto mb-1" />
                      <p className="text-[10px] text-white/60">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Curved bottom transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full h-auto block">
            <path d="M0 80V40C240 80 480 0 720 0C960 0 1200 80 1440 40V80H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="py-8 px-6 border-b border-border/30">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>Trusted by 50+ dealerships</span></div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>2,000+ warranties issued</span></div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>No setup fees</span></div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> <span>Cancel anytime</span></div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.span className="inline-block text-primary text-sm font-semibold tracking-wider uppercase mb-3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Platform Features
            </motion.span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Everything You Need to Manage Warranties</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A complete warranty management platform built specifically for UK car dealerships.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold font-display mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-3 block">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">How It Works</h2>
            <p className="text-muted-foreground">Get started in minutes, not weeks.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.num} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center relative">
                <div className="text-4xl font-bold font-display gradient-text mb-3">{s.num}</div>
                <h3 className="font-semibold font-display mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
                {i < 3 && <ChevronRight className="hidden lg:block absolute top-8 -right-4 w-5 h-5 text-muted-foreground/40" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-3 block">Dealer Dashboard</span>
              <h2 className="text-3xl font-bold font-display mb-4">Manage Everything From One Place</h2>
              <p className="text-muted-foreground mb-6">Your dashboard gives you instant access to all your warranties, claims, and customers. Track revenue, manage claims and issue new warranties — all from one screen.</p>
              <div className="space-y-3">
                {["Issue warranties in under 60 seconds", "Real-time DVLA vehicle lookups", "One-click certificate generation", "Complete claims audit trail"].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Button className="btn-cta mt-8 rounded-full px-6" asChild>
                <Link to="/login">Try it free <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
            <div className="glass-card-strong rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
                <span className="text-xs text-muted-foreground ml-2">dealer-dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-primary/10 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold font-display text-primary">47</p>
                  <p className="text-xs text-muted-foreground">Warranties</p>
                </div>
                <div className="bg-secondary/60 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold font-display">£4.5k</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
                <div className="bg-secondary/60 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold font-display">3</p>
                  <p className="text-xs text-muted-foreground">Claims</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { reg: "AB12 CDE", car: "BMW 320d M Sport", status: "Active" },
                  { reg: "CD34 FGH", car: "Audi A4 S Line", status: "Active" },
                  { reg: "GH78 LMN", car: "VW Golf R", status: "Expired" },
                ].map(w => (
                  <div key={w.reg} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <code className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{w.reg}</code>
                      <span className="text-sm">{w.car}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${w.status === "Active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{w.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-secondary/30">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-3 block">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground mb-12">No hidden fees. No long contracts. Cancel anytime.</p>
          <motion.div
            className="glass-card-strong rounded-2xl p-8 sm:p-12 glow-primary relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-[60px]" />
            <div className="relative">
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-bold font-display">£50</span>
                <span className="text-muted-foreground">/month per dealership</span>
              </div>
              <p className="text-muted-foreground mb-8">+ £15 per warranty loaded (admin fee)</p>
              <div className="grid sm:grid-cols-2 gap-3 text-left max-w-md mx-auto mb-8">
                {["Unlimited warranties", "Customer portal", "Claims management", "DVLA lookup", "Branded certificates", "Full audit trail", "Email notifications", "Priority support"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="btn-cta rounded-full px-10" asChild>
                <Link to="/login">Start Free Trial</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-3 block">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Trusted by Dealerships</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="glass-card rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-cta text-cta" />)}
                </div>
                <p className="text-sm text-muted-foreground mb-4">"{t.text}"</p>
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
      <section className="py-20 px-6 hero-gradient relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto block rotate-180">
            <path d="M0 60V20C240 60 480 0 720 0C960 0 1200 60 1440 20V60H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
        <div className="max-w-3xl mx-auto text-center relative pt-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">Ready to Take Control?</h2>
          <p className="text-white/60 mb-8 text-lg">Join dozens of UK dealerships already using WarrantyVault to manage their own warranty business.</p>
          <Button size="lg" className="btn-cta rounded-full px-10 text-base h-12" asChild>
            <Link to="/login">Start Your Free Trial <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="WarrantyVault" className="h-6 opacity-70" />
            <span className="text-sm text-muted-foreground font-display">WarrantyVault</span>
          </div>
          <p className="text-sm text-muted-foreground">Built by <span className="text-foreground font-medium">Wildcard Labs</span></p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
