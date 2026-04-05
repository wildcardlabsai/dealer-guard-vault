import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, ArrowRight, CheckCircle2, Phone, PhoneForwarded,
  Headphones, Music, MessageSquare, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

const lineFeatures = [
  { icon: MessageSquare, title: "Custom Greeting", desc: "Answer calls with your dealership name and a professional warranty message." },
  { icon: Music, title: "Hold Music & Branding", desc: "Custom hold music that reinforces your brand while customers wait." },
  { icon: Phone, title: "Simple Menu System", desc: "Route callers to the right person — claims, enquiries, or general support." },
  { icon: PhoneForwarded, title: "Calls Routed to You", desc: "Calls go straight to your team. No third-party call centres." },
  { icon: Shield, title: "Separate from Sales Line", desc: "Keep warranty calls separate from your main sales number." },
  { icon: Zap, title: "Set Up in 24 Hours", desc: "We handle the setup. You just start answering warranty calls." },
];

const benefits = [
  "Customers get a dedicated number for warranty queries",
  "Professional IVR with your dealership branding",
  "Separate warranty calls from your busy sales line",
  "Custom hold music and greeting messages",
  "Calls route directly to your chosen team members",
  "No third-party call centres — you stay in control",
  "Looks and sounds like a proper warranty department",
  "Cancel anytime — no long-term contracts",
];

export default function WarrantyLinePage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Dedicated Warranty Phone Line for Car Dealers | WarrantyVault"
        description="Give your dealership a professional dedicated warranty phone line with custom greetings, hold music, and IVR routing. Only £25/month. Set up in 24 hours."
        canonical="https://dealer-guard-vault.lovable.app/warranty-line"
      />

      {/* Nav */}
      <PublicNav />

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[hsl(var(--cta))] text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Optional Add-On</span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-white mb-4">Look like a proper warranty department</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">Give your customers a dedicated phone line for warranty enquiries and claims. Professional, branded, and fully under your control.</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {lineFeatures.map((item, i) => (
              <motion.div key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-card rounded-xl p-6">
                <div className="w-11 h-11 rounded-xl bg-[hsl(var(--cta))]/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-[hsl(var(--cta))]" />
                </div>
                <h3 className="font-semibold font-display mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits + Pricing Card */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_380px] gap-10 items-start">
          <div>
            <h2 className="text-3xl font-bold font-display mb-6">Why dealers add a warranty line</h2>
            <p className="text-muted-foreground mb-8">Stop giving out personal mobiles for warranty calls. A dedicated number keeps things professional and separates warranty queries from your sales pipeline.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {benefits.map(b => (
                <div key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(var(--cta))] flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <motion.div className="glass-card-strong rounded-2xl p-8 text-center sticky top-24" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
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
      </section>

      {/* CTA */}
      <section className="hero-gradient pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">Ready to sound professional?</h2>
          <p className="text-white/50 mb-8 text-lg">Add a dedicated warranty line and separate warranty calls from sales.</p>
          <Button size="lg" className="btn-cta rounded-full px-10 text-base h-12" asChild>
            <Link to="/signup">Get Started <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
          <p className="text-xs text-white/30 mt-5">£25/month. Cancel anytime.</p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
