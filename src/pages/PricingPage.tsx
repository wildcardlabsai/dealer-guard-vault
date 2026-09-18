import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import SiteHeader from "@/components/vroom/SiteHeader";
import SiteFooter from "@/components/vroom/SiteFooter";
import PageHero from "@/components/vroom/PageHero";

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" },
};

const included = [
  "Unlimited warranties in your dashboard",
  "Branded warranty certificates",
  "DVLA vehicle lookups",
  "Customer portal for every warranty",
  "Claims management and decisions",
  "Profit and exposure tracking",
];

const faqs = [
  { q: "Is there a monthly platform fee?", a: "No. VROOM has no monthly subscription. You only pay when you issue a warranty." },
  { q: "What happens after my first five free warranties?", a: "You'll pay £15 per warranty issued after that, billed automatically — no invoices to chase, no contracts to sign." },
  { q: "Can I add the Warranty Line?", a: "Yes. The dedicated Warranty Line is a £25/month add-on you can switch on whenever you're ready." },
  { q: "Is there a contract or minimum term?", a: "No. There's no long-term contract — you can stop issuing warranties through VROOM at any time." },
];

export default function PricingPage() {
  return (
    <div className="vroom-site min-h-screen bg-vroom-surface text-vroom-ink">
      <SEOHead
        title="Pricing | VROOM"
        description="Simple, transparent pricing for UK dealers. No monthly platform fee — pay £15 per warranty, with your first five free."
        canonical="https://govroom.co.uk/pricing"
      />

      <SiteHeader />

      <main>
        <PageHero
          eyebrow="Simple Pricing"
          title="Pay for warranties. Not software overhead."
          subtitle="No platform subscription and no long contract. Your first five warranties are free, then pay only when you issue one."
        />

        <section className="bg-vroom-surface px-5 py-20 lg:px-10">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <motion.div {...reveal} className="rounded-2xl border border-vroom-line bg-vroom-panel p-8 text-center shadow-vroom-device sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-vroom-ink-muted">Per warranty</p>
              <p className="mt-3 text-7xl font-bold">£15</p>
              <p className="mt-3 text-sm font-semibold text-vroom-green-deep">£0 monthly platform fee</p>
              <Button size="lg" className="mt-7 h-12 w-full bg-vroom-green px-7 font-bold text-vroom-green-foreground hover:bg-vroom-green-hover" asChild>
                <Link to="/signup">Start with 5 free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <p className="mt-4 text-xs text-vroom-ink-muted">No contracts. Cancel anytime.</p>
            </motion.div>

            <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }}>
              <h2 className="text-3xl font-bold sm:text-4xl">Everything's included from day one</h2>
              <p className="mt-4 text-vroom-ink-muted">No tiers, no add-on fees to unlock core features. Every VROOM dealer gets the full platform.</p>
              <ul className="mt-6 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-vroom-green text-vroom-green-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        <section className="bg-vroom-soft px-5 py-16 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div {...reveal} className="rounded-2xl border border-vroom-line bg-vroom-panel p-8 shadow-sm sm:p-10">
              <h2 className="text-2xl font-bold sm:text-3xl">Want a dedicated warranty line too?</h2>
              <p className="mx-auto mt-4 max-w-xl text-vroom-ink-muted">Add a branded phone line for warranty enquiries and claims for £25/month, on top of any VROOM plan.</p>
              <Button variant="outline" className="mt-6 border-vroom-line text-vroom-ink hover:bg-vroom-soft" asChild>
                <Link to="/warranty-line">See Warranty Line <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="bg-vroom-surface px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-center text-3xl font-bold sm:text-4xl">Pricing questions</h2>
            <div className="space-y-4">
              {faqs.map((item, i) => (
                <motion.div key={item.q} custom={i} {...reveal} className="rounded-xl border border-vroom-line bg-vroom-panel p-6 shadow-sm">
                  <h3 className="font-semibold">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-vroom-ink-muted">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-vroom-dark px-5 py-20 text-vroom-hero-fg lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to keep more of every warranty?</h2>
            <p className="mb-8 text-lg text-vroom-hero-muted">Your first five warranties are free — no card required to get started.</p>
            <Button size="lg" className="h-12 bg-vroom-green px-10 font-bold text-vroom-green-foreground hover:bg-vroom-green-hover" asChild>
              <Link to="/signup">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
