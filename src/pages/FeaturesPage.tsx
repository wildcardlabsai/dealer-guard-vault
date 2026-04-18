import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Shield, ArrowRight, CheckCircle2, X,
  BarChart3, UserCheck, ClipboardCheck,
  Phone, FileText, FolderOpen, Headphones,
  Sparkles, Wallet, Gavel, FileSearch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import SEOHead from "@/components/SEOHead";

import {
  WarrantyManagementMock, CustomerPortalMock, ClaimsManagementMock,
  ClaimAssistMock, DisputeIQMock, WarrantyFundMock, ProfitTrackingMock,
  WarrantyLineMock, CoverTemplatesMock, DocumentsMock, SupportMock
} from "@/components/features/FeatureMocks";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

const featureOverview = [
  { icon: Shield, title: "Warranty Management" },
  { icon: UserCheck, title: "Customer Portal" },
  { icon: ClipboardCheck, title: "Claims Management" },
  { icon: Gavel, title: "Claim Assist" },
  { icon: FileSearch, title: "Evidence Pack" },
  { icon: Sparkles, title: "DisputeIQ" },
  { icon: Wallet, title: "Warranty Fund" },
  { icon: BarChart3, title: "Profit Tracking" },
  { icon: Phone, title: "Warranty Line" },
  { icon: FileText, title: "Cover Templates" },
  { icon: FolderOpen, title: "Documents" },
  { icon: Headphones, title: "Support" },
];

interface FeatureShowcase {
  icon: typeof Shield;
  title: string;
  desc: string;
  bullets: string[];
  Mock: React.ComponentType;
}

const coreFeatures: FeatureShowcase[] = [
  {
    icon: Shield,
    title: "Warranty Management",
    desc: "Create, edit and track all warranties from a single dashboard. Full visibility across your dealership with real-time status updates.",
    bullets: ["Issue warranties in seconds", "Track active, expired, and claimed", "Full audit trail on every warranty", "Multi-site support for dealer groups"],
    Mock: WarrantyManagementMock,
  },
  {
    icon: UserCheck,
    title: "Customer Portal",
    desc: "Give every customer their own login to view warranty details, download certificates, and submit claims directly.",
    bullets: ["Dedicated /customers login page", "View warranty status and documents", "Submit claims with photo evidence", "Reduces inbound phone calls"],
    Mock: CustomerPortalMock,
  },
];

const claimsFeatures: FeatureShowcase[] = [
  {
    icon: ClipboardCheck,
    title: "Claims Management",
    desc: "Handle claims your way — approve, reject, or request more info in seconds. No third-party delays or queues.",
    bullets: ["Same-day claim decisions", "Request additional evidence", "Track claim costs vs revenue", "Notification alerts for new claims"],
    Mock: ClaimsManagementMock,
  },
  {
    icon: Gavel,
    title: "Claim Assist",
    desc: "End-to-end claim handling workspace with evidence requests, checklists, messaging, and structured decision workflows — all in one place.",
    bullets: ["Review evidence and photos inline", "Checklist-driven claim process", "Built-in messaging with customers", "Evidence Pack Generator for printable claim summaries"],
    Mock: ClaimAssistMock,
  },
  {
    icon: BarChart3,
    title: "Profit Tracking",
    desc: "See exactly what you're making from warranties vs what you're paying out. Real-time dashboards show your true margin.",
    bullets: ["Revenue vs payout breakdown", "Per-warranty profit visibility", "Monthly and yearly trends", "Helps build your claims reserve"],
    Mock: ProfitTrackingMock,
  },
];

const intelligenceFeatures: FeatureShowcase[] = [
  {
    icon: Sparkles,
    title: "DisputeIQ",
    desc: "AI-powered complaint handler that analyses disputes against UK Consumer Rights Act timelines, identifies risk levels, and generates professional responses. Completely free for all dealers — no warranty purchase required.",
    bullets: ["100% free — just sign up, no purchase needed", "CRA-based legal reasoning and risk scoring", "Response generation in 4 styles: Helpful, Firm, Defensive, De-escalation", "Strategy Mode with internal risks and 'what NOT to say'"],
    Mock: DisputeIQMock,
  },
  {
    icon: Wallet,
    title: "Warranty Fund",
    desc: "Financial oversight system that tracks contributions against payouts, calculates buffer health, and projects future claim impact with AI-powered recommendations.",
    bullets: ["Live fund health: Healthy, Watch, or Risk status", "Buffer calculation based on active warranties and risk", "Scenario simulator to project future claim impact", "AI contribution recommendations and market benchmarking"],
    Mock: WarrantyFundMock,
  },
];

const addonFeatures: FeatureShowcase[] = [
  {
    icon: Phone,
    title: "Warranty Line",
    desc: "Give your dealership a dedicated warranty phone line with professional greetings, hold music, and IVR routing.",
    bullets: ["Custom greeting with your name", "Professional hold music", "Route calls to the right team", "Only £25/month add-on"],
    Mock: WarrantyLineMock,
  },
  {
    icon: FileText,
    title: "Cover Templates",
    desc: "Create and manage reusable cover templates so every warranty is consistent and easy to issue.",
    bullets: ["Pre-built coverage options", "Customise terms and conditions", "Assign to warranties in one click", "Maintain consistency across sales"],
    Mock: CoverTemplatesMock,
  },
  {
    icon: FolderOpen,
    title: "Dealer Documents",
    desc: "Store, manage and download essential warranty documents — T&Cs, claim forms, compliance templates — all in one place.",
    bullets: ["Pre-built document templates", "Download or view in-browser", "Keep your compliance organised", "Always accessible from dashboard"],
    Mock: DocumentsMock,
  },
  {
    icon: Headphones,
    title: "Dealer Support",
    desc: "Built-in support ticket system so you can raise issues, ask questions, and get help without leaving the platform.",
    bullets: ["Submit tickets from dashboard", "Track open and resolved issues", "Priority support for urgent queries", "No external email chains needed"],
    Mock: SupportMock,
  },
];

