import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEOHead from "@/components/SEOHead";
import { Helmet } from "react-helmet-async";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

const faqCategories = [
  {
    category: "Getting Started",
    items: [
      { question: "What is a self-funded warranty?", answer: "A self-funded warranty means you, the dealer, underwrite the warranty yourself rather than paying a third-party provider. You set the terms, control the claims process, and keep the profit margin that would otherwise go to an external insurer." },
      { question: "Do I need FCA authorisation to offer self-funded warranties?", answer: "If you're offering warranties as part of a vehicle sale and they're included in the price, you typically don't need FCA authorisation. However, if you're selling standalone warranty products separately, you may need to be FCA-regulated. We recommend checking with the FCA or a compliance adviser for your specific setup." },
      { question: "Is WarrantyVault suitable for independent dealers?", answer: "Absolutely. WarrantyVault is built for independent and small-group dealers who want to take control of their warranty process without the overhead of enterprise software. You can start with a single dealership and scale as you grow." },
      { question: "What does WarrantyVault cost?", answer: "There are no monthly fees or subscriptions. You pay £15 per warranty issued — that's it. No setup costs, no hidden charges, and no long-term contracts. New dealers also get their first 5 warranties completely free." },
      { question: "How do I sign up as a dealer?", answer: "Click 'Apply for Access' on the homepage and fill in your dealership details. Our team reviews every application and you'll receive an email with your login credentials once approved. The process typically takes 1–2 working days." },
    ],
  },
  {
    category: "Warranty Management",
    items: [
      { question: "How do I create a new warranty?", answer: "From your dealer dashboard, click 'Add Warranty'. You'll go through a simple 4-step wizard: enter the vehicle registration (we auto-lookup details via DVLA), add customer information, choose your cover template and duration, then confirm payment. The warranty is issued instantly." },
      { question: "Can I create custom cover templates?", answer: "Yes. The Cover Templates feature lets you define exactly what's covered, conditionally covered, and excluded. Create multiple templates (e.g., Bronze, Silver, Gold) with different component lists, labour rate caps, and claim limits. Templates are reusable across all warranties." },
      { question: "How does the free warranty allocation work?", answer: "Every new dealer gets 5 free warranties to start. The system tracks your usage automatically — you can see how many free warranties you have remaining on your dashboard. Once used, each warranty costs £15." },
      { question: "Can I renew an expiring warranty?", answer: "Yes. Warranties with 30 days or less remaining show a 'Renew' option. Clicking it pre-fills the warranty wizard with the existing vehicle and customer details, so you only need to confirm the new duration and payment." },
      { question: "How do customers view their warranty?", answer: "Each customer gets access to a dedicated portal where they can view their warranty details, see what's covered, download their certificate, and track the remaining days on a visual countdown. They receive login credentials via email when you issue the warranty." },
      { question: "Can I download or email warranty certificates?", answer: "Yes. You can download, print, or email PDF warranty certificates directly from the warranties list. Customers can also download their own certificate from their portal at any time." },
    ],
  },
  {
    category: "Claims & Claim Assist",
    items: [
      { question: "How does the claims process work?", answer: "Customers submit claims through their portal with a description of the issue. You receive a notification, review the claim on your dashboard, and can approve, reject, or request more information. The entire process is tracked with a timeline visible to both parties." },
      { question: "What is Claim Assist?", answer: "Claim Assist is an AI-powered triage tool that helps you process claims faster. It automatically categorises claims by priority, suggests whether they fall within the cover template, and provides a recommended course of action — saving you time on every claim." },
      { question: "Can I set claim limits and labour rates?", answer: "Yes. In your Claim Settings, you can set a maximum per-claim limit and a maximum labour rate. These are enforced when reviewing claims and help you manage costs consistently across your warranty portfolio." },
      { question: "How do customers track their claim status?", answer: "Customers see a real-time claim tracker in their portal showing steps: Submitted → Under Review → Decision. They can also view messages from you and reply if you've requested additional information." },
    ],
  },
  {
    category: "DisputeIQ",
    items: [
      { question: "What is DisputeIQ?", answer: "DisputeIQ is an AI-powered dispute resolution tool that helps you handle customer complaints professionally. It analyses the complaint, assesses your legal position under the Consumer Rights Act 2015, identifies risks, and generates tailored response options — from conciliatory to firm." },
      { question: "Does DisputeIQ give legal advice?", answer: "No. DisputeIQ provides guidance based on common consumer law scenarios, but it's not a substitute for professional legal advice. It helps you respond appropriately and consistently, but for complex or escalated disputes, we recommend consulting a legal professional." },
      { question: "Can I edit the AI-generated responses?", answer: "Yes. DisputeIQ generates multiple response options which you can select, edit, and personalise before sending. You're always in control of what goes to the customer." },
    ],
  },
  {
    category: "Warranty Fund",
    items: [
      { question: "What is the Warranty Fund?", answer: "The Warranty Fund dashboard shows you a real-time view of your warranty revenue vs. claims paid out. It helps you track your fund health, contribution ratios, and ensures you're maintaining a healthy reserve to cover future claims." },
      { question: "How much should I set aside for claims?", answer: "WarrantyVault provides smart contribution recommendations based on your claim history and active warranties. As a general rule, setting aside 30–50% of warranty revenue as a claims reserve is considered prudent." },
      { question: "How much can I save compared to third-party providers?", answer: "Most dealers see significantly higher margins — typically keeping 70–90% of the warranty price instead of 20–40% with third-party providers. Your actual savings depend on claim rates, coverage levels, and pricing." },
    ],
  },
  {
    category: "Warranty Line",
    items: [
      { question: "What is the Warranty Line?", answer: "The Warranty Line gives your dealership a dedicated phone number for warranty claims and enquiries. Customers call the number and are routed through an IVR system to the right department, giving your business a professional, branded claims experience." },
      { question: "Can I customise the phone system?", answer: "Yes. You can set up custom greetings, IVR menu options (e.g., 'Press 1 for new claim'), call forwarding to your team, hold music, and voicemail with email notifications. Everything is managed from your dealer dashboard." },
    ],
  },
  {
    category: "Customer Portal",
    items: [
      { question: "How do customers get access to their portal?", answer: "When you issue a warranty, the customer receives a welcome email with their login credentials. They can also request a password reset from the customer login page. You can resend the welcome email at any time from your customer list." },
      { question: "What can customers do in their portal?", answer: "Customers can view their warranty details and countdown timer, see exactly what's covered under their template, download their warranty certificate, submit and track claims, send requests (extensions, updates, cancellations), and access the knowledge base for self-service help." },
      { question: "Can customers submit requests other than claims?", answer: "Yes. Customers can submit warranty extension requests, detail update requests, and cancellation requests through their portal. You review and approve these from your dealer dashboard." },
    ],
  },
  {
    category: "Account & Security",
    items: [
      { question: "How do I reset my password?", answer: "Click 'Forgot password?' on the login page and enter your email. You'll receive a reset link that takes you to a secure page where you can set a new password. Passwords must be at least 8 characters with a mix of uppercase, lowercase, and numbers." },
      { question: "Is my data secure?", answer: "Yes. All data is stored securely in an encrypted database with row-level security policies. Your data is isolated from other dealers and only accessible by authorised users. We use industry-standard authentication and never store passwords in plain text." },
      { question: "What happens if I get a large claim I can't cover?", answer: "Smart dealers set aside a claims reserve fund from warranty revenue. WarrantyVault's fund tracking helps you monitor your reserve ratio so you're always prepared. Some dealers also use a hybrid model — self-funding smaller claims while insuring against catastrophic losses." },
    ],
  },
];

