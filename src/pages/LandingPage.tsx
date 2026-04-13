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
          <motion.div key={t.name} custom={i} initial="hidden" animate="visible" variants={fadeUp} className="glass-card rounded-xl p-5">
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

function DashboardMock() {
  return (
    <motion.div
      className="glass-card-strong rounded-xl p-4 w-full max-w-sm mx-auto"
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.7 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="text-xs text-white/40 font-medium">Warranty Fund</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">£4,280</div>
      <div className="text-xs text-emerald-400 mb-3">+£320 this month · Healthy</div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "Active", val: "24" },
          { label: "Claims", val: "4" },
          { label: "Profit", val: "£1,860" },
        ].map(s => (
          <div key={s.label} className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-xs text-white/40">{s.label}</div>
            <div className="text-sm font-semibold text-white">{s.val}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-1 items-end h-10">
        {[35, 50, 40, 65, 55, 70, 60, 80, 75, 90, 85, 95].map((h, i) => (
          <div key={i} className="flex-1 bg-primary/40 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
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
        <div className="absolute top-10 right-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative pt-32 pb-16">
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
                <Button size="lg" variant="outline" className="text-sm px-8 rounded-full h-13 border-white/15 text-white/60 hover:bg-white/5 hover:text-white bg-transparent" asChild>
                  <a href="#how-it-works">See How It Works</a>
                </Button>
              </motion.div>

              <motion.p className="text-xs text-white/30 mt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                No monthly fees · First 5 warranties free · £19 per warranty after that
              </motion.p>
            </div>

            <div className="hidden lg:flex justify-center">
              <DashboardMock />
            </div>
          </div>
        </div>

        <div className="relative left-1/2 w-screen -translate-x-1/2 -mb-px">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="block h-[80px] w-full" preserveAspectRatio="none">
            <path d="M0,50 C220,78 470,78 720,58 C980,36 1170,30 1440,55 L1440,80 L0,80 Z" fill="hsl(222 30% 7%)" />
          </svg>
        </div>
      </section>

      {/* Hook / Problem */}
      <section className="bg-[hsl(222_30%_7%)] border-b border-white/5">
        <motion.div className="max-w-2xl mx-auto text-center px-6 pt-14 pb-14" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white leading-[1.15] tracking-[-0.02em] mb-6">
            Most dealers want to run their own warranties…<br />
            <span className="text-white/40">but don't have the system to do it properly</span>
          </h2>

          <div className="text-left max-w-sm mx-auto mb-6 space-y-2.5">
            <p className="text-white/50 text-sm">So what happens?</p>
            {["Claims get messy", "Complaints escalate", "Dealers aren't sure what to say", "Money isn't tracked properly"].map(item => (
              <div key={item} className="flex items-center gap-3 text-white/45 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
            <p className="text-white/35 text-xs pt-1">And suddenly it becomes more stress than it's worth.</p>
          </div>

          <p className="text-lg font-semibold font-display text-primary">WarrantyVault fixes that.</p>
        </motion.div>
      </section>

      {/* DisputeIQ Seller — moved up */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div className="glass-card-strong rounded-2xl p-8 sm:p-10 relative overflow-hidden" initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/8 rounded-full blur-[80px] pointer-events-none" />
            <div className="grid lg:grid-cols-2 gap-8 items-center relative">
              <div>
                <Sparkles className="w-7 h-7 text-primary mb-3" />
                <h2 className="text-2xl sm:text-3xl font-bold font-display mb-3">Not sure how to respond to a complaint?</h2>
                <p className="text-muted-foreground text-base mb-6 max-w-md">
                  DisputeIQ guides you through the situation and helps you send the right response — before things escalate.
                </p>
                <div className="space-y-2.5 mb-6">
                  {["Understand your position instantly", "Get clear next steps", "Send professional responses with confidence"].map(item => (
                    <div key={item} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Button className="btn-cta rounded-full px-7 h-10 text-sm" asChild>
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

      {/* Core Features — 4 cards */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">Everything you need. Nothing you don't.</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">Four focused tools to run self-funded warranties properly.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {coreFeatures.map((f, i) => (
              <motion.div key={f.title} className="glass-card rounded-xl p-6 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-[0_0_20px_-6px_hsl(172,66%,40%,0.15)] transition-all duration-300 group" custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold font-display mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" className="rounded-full px-7 h-10 text-sm border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent" asChild>
              <Link to="/features">See all features <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Differentiator */}
      <section className="py-16 px-6 bg-secondary/20">
        <motion.div className="max-w-2xl mx-auto text-center" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl sm:text-3xl font-bold font-display mb-4">This isn't just warranty software</h2>
          <p className="text-muted-foreground mb-6 text-base max-w-md mx-auto">Most systems help you <strong className="text-foreground/80">log claims</strong>. WarrantyVault helps you:</p>
          <div className="grid sm:grid-cols-2 gap-3 max-w-md mx-auto text-left mb-8">
            {[
              { text: "Understand your position", bold: "Understand" },
              { text: "Avoid saying the wrong thing", bold: "Avoid" },
              { text: "Stay in control financially", bold: "Stay in control" },
              { text: "Run warranties properly end to end", bold: "Run warranties properly" },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-2.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-sm italic">The system dealers wish they had before things go wrong.</p>
        </motion.div>
      </section>

      {/* Warranty Fund */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div className="grid lg:grid-cols-2 gap-8 items-center" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div>
              <Wallet className="w-7 h-7 text-primary mb-3" />
              <h2 className="text-2xl sm:text-3xl font-bold font-display mb-4">Know exactly where you stand financially</h2>
              <p className="text-muted-foreground text-base mb-6 max-w-md">Running your own warranties shouldn't feel risky. WarrantyVault shows you:</p>
              <div className="space-y-2.5 mb-6">
                {["How much you've got set aside", "Your real exposure", "Whether you're underfunding", "What to adjust"].map(item => (
                  <div key={item} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-medium">Run warranties with confidence, not guesswork.</p>
            </div>
            <div className="hidden lg:flex justify-center">
              <FundMock />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">How it works</h2>
            <p className="text-muted-foreground text-sm">Four steps. No complexity.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {steps.map((s, i) => (
              <motion.div key={s.num} className="glass-card rounded-xl p-6" custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <span className="text-2xl font-bold font-display text-primary/30 mb-2 block">{s.num}</span>
                <h3 className="text-base font-semibold font-display mb-1.5">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-sm mb-8">No monthly fees. No contracts. Pay only when you issue a warranty.</p>
          <motion.div className="glass-card-strong rounded-2xl p-8 sm:p-10 glow-primary relative overflow-hidden" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="absolute top-0 right-0 w-44 h-44 bg-primary/8 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative">
              <p className="text-5xl sm:text-6xl font-bold font-display mb-0.5">£0<span className="text-xl text-muted-foreground font-normal">/month</span></p>
              <p className="text-lg font-semibold font-display mb-1.5">Only £19 per warranty</p>
              <p className="text-sm text-[hsl(var(--cta))] font-semibold mb-1">🎉 First 5 warranties FREE</p>
              <p className="text-muted-foreground text-xs mb-6 max-w-xs mx-auto">No contracts. No risk. Cancel anytime.</p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 max-w-xs mx-auto mb-6">
                {["No monthly fees", "No contracts", "Pay only when you use it", "Scale as you grow"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="bg-secondary/40 rounded-lg p-3 mb-6 max-w-xs mx-auto border border-border/20">
                <p className="text-xs">
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

      {/* Testimonials */}
      <section className="py-16 px-6 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-display mb-2">Trusted by UK dealers</h2>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* Final CTA */}
      <section className="hero-gradient pt-16 pb-14 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-3">Run your own warranties with confidence</h2>
          <p className="text-white/45 mb-3 text-base">No monthly fees. No unnecessary complexity. Just a system that works.</p>
          <p className="text-sm text-[hsl(var(--cta))] font-semibold mb-8">Start with 5 free warranties — no risk</p>
          <Button size="lg" className="btn-cta rounded-full px-14 text-base h-14 shadow-[0_0_30px_-4px_hsl(24,100%,50%,0.4)]" asChild>
            <Link to="/signup">Start Free Today <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
          <p className="text-xs text-white/30 mt-4">First 5 warranties free · £19 per warranty after that</p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