const comparisonRows = [
  { label: "Margins", left: "Reduced by external fees", right: "Kept in-house — higher profit per deal" },
  { label: "Claim Decisions", left: "Delayed by third-party queues", right: "Same-day decisions in your dashboard" },
  { label: "Control", left: "Limited rules and visibility", right: "Full control over approvals and payouts" },
  { label: "Dependency", left: "Provider outages and handoffs", right: "Fully in-house process you control" },
  { label: "Complaint Handling", left: "No guidance, risk of escalation", right: "AI-powered responses with legal reasoning" },
  { label: "Financial Visibility", left: "No real-time fund tracking", right: "Live fund health with buffer calculations" },
];

function FeatureSection({ feature, index }: { feature: FeatureShowcase; index: number }) {
  const isReversed = index % 2 === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${isReversed ? "lg:[direction:rtl]" : ""}`}
    >
      <div className={isReversed ? "lg:[direction:ltr]" : ""}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <feature.icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold font-display">{feature.title}</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-5">{feature.desc}</p>
        <div className="space-y-2.5">
          {feature.bullets.map(b => (
            <div key={b} className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm">{b}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={isReversed ? "lg:[direction:ltr]" : ""}>
        <div className="relative rounded-2xl border border-white/10 bg-[hsl(222,25%,8%)] overflow-hidden shadow-2xl">
          <img src={feature.screenshot} alt={`${feature.title} screenshot`} className="w-full h-auto" loading="lazy" />
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="WarrantyVault Features | Warranty Management System for Dealers"
        description="Explore WarrantyVault features including claims management, DisputeIQ, and warranty fund tracking for car dealers."
        canonical="https://dealer-guard-vault.lovable.app/features"
      />

      <PublicNav currentPage="/features" />

      {/* Hero */}
      <section className="hero-gradient pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Platform Features</span>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-white mb-4">Everything you need to run warranties in-house</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">Built for UK dealers who want higher margins, faster claim decisions, and fewer admin headaches.</p>
        </div>
      </section>

      {/* Quick overview grid */}
      <section className="py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {featureOverview.map((f, i) => (
              <motion.div key={f.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-card rounded-xl p-4 text-center group hover:border-primary/30 transition-all">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-[11px] sm:text-xs font-medium leading-tight">{f.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="warranty-management" className="py-14 px-6 bg-secondary/30 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">Core Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">The foundation of your warranty business</h2>
          </div>
          <div className="space-y-20">
            {coreFeatures.map((f, i) => (
              <FeatureSection key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Claims & Control */}
      <section id="claim-assist" className="py-14 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[hsl(var(--cta))] text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">Claims & Control</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Stay in control of every claim and payout</h2>
          </div>
          <div className="space-y-20">
            {claimsFeatures.map((f, i) => (
              <FeatureSection key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence & Risk */}
      <section id="warranty-fund" className="py-14 px-6 bg-secondary/30 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">Intelligence & Risk</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">AI-powered tools to protect your business</h2>
          </div>
          <div className="space-y-20">
            {intelligenceFeatures.map((f, i) => (
              <FeatureSection key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3 block">Add-ons & Extras</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">Optional tools to level up your operation</h2>
          </div>
          <div className="space-y-20">
            {addonFeatures.map((f, i) => (
              <FeatureSection key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">Dealer Comparison</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">See the difference in one glance</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Built to make profit and control obvious, not hidden in paperwork and provider delays.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-semibold font-display text-muted-foreground">With Warranty Providers</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-destructive/10 text-destructive px-3 py-1 rounded-full">Less Control</span>
              </div>
              <div className="space-y-3">
                {comparisonRows.map(row => (
                  <div key={row.label} className="glass-card rounded-xl p-5">
                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/60 mb-2">{row.label}</p>
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-destructive flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{row.left}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-semibold font-display">With WarrantyVault</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full">Higher Margin</span>
              </div>
              <div className="space-y-3">
                {comparisonRows.map(row => (
                  <div key={row.label} className="glass-card rounded-xl p-5 border-primary/20 bg-primary/[0.03]">
                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-primary/70 mb-2">{row.label}</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{row.right}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">Ready to take control?</h2>
          <p className="text-white/50 mb-4 text-lg">Join dealers who are keeping more profit and running warranties their way.</p>
          <p className="text-white/40 mb-8 text-sm">Need help with customer complaints? <Link to="/disputeiq" className="text-primary hover:underline font-semibold">Handle complaints with DisputeIQ</Link> — completely free.</p>
          <Button size="lg" className="btn-cta rounded-full px-10 text-base h-12" asChild>
            <Link to="/signup">Sign Up <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
          <p className="text-xs text-white/30 mt-5">No monthly fees. £15 per warranty.</p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
