import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Car, Users, FileText, Search, MapPin, Award, ClipboardCheck, ArrowRight, CheckCircle2, Star } from "lucide-react";
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
      <nav className="fixed top-0 w-full z-50 glass-card-strong border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src={logo} alt="WarrantyVault" className="h-8" />
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button size="sm" className="glow-primary-sm" asChild>
              <Link to="/login">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
              <Shield className="w-3.5 h-3.5" /> Built for UK Car Dealerships
            </span>
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
          >
            Run Your Own{" "}
            <span className="gradient-text">Warranty Company</span>
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
          >
            Manage, issue and control warranties without relying on third-party providers. Keep your margins. Keep your customers.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Button size="lg" className="glow-primary text-base px-8" asChild>
              <Link to="/login">Start Free Trial <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8">
              Book Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display mb-4">Everything You Need</h2>
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
            <h2 className="text-3xl font-bold font-display mb-4">How It Works</h2>
            <p className="text-muted-foreground">Get started in minutes, not weeks.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.num} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <div className="text-4xl font-bold font-display gradient-text mb-3">{s.num}</div>
                <h3 className="font-semibold font-display mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-display mb-4">Simple, Transparent Pricing</h2>
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
              <Button size="lg" className="glow-primary px-10" asChild>
                <Link to="/login">Start Free Trial</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold font-display text-center mb-12">Trusted by Dealerships</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="glass-card rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}
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

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={logo} alt="WarrantyVault" className="h-6 opacity-70" />
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
