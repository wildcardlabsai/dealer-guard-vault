import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Car, Users, FileText, Search, MapPin, Award, ClipboardCheck, ArrowRight, CheckCircle2, Star, Phone, Mail } from "lucide-react";
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
      {/* Top Bar */}
      <div className="bg-teal-dark text-white/70 text-xs py-2 px-6 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <CheckCircle2 className="w-3.5 h-3.5 text-accent inline mr-1" />
            <span>Self-funded warranty platform</span>
            <span>•</span>
            <span>Trusted by UK dealerships</span>
            <span>•</span>
            <span>Full claims control</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="w-3 h-3" /> 0800 123 4567
            </a>
            <a href="#" className="flex items-center gap-1 hover:text-white transition-colors">
              <Mail className="w-3 h-3" /> info@warrantyvault.com
            </a>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 w-full z-50 bg-teal border-b border-teal-light/30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src={logo} alt="WarrantyVault" className="h-8" />
          <div className="hidden md:flex items-center gap-8 text-sm text-white/80">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-teal-light/30" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6 font-semibold" asChild>
              <Link to="/login">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-accent/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-light/40 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="w-1 h-20 bg-accent rounded-full mb-6" />
            </motion.div>
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white mb-6 leading-[1.1]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
            >
              Run Your Own Warranty Company<span className="text-accent">.</span>
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl text-white/70 max-w-lg mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            >
              Manage, issue and control warranties without relying on third-party providers. Keep your margins. Keep your customers.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full text-base px-8 font-semibold glow-primary" asChild>
                <Link to="/login">Get started today <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base px-8 border-white/30 text-white hover:bg-white/10 hover:text-white">
                Book Demo
              </Button>
            </motion.div>
          </div>
        </div>
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 36C840 40 960 48 1080 52C1200 56 1320 56 1380 56L1440 56V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="hsl(0, 0%, 97%)" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              Everything You Need<span className="text-accent">.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A complete warranty management platform built specifically for UK car dealerships.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="bg-card rounded-xl p-6 border-2 border-border/50 hover:border-accent/40 transition-all duration-300 group shadow-sm"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                  <f.icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="font-semibold font-display text-lg mb-2">{f.title}<span className="text-accent">.</span></h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-60 h-60 bg-accent/20 rounded-full blur-[80px]" />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
              How It Works<span className="text-accent">.</span>
            </h2>
            <p className="text-white/60">Get started in minutes, not weeks.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.num} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <div className="text-5xl font-bold font-display text-accent mb-4">{s.num}</div>
                <h3 className="font-semibold font-display text-white text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
            Simple, Transparent Pricing<span className="text-accent">.</span>
          </h2>
          <p className="text-muted-foreground mb-12">No hidden fees. No long contracts. Cancel anytime.</p>
          <motion.div
            className="bg-card rounded-2xl p-8 sm:p-12 border-2 border-accent/30 shadow-lg relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-accent rounded-r-full" />
            <div className="relative">
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-5xl font-bold font-display text-primary">£50</span>
                <span className="text-muted-foreground">/month per dealership</span>
              </div>
              <p className="text-muted-foreground mb-8">+ £15 per warranty loaded (admin fee)</p>
              <div className="grid sm:grid-cols-2 gap-3 text-left max-w-md mx-auto mb-8">
                {["Unlimited warranties", "Customer portal", "Claims management", "DVLA lookup", "Branded certificates", "Full audit trail", "Email notifications", "Priority support"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-10 font-semibold glow-primary" asChild>
                <Link to="/login">Start Free Trial</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-secondary/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-12">
            Trusted by Dealerships<span className="text-accent">.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-accent text-accent" />)}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{t.text}"</p>
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
      <footer className="bg-hero-gradient text-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={logo} alt="WarrantyVault" className="h-6 brightness-200" />
          <p className="text-sm text-white/50">Built by <span className="text-white/80 font-medium">Wildcard Labs</span></p>
          <div className="flex gap-6 text-sm text-white/50">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
