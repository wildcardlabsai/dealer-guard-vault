import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import SiteHeader from "@/components/vroom/SiteHeader";
import SiteFooter from "@/components/vroom/SiteFooter";
import { Helmet } from "react-helmet-async";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

const faqItems = [
  { question: "What is a self-funded warranty?", answer: "A self-funded warranty means you, the dealer, underwrite the warranty yourself rather than paying a third-party provider. You set the terms, control the claims process, and keep the profit margin that would otherwise go to an external insurer." },
  { question: "Do I need FCA authorisation to offer self-funded warranties?", answer: "If you're offering warranties as part of a vehicle sale and they're included in the price, you typically don't need FCA authorisation. However, if you're selling standalone warranty products separately, you may need to be FCA-regulated. We recommend checking with the FCA or a compliance adviser for your specific setup." },
  { question: "How much can I save compared to third-party warranty providers?", answer: "Most dealers see significantly higher margins — typically keeping 70–90% of the warranty price instead of 20–40% with third-party providers. Your actual savings depend on claim rates, coverage levels, and pricing, but the shift to self-funding almost always increases profitability." },
  { question: "How does VROOM help me manage claims?", answer: "VROOM gives you a complete claims dashboard where you can review, approve, or reject claims in real time. Customers submit claims through their portal, you get notified instantly, and you make the decision — no third-party delays or queues." },
  { question: "What happens if I get a large claim I can't cover?", answer: "Smart dealers set aside a claims reserve fund from warranty revenue. VROOM's profit tracking helps you monitor your reserve ratio so you're always prepared. Some dealers also use a hybrid model — self-funding smaller claims while insuring against catastrophic losses." },
  { question: "Is VROOM suitable for independent dealers?", answer: "Absolutely. VROOM is built for independent and small-group dealers who want to take control of their warranty process without the overhead of enterprise software. You can start with a single dealership and scale as you grow." },
  { question: "How do customers view their warranty and submit claims?", answer: "Each customer gets access to a dedicated portal where they can view their warranty details, download their certificate, and submit claims directly. This reduces inbound calls and gives customers a professional, transparent experience." },
  { question: "What does VROOM cost?", answer: "There are no monthly fees or subscriptions. You pay £15 per warranty issued — that's it. No setup costs, no hidden charges, and no long-term contracts." },
];

export default function FAQPage() {
  return (
    <div className="vroom-site min-h-screen bg-vroom-surface text-vroom-ink">
      <SEOHead
        title="Self-Funded Warranty FAQ for UK Car Dealers | VROOM"
        description="Common questions about self-funded car warranties for UK dealers. Learn about FCA authorisation, margins, claims management, and how VROOM works."
        canonical="https://govroom.co.uk/faq"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          })}
        </script>
      </Helmet>

      <SiteHeader />

      <main>
        <section className="bg-vroom-dark px-5 pb-16 pt-40 text-vroom-hero-fg lg:px-10 lg:pt-44">
          <div className="mx-auto max-w-3xl text-center">
            <span className="rounded-full bg-vroom-green/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-vroom-green">FAQ</span>
            <h1 className="mb-4 mt-6 text-4xl font-bold sm:text-5xl">Common questions from UK dealers</h1>
            <p className="mx-auto max-w-2xl text-lg text-vroom-hero-muted">Everything you need to know about self-funding your warranties with VROOM.</p>
          </div>
        </section>

        <section className="bg-vroom-surface px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-3xl space-y-4">
            {faqItems.map((faq, i) => (
              <motion.details
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group rounded-xl border border-vroom-line bg-vroom-panel shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-sm font-semibold [&::-webkit-details-marker]:hidden sm:text-base">
                  {faq.question}
                  <ChevronRight className="h-4 w-4 shrink-0 text-vroom-ink-muted transition-transform group-open:rotate-90" />
                </summary>
                <div className="border-t border-vroom-line px-6 pb-5 pt-4 text-sm leading-relaxed text-vroom-ink-muted">
                  {faq.answer}
                </div>
              </motion.details>
            ))}
          </div>
        </section>

        <section className="bg-vroom-dark px-5 py-20 text-vroom-hero-fg lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Still have questions?</h2>
            <p className="mb-8 text-lg text-vroom-hero-muted">Sign up and see it for yourself — or get in touch.</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="h-12 bg-vroom-green px-10 font-bold text-vroom-green-foreground hover:bg-vroom-green-hover" asChild>
                <Link to="/signup">Sign Up <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 border-vroom-hero-border bg-transparent px-10 text-vroom-hero-fg hover:bg-vroom-hero-soft hover:text-vroom-hero-fg" asChild>
                <a href="mailto:dealeropsdms@gmail.com">Contact Us</a>
              </Button>
            </div>
            <p className="mt-5 text-xs text-vroom-hero-muted">No monthly fees. £15 per warranty.</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
