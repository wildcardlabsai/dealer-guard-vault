import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, Car, Search, ArrowRight, CheckCircle2, Star,
  BarChart3, FileCheck, UserCheck, ClipboardCheck, PoundSterling
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Self-Funded Car Warranty Software for UK Dealers | WarrantyVault"
        description="Create, manage and handle self-funded car warranties in-house. No third-party providers. Better margins, faster decisions, full control for UK dealerships."
        canonical="https://dealer-guard-vault.lovable.app/"
      />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[hsl(var(--hero-bg))]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <img src={logo} alt="WarrantyVault" className="h-10" />
          <div className="hidden md:flex items-center gap-10 text-[15px] text-white/70">
            <Link to="/features" className="hover:text-white transition-colors">Features</Link>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
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
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute top-10 right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-[hsl(var(--cta))]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-3 mb-8">
                <div className="w-10 h-[2px] bg-[hsl(var(--cta))]" />
                <span className="text-sm text-white/60 font-semibold tracking-[0.2em] uppercase">Built for UK Dealerships</span>
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-6xl lg:text-[4.2rem] font-bold font-display tracking-tight text-white leading-[1.06] mb-8"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
              >
                Take Control of Your<br />Warranty Process<span className="text-[hsl(var(--cta))]">.</span>
              </motion.h1>

              <motion.p
                className="text-lg text-white/50 max-w-lg mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
              >
                Create, manage and handle self-funded warranties in-house. No third-party providers. Better margins, faster decisions, full control.
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
                <Button size="lg" className="btn-cta text-base px-10 rounded-full h-14" asChild>
                  <Link to="/signup">Sign Up <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base px-10 rounded-full h-14 border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent" asChild>
                  <Link to="/features">See Features</Link>
                </Button>
              </motion.div>

              <motion.div className="mt-8 space-y-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <p className="text-sm text-white/40">No monthly fees. Only pay when you use it.</p>
                <p className="text-xs text-white/30">£19 per warranty. No monthly fees.</p>
              </motion.div>
            </div>

            <motion.div className="hidden lg:block" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
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

        <div className="relative left-1/2 w-screen -translate-x-1/2 -mb-px">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="block h-[120px] w-full" preserveAspectRatio="none">
            <path d="M0,70 C220,108 470,108 720,82 C980,54 1170,46 1440,78 L1440,120 L0,120 Z" fill="hsl(222 30% 7%)" />
          </svg>
        </div>
      </section>

      {/* Statement */}
      <section className="bg-[hsl(222_30%_7%)] border-b border-white/5">
        <motion.div className="max-w-6xl mx-auto text-center px-6 pt-12 pb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[2.25rem] sm:text-[2.65rem] lg:text-[3rem] font-bold font-display text-white leading-[1.15] tracking-[-0.03em] mb-4">
            Most dealers are already moving away from warranty providers...
          </p>
          <p className="text-white/45 text-lg sm:text-[1.45rem] max-w-3xl mx-auto leading-relaxed">
            The problem is they don't have the right system to manage it properly.
          </p>
        </motion.div>

        <div className="border-t border-white/5 px-6 py-8">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-4 lg:gap-x-16">
            {["£0/month", "Only pay per warranty", "£19 per warranty", "No contracts or upfront costs"].map(item => (
              <div key={item} className="flex items-center gap-3 text-sm sm:text-base text-white/55">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features (condensed) */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Platform Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Everything you need to stay in control</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Built for UK dealers who want higher margins, faster claim decisions, and fewer admin headaches.</p>
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
          <div className="text-center mt-10">
            <Button variant="outline" className="rounded-full px-8 h-11 border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent" asChild>
              <Link to="/features">See All Features & Comparison <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-6 bg-secondary/30">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3">Simple, transparent pricing</h2>
          <p className="text-muted-foreground mb-10">No monthly fees. No contracts. Pay only when you issue a warranty.</p>
          <motion.div className="glass-card-strong rounded-2xl p-10 sm:p-14 glow-primary relative overflow-hidden" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
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
                  Optional add-on: <Link to="/warranty-line" className="font-semibold text-[hsl(var(--cta))] hover:underline">Dedicated Warranty Line — £25/month</Link>.
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
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Trust</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3">Built by someone with real dealership experience</h2>
            <p className="text-muted-foreground">Don't just take our word for it.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-card rounded-xl p-6">
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

      {/* Final CTA */}
      <section className="hero-gradient pt-20 pb-16 px-6">
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
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 hero-gradient">
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