const allFaqItems = faqCategories.flatMap(c => c.items);

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories = faqCategories
    .map(cat => ({
      ...cat,
      items: cat.items.filter(faq =>
        (!search || faq.question.toLowerCase().includes(search.toLowerCase()) || faq.answer.toLowerCase().includes(search.toLowerCase())) &&
        (!activeCategory || cat.category === activeCategory)
      ),
    }))
    .filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Self-Funded Warranty FAQ for UK Car Dealers | WarrantyVault"
        description="Common questions about self-funded car warranties for UK dealers. Learn about FCA authorisation, margins, claims management, DisputeIQ, Warranty Fund, and how WarrantyVault works."
        canonical="https://dealer-guard-vault.lovable.app/faq"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: allFaqItems.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          })}
        </script>
      </Helmet>

      <PublicNav currentPage="/faq" />

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">FAQ</span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-white mt-6 mb-4">Common questions from UK dealers</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-8">Everything you need to know about self-funding your warranties with WarrantyVault.</p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="px-6 py-6 border-b border-border/30">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!activeCategory ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            All
          </button>
          {faqCategories.map(cat => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === cat.category ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Items by Category */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          {filteredCategories.map(cat => (
            <div key={cat.category}>
              <h2 className="text-lg font-semibold font-display mb-4 text-primary">{cat.category}</h2>
              <div className="space-y-3">
                {cat.items.map((faq, i) => (
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
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium mb-2">No matching questions found</p>
              <p className="text-sm">Try a different search term or browse all categories.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">Still have questions?</h2>
          <p className="text-white/50 mb-8 text-lg">Check our knowledge base, sign up and see it for yourself, or get in touch.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-cta rounded-full px-10 text-base h-12" asChild>
              <Link to="/signup">Sign Up <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 text-base h-12 border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent" asChild>
              <Link to="/knowledge-base">Knowledge Base</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-10 text-base h-12 border-white/15 text-white/80 hover:bg-white/5 hover:text-white bg-transparent" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
          <p className="text-xs text-white/30 mt-5">No monthly fees. £15 per warranty.</p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
