import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, AlertTriangle, MessageSquare, Brain, ArrowRight, CheckCircle2,
  Zap, FileText, Eye, TrendingDown, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

const painPoints = [
  { icon: AlertTriangle, text: "Refund demands" },
  { icon: MessageSquare, text: "Angry customers" },
  { icon: TrendingDown, text: "Negative reviews" },
  { icon: Shield, text: "Chargebacks / finance disputes" },
  { icon: Zap, text: "Saying the wrong thing too early" },
];

const steps = [
  { num: "1", title: "Enter the situation", desc: "Tell us what happened — complaint type, dates, mileage, and customer message.", icon: FileText },
  { num: "2", title: "Get guided outcome", desc: "AI analyses your position under Consumer Rights Act and gives clear guidance.", icon: Brain },
  { num: "3", title: "Send the right response", desc: "Choose from 4 tailored response styles. Edit, adjust tone, and send with confidence.", icon: MessageSquare },
];

export default function DisputeIQPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Consumer Rights Act Help for Car Dealers | DisputeIQ"
        description="Handle customer complaints properly with DisputeIQ. Get guidance, risk levels, and response templates for UK car dealers."
        canonical="https://dealer-guard-vault.lovable.app/disputeiq"
      />
      <PublicNav currentPage="/disputeiq" />

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute top-10 right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-20 left-[5%] w-[400px] h-[400px] bg-[hsl(var(--cta))]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative pt-32 pb-20 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-3 mb-6 justify-center">
            <Sparkles className="w-4 h-4 text-[hsl(var(--cta))]" />
            <span className="text-sm text-white/60 font-semibold tracking-[0.2em] uppercase">AI-Powered</span>
          </motion.div>
          <motion.h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight text-white leading-[1.05] mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            Not sure how to respond to a<br />customer complaint<span className="text-[hsl(var(--cta))]">?</span>
          </motion.h1>
          <motion.p className="text-lg text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            DisputeIQ guides you through the situation and helps you send the right response — before things escalate.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Button size="lg" className="btn-cta text-base px-10 rounded-full h-14" asChild>
              <a href="#how-it-works">See DisputeIQ in Action <ArrowRight className="ml-2 w-4 h-4" /></a>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-10 rounded-full h-14 border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent" asChild>
              <Link to="/signup">Start Free</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Pain Section */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2 className="text-3xl sm:text-4xl font-bold font-display mb-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            When complaints go wrong, they get <span className="text-destructive">expensive</span>
          </motion.h2>
          <motion.p className="text-muted-foreground mb-12 max-w-2xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            One poorly worded reply can turn a simple complaint into a refund, a chargeback, or worse.
          </motion.p>
          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {painPoints.map((p, i) => (
              <motion.div key={i} className="glass-card rounded-xl p-5 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <p.icon className="w-6 h-6 mx-auto mb-3 text-destructive/70" />
                <p className="text-sm font-medium">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2 className="text-3xl sm:text-4xl font-bold font-display mb-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            DisputeIQ gives you a <span className="text-primary">clear way</span> to handle it
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: Eye, title: "Understand your position", desc: "Instant CRA classification tells you exactly where you stand — under 30 days, 30 days to 6 months, or 6+ months." },
              { icon: CheckCircle2, title: "Know what to do next", desc: "AI-powered reasoning gives you a clear suggested approach, risk level, and tone recommendation." },
              { icon: MessageSquare, title: "Send the right response", desc: "Choose from 4 AI-generated response styles, tweak the tone, and reply with confidence." },
            ].map((item, i) => (
              <motion.div key={i} className="glass-card rounded-xl p-6 text-left" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold font-display mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2 className="text-3xl sm:text-4xl font-bold font-display mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            How it works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div key={i} className="relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <div className="glass-card rounded-xl p-8 text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-lg font-bold text-primary font-display">
                    {step.num}
                  </div>
                  <step.icon className="w-8 h-8 mx-auto mb-4 text-primary/60" />
                  <h3 className="font-semibold font-display mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
                {i < 2 && <ArrowRight className="hidden md:block absolute top-1/2 -right-6 w-5 h-5 text-muted-foreground/30" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <div className="inline-flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">AI-Powered</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
                AI-powered reasoning,<br />explained <span className="text-primary">simply</span>
              </h2>
              <div className="space-y-4 mt-6">
                {[
                  "Understands timelines, mileage, and context",
                  "Explains your likely position in plain English",
                  "Highlights escalation risks before they happen",
                  "Helps you avoid saying the wrong thing",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{t}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div className="glass-card rounded-xl p-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">AI Reasoning Output</p>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="font-medium text-foreground mb-1">Situation Summary</p>
                  <p className="text-muted-foreground">Customer reporting engine warning light 47 days after purchase. Vehicle still drivable. No prior repairs authorised.</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30">
                  <p className="font-medium text-foreground mb-1">Your Likely Position</p>
                  <p className="text-muted-foreground">Within 6-month window — fault presumed present at sale. Offer repair as first remedy.</p>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[hsl(var(--cta))]/10 border border-[hsl(var(--cta))]/20">
                  <AlertTriangle className="w-4 h-4 text-[hsl(var(--cta))]" />
                  <p className="text-sm font-medium text-[hsl(var(--cta))]">Medium Risk — Handle carefully</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Output Preview — Hero treatment for the flagship free tool */}
      <section className="py-24 md:py-32 bg-background section-hairline">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.span className="eyebrow eyebrow-cta" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            Live Output
          </motion.span>
          <motion.h2 className="text-4xl sm:text-5xl font-bold font-display tracking-tight mb-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            See what DisputeIQ generates
          </motion.h2>
          <motion.p className="text-muted-foreground mb-12 leading-relaxed max-w-xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
            Professional responses, ready to send — tailored to your exact situation.
          </motion.p>
          <motion.div className="glass-card rounded-2xl p-10 sm:p-12 text-left max-w-3xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <p className="text-xs font-semibold text-primary uppercase tracking-[0.18em]">Helpful Response · Ready to Send</p>
            </div>
            <div className="text-base text-foreground leading-relaxed space-y-4">
              <p>Hi James,</p>
              <p>Thanks for getting in touch and letting us know about the issue with the engine warning light. I completely understand how frustrating this must be.</p>
              <p>We take all customer concerns seriously, and I'd like to arrange for our workshop to inspect the vehicle at our earliest convenience — at no cost to you.</p>
              <p>Could you let me know a day that works for you? We'll get this looked at as quickly as possible.</p>
              <p>Kind regards,<br />Mike — Premier Motors</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 bg-card/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.p className="text-lg text-muted-foreground font-medium" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            Built for <span className="text-foreground font-semibold">UK car dealers</span> dealing with real-world complaints
          </motion.p>
          <motion.p className="text-sm text-muted-foreground/60 mt-2" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            DisputeIQ is not legal advice. It provides structured guidance to help you respond professionally and avoid common mistakes.
          </motion.p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            Stop guessing. Start responding <span className="text-[hsl(var(--cta))]">properly.</span>
          </motion.h2>
          <motion.p className="text-white/50 mb-3 max-w-xl mx-auto"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            Join the dealers who handle complaints with confidence, not fear.
          </motion.p>
          <motion.p className="text-sm text-[hsl(var(--cta))] font-semibold mb-8"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1.5}>
            🎉 DisputeIQ is completely free — no warranty purchase required. Just sign up.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
            <Button size="lg" className="btn-cta text-base px-10 rounded-full h-14" asChild>
              <Link to="/signup">Try DisputeIQ Free <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
