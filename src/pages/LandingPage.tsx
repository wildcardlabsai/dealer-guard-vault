import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, ArrowRight, CheckCircle2, Star,
  Headphones, Sparkles, Wallet, ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Self-Funded Car Warranty Software for UK Dealers | WarrantyVault"
        description="Run self-funded warranties properly. Manage claims, handle complaints, and stay in control of your risk and profit — built for UK independent car dealers."
        canonical="https://dealer-guard-vault.lovable.app/"
      />

      <PublicNav />

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute top-10 right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 relative pt-36 pb-24 text-center">
          <motion.p
            className="text-sm text-white/50 font-semibold tracking-[0.2em] uppercase mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            Built specifically for UK independent car dealers
          </motion.p>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight text-white leading-[1.05] mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          >
            Run Your Own Warranties<br />— Properly<span className="text-[hsl(var(--cta))]">.</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
          >
            Manage self-funded warranties with confidence. Handle claims, respond to complaints correctly, and stay in control of your risk and profit — all in one place.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
            <Button size="lg" className="btn-cta text-base px-10 rounded-full h-14" asChild>
              <Link to="/signup">Start Free — No Monthly Fees <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-10 rounded-full h-14 border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent" asChild>
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </motion.div>

          <motion.p className="text-xs text-white/30 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            No monthly fees · First 5 warranties free · £19 per warranty after that
          </motion.p>
        </div>

        <div className="relative left-1/2 w-screen -translate-x-1/2 -mb-px">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="block h-[120px] w-full" preserveAspectRatio="none">
            <path d="M0,70 C220,108 470,108 720,82 C980,54 1170,46 1440,78 L1440,120 L0,120 Z" fill="hsl(222 30% 7%)" />
          </svg>
        </div>
      </section>

      {/* Hook Section */}
      <section className="bg-[hsl(222_30%_7%)] border-b border-white/5">
        <motion.div className="max-w-3xl mx-auto text-center px-6 pt-20 pb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold font-display text-white leading-[1.15] tracking-[-0.02em] mb-8">
            Most dealers want to run their own warranties…<br />
            <span className="text-white/40">but don't have the system to do it properly</span>
          </h2>

          <div className="text-left max-w-md mx-auto mb-8 space-y-3">
            <p className="text-white/50 text-base">So what happens?</p>
            {["Claims get messy", "Complaints escalate", "Dealers aren't sure what to say", "Money isn't tracked properly"].map(item => (
              <div key={item} className="flex items-center gap-3 text-white/45 text-[15px]">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
            <p className="text-white/40 text-sm pt-2">And suddenly it becomes more stress than it's worth.</p>
          </div>

          <p className="text-xl font-semibold font-display text-primary">WarrantyVault fixes that.</p>
        </motion.div>
      </section>

      {/* Core Features — 4 cards */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3">Four tools. One system.</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Everything you need to run self-funded warranties properly.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {coreFeatures.map((f, i) => (
              <motion.div key={f.title} className="glass-card rounded-xl p-8 hover:border-primary/30 transition-all duration-300 group" custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold font-display mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" className="rounded-full px-8 h-11 border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent" asChild>
              <Link to="/features">See all features <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Differentiator */}
      <section className="py-24 px-6 bg-secondary/20">
        <motion.div className="max-w-3xl mx-auto text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-6">This isn't just warranty software</h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-xl mx-auto">Most systems help you log claims. WarrantyVault helps you:</p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left mb-10">
            {["Understand your position", "Avoid saying the wrong thing", "Stay in control financially", "Run warranties properly from end to end"].map(item => (
              <div key={item} className="flex items-center gap-3 text-[15px]">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground italic">It's the system dealers wish they had before things go wrong.</p>
        </motion.div>
      </section>

      {/* DisputeIQ Seller */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div className="glass-card-strong rounded-2xl p-10 sm:p-14 relative overflow-hidden" initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/8 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative">
              <Sparkles className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold font-display mb-4">Not sure how to respond to a complaint?</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl">
                DisputeIQ guides you through the situation and helps you send the right response — before things escalate.
              </p>
              <div className="space-y-3 mb-8">
                {["Understand your position instantly", "Get clear next steps", "Send professional responses with confidence"].map(item => (
                  <div key={item} className="flex items-center gap-3 text-[15px]">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Button className="btn-cta rounded-full px-8 h-11" asChild>
                <Link to="/disputeiq">Stop guessing. Start responding properly. <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Warranty Fund */}
      <section className="py-24 px-6 bg-secondary/20">
        <motion.div className="max-w-3xl mx-auto text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Wallet className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-6">Know exactly where you stand financially</h2>
          <p className="text-muted-foreground text-lg mb-8">Running your own warranties shouldn't feel risky. WarrantyVault shows you:</p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto text-left mb-10">
            {["How much you've got set aside", "Your real exposure", "Whether you're underfunding", "What to adjust"].map(item => (
              <div key={item} className="flex items-center gap-3 text-[15px]">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground font-medium">Run warranties with confidence, not guesswork.</p>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3">How it works</h2>
            <p className="text-muted-foreground">Four steps. No complexity.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((s, i) => (
              <motion.div key={s.num} className="glass-card rounded-xl p-7" custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <span className="text-3xl font-bold font-display text-primary/30 mb-3 block">{s.num}</span>
                <h3 className="text-lg font-semibold font-display mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3">Simple, transparent pricing</h2>
          <p className="text-muted-foreground mb-10">No monthly fees. No contracts. Pay only when you issue a warranty.</p>
          <motion.div className="glass-card-strong rounded-2xl p-10 sm:p-14 glow-primary relative overflow-hidden" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="absolute top-0 right-0 w-52 h-52 bg-primary/8 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative">
              <p className="text-5xl sm:text-6xl font-bold font-display mb-1">£0<span className="text-2xl text-muted-foreground font-normal">/month</span></p>
              <p className="text-xl font-semibold font-display mb-2">Only £19 per warranty</p>
              <p className="text-sm text-[hsl(var(--cta))] font-semibold mb-1">🎉 First 5 warranties FREE</p>
              <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">Start with 5 free warranties, then £19 each. No hidden fees.</p>

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

              <Button size="lg" className="btn-cta rounded-full px-12 h-12" asChild>
                <Link to="/signup">Start Free Today</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3">Trusted by UK dealers</h2>
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
      <section className="hero-gradient pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">Run your own warranties with confidence</h2>
          <p className="text-white/45 mb-10 text-lg">No monthly fees. No unnecessary complexity. Just a system that works.</p>
          <Button size="lg" className="btn-cta rounded-full px-12 text-base h-14" asChild>
            <Link to="/signup">Start Free Today <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
          <p className="text-xs text-white/30 mt-5">First 5 warranties free · £19 per warranty after that</p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
