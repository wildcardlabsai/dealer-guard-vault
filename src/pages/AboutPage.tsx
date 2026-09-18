import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Users, Wrench } from "lucide-react";
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

const values = [
  { icon: ShieldCheck, title: "Built for dealers, not providers", copy: "Most warranty software is built around the provider's process. We built VROOM around how dealers actually work." },
  { icon: Wrench, title: "Keep control in-house", copy: "Warranties, claims and customer relationships stay with your dealership — not handed off to a third party." },
  { icon: Users, title: "No hidden overhead", copy: "One clear price per warranty. No platform subscription, no setup fees, no long contracts." },
];

export default function AboutPage() {
  return (
    <div className="vroom-site min-h-screen bg-vroom-surface text-vroom-ink">
      <SEOHead
        title="About VROOM | Dealer Aftersales, Simplified"
        description="VROOM is built by Wildcard Labs to help UK motor dealers run self-funded warranties, claims and aftersales in-house."
        canonical="https://govroom.co.uk/about"
      />

      <SiteHeader />

      <main>
        <PageHero
          eyebrow="About VROOM"
          title="Aftersales built for dealers, by people who understand the trade"
          subtitle="VROOM gives UK motor dealers a clearer, more profitable way to run warranties, claims and customer care — without the overhead of third-party providers."
        />

        <section className="bg-vroom-surface px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <motion.p {...reveal} className="text-lg leading-8 text-vroom-ink-muted">
              For years, warranty providers have taken a cut of every deal a dealer sells — while dealers carry the relationship with the customer. VROOM was built to flip that: give dealers the tools to self-fund and manage warranties themselves, keep the margin they've earned, and give customers a faster, more transparent experience along the way.
            </motion.p>
          </div>
        </section>

        <section className="bg-vroom-soft px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">What we believe</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {values.map((v, i) => (
                <motion.div key={v.title} custom={i} {...reveal} className="rounded-xl border border-vroom-line bg-vroom-panel p-6 shadow-sm">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-vroom-green/10">
                    <v.icon className="h-5 w-5 text-vroom-green-deep" />
                  </div>
                  <h3 className="mb-2 font-semibold">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-vroom-ink-muted">{v.copy}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-vroom-surface px-5 py-20 lg:px-10">
          <motion.div {...reveal} className="mx-auto max-w-3xl rounded-2xl border border-vroom-line bg-vroom-panel p-8 shadow-sm sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-vroom-ink-muted">Who's behind it</p>
            <p className="mt-4 text-lg leading-8 text-vroom-ink">
              VROOM is built and maintained by <strong>Wildcard Labs</strong>. We work directly with UK dealers to keep the platform grounded in how warranties and claims actually get handled on the ground — not how a provider thinks they should.
            </p>
          </motion.div>
        </section>

        <section className="bg-vroom-dark px-5 py-20 text-vroom-hero-fg lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Want to see it in action?</h2>
            <p className="mb-8 text-lg text-vroom-hero-muted">Your first five warranties are free — no card required to get started.</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="h-12 bg-vroom-green px-10 font-bold text-vroom-green-foreground hover:bg-vroom-green-hover" asChild>
                <Link to="/signup">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 border-vroom-hero-border bg-transparent px-10 text-vroom-hero-fg hover:bg-vroom-hero-soft hover:text-vroom-hero-fg" asChild>
                <a href="mailto:dealeropsdms@gmail.com?subject=VROOM%20enquiry">Get in Touch</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
