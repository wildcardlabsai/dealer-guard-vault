import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/warrantylogo.png";
import SEOHead from "@/components/SEOHead";
import { Helmet } from "react-helmet-async";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

const faqItems = [
  { question: "What is a self-funded warranty?", answer: "A self-funded warranty means you, the dealer, underwrite the warranty yourself rather than paying a third-party provider. You set the terms, control the claims process, and keep the profit margin that would otherwise go to an external insurer." },
  { question: "Do I need FCA authorisation to offer self-funded warranties?", answer: "If you're offering warranties as part of a vehicle sale and they're included in the price, you typically don't need FCA authorisation. However, if you're selling standalone warranty products separately, you may need to be FCA-regulated. We recommend checking with the FCA or a compliance adviser for your specific setup." },
  { question: "How much can I save compared to third-party warranty providers?", answer: "Most dealers see significantly higher margins — typically keeping 70–90% of the warranty price instead of 20–40% with third-party providers. Your actual savings depend on claim rates, coverage levels, and pricing, but the shift to self-funding almost always increases profitability." },
  { question: "How does WarrantyVault help me manage claims?", answer: "WarrantyVault gives you a complete claims dashboard where you can review, approve, or reject claims in real time. Customers submit claims through their portal, you get notified instantly, and you make the decision — no third-party delays or queues." },
  { question: "What happens if I get a large claim I can't cover?", answer: "Smart dealers set aside a claims reserve fund from warranty revenue. WarrantyVault's profit tracking helps you monitor your reserve ratio so you're always prepared. Some dealers also use a hybrid model — self-funding smaller claims while insuring against catastrophic losses." },
  { question: "Is WarrantyVault suitable for independent dealers?", answer: "Absolutely. WarrantyVault is built for independent and small-group dealers who want to take control of their warranty process without the overhead of enterprise software. You can start with a single dealership and scale as you grow." },
  { question: "How do customers view their warranty and submit claims?", answer: "Each customer gets access to a dedicated portal where they can view their warranty details, download their certificate, and submit claims directly. This reduces inbound calls and gives customers a professional, transparent experience." },
  { question: "What does WarrantyVault cost?", answer: "There are no monthly fees or subscriptions. You pay £19 per warranty issued — that's it. No setup costs, no hidden charges, and no long-term contracts." },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Self-Funded Warranty FAQ for UK Car Dealers | WarrantyVault"
        description="Common questions about self-funded car warranties for UK dealers. Learn about FCA authorisation, margins, claims management, and how WarrantyVault works."
        canonical="https://dealer-guard-vault.lovable.app/faq"
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

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[hsl(var(--hero-bg))]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link to="/"><img src={logo} alt="WarrantyVault" className="h-10" /></Link>
          <div className="hidden md:flex items-center gap-10 text-[15px] text-white/70">
            <Link to="/features" className="hover:text-white transition-colors">Features</Link>
            <Link to="/faq" className="text-white transition-colors">FAQ</Link>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10 text-[15px]" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button size="sm" className="btn-cta rounded-full px-6 text-[15px] h-10" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">FAQ</span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-white mt-6 mb-4">Common questions from UK dealers</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">Everything you need to know about self-funding your warranties with WarrantyVault.</p>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((faq, i) => (
            <motion.details
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="glass-card rounded-xl group"
            >
              <summary className="cursor-pointer px-6 py-5 font-semibold text-sm sm:text-base list-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                {faq.answer}
              </div>
            </motion.details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">Still have questions?</h2>
          <p className="text-white/50 mb-8 text-lg">Sign up and see it for yourself — or get in touch.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-cta rounded-full px-10 text-base h-12" asChild>
              <Link to="/signup">Sign Up <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 text-base h-12 border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent">
              Contact Us
            </Button>
          </div>
          <p className="text-xs text-white/30 mt-5">No monthly fees. £19 per warranty.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 hero-gradient">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/"><img src={logo} alt="WarrantyVault" className="h-6 opacity-60" /></Link>
          <p className="text-xs text-muted-foreground">Built by <span className="text-foreground font-medium">Wildcard Labs</span></p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
