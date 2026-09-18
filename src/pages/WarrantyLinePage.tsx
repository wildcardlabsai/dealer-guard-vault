import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, ArrowRight, CheckCircle2, Phone, PhoneForwarded,
  Headphones, Music, MessageSquare, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import SiteHeader from "@/components/vroom/SiteHeader";
import SiteFooter from "@/components/vroom/SiteFooter";

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
    <div className="vroom-site min-h-screen bg-vroom-surface text-vroom-ink">
      <SEOHead
        title="Dedicated Warranty Phone Line for Car Dealers | VROOM"
        description="Give your dealership a professional dedicated warranty phone line with custom greetings, hold music, and IVR routing. Only £25/month. Set up in 24 hours."
        canonical="https://govroom.co.uk/warranty-line"
      />

      <SiteHeader />

      <main>
        <section className="bg-vroom-dark px-5 pb-16 pt-40 text-vroom-hero-fg lg:px-10 lg:pt-44">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-vroom-green">Optional Add-On</p>
            <h1 className="text-4xl font-bold leading-[1.04] sm:text-5xl">Look like a proper warranty department</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-7 text-vroom-hero-muted">Give your customers a dedicated phone line for warranty enquiries and claims. Professional, branded, and fully under your control.</p>
          </div>
        </section>

        <section className="bg-vroom-surface px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {lineFeatures.map((item, i) => (
                <motion.div key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-xl border border-vroom-line bg-vroom-panel p-6 shadow-sm">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-vroom-green/10">
                    <item.icon className="h-5 w-5 text-vroom-green-deep" />
                  </div>
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-vroom-ink-muted">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-vroom-soft px-5 py-20 lg:px-10">
          <div className="mx-auto grid max-w-5xl items-start gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              <h2 className="mb-6 text-3xl font-bold">Why dealers add a warranty line</h2>
              <p className="mb-8 text-vroom-ink-muted">Stop giving out personal mobiles for warranty calls. A dedicated number keeps things professional and separates warranty queries from your sales pipeline.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {benefits.map(b => (
                  <div key={b} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-vroom-green-deep" />
                    <span className="text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.div className="sticky top-24 rounded-2xl border border-vroom-line bg-vroom-panel p-8 text-center shadow-vroom-device" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-vroom-green/10">
                <Headphones className="h-7 w-7 text-vroom-green-deep" />
              </div>
              <h3 className="mb-1 text-xl font-bold">Dedicated Warranty Line</h3>
              <p className="mb-1 text-3xl font-bold">£25<span className="text-base font-normal text-vroom-ink-muted">/month</span></p>
              <p className="mb-6 text-xs text-vroom-ink-muted">Add to any VROOM plan</p>
              <div className="mb-6 space-y-3 text-left">
                {["Dedicated phone number", "Custom greeting with your name", "Hold music & branding", "Call routing to your team", "No long-term contract"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-vroom-green-deep" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-vroom-green font-bold text-vroom-green-foreground hover:bg-vroom-green-hover" asChild>
                <Link to="/signup">Add Warranty Line</Link>
              </Button>
              <p className="mt-3 text-[11px] text-vroom-ink-muted">Cancel anytime. Set up in 24 hours.</p>
            </motion.div>
          </div>
        </section>

        <section className="bg-vroom-dark px-5 py-20 text-vroom-hero-fg lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to sound professional?</h2>
            <p className="mb-8 text-lg text-vroom-hero-muted">Add a dedicated warranty line and separate warranty calls from sales.</p>
            <Button size="lg" className="h-12 bg-vroom-green px-10 font-bold text-vroom-green-foreground hover:bg-vroom-green-hover" asChild>
              <Link to="/signup">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <p className="mt-5 text-xs text-vroom-hero-muted">£25/month. Cancel anytime.</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
