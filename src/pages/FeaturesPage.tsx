import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield, Search, ArrowRight, CheckCircle2, ChevronRight, X,
  TrendingUp, BarChart3, FileCheck, UserCheck, ClipboardCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import SiteHeader from "@/components/vroom/SiteHeader";
import SiteFooter from "@/components/vroom/SiteFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

const features = [
  { icon: Shield, title: "Warranty Management", desc: "Create, edit and track all warranties in one place with full visibility." },
  { icon: FileCheck, title: "Branded Certificates", desc: "Generate professional, branded warranty certificates instantly." },
  { icon: Search, title: "DVLA Lookup", desc: "Enter a reg and instantly pull vehicle data — no manual input needed." },
  { icon: UserCheck, title: "Customer Portal", desc: "Give customers their own login to view warranties, download documents and submit claims." },
  { icon: ClipboardCheck, title: "Claims Management", desc: "Handle claims your way — approve, reject or request more info in seconds." },
  { icon: BarChart3, title: "Profit Tracking", desc: "See exactly what you're making from warranties vs what you're paying out." },
];

const steps = [
  { num: "01", title: "Sign up & get approved", desc: "Submit your details and get approved within 24 hours." },
  { num: "02", title: "Add a warranty", desc: "Enter the reg, customer details, and issue a warranty in seconds." },
  { num: "03", title: "Manage claims", desc: "Approve, reject or review — no delays, no third parties." },
  { num: "04", title: "Track performance", desc: "See profit, activity and claims data in real-time." },
];

const comparisonRows = [
  { label: "Margins", left: "Reduced by external fees", right: "Kept in-house — higher profit per deal" },
  { label: "Claim Decisions", left: "Delayed by third-party queues", right: "Same-day decisions in your dashboard" },
  { label: "Control", left: "Limited rules and visibility", right: "Full control over approvals and payouts" },
  { label: "Dependency", left: "Provider outages and handoffs", right: "Fully in-house process you control" },
];

const problemCards = [
  "You lose margin on every deal you sell a warranty",
  "Claims take too long to get approved",
  "You rely on third parties to look after your customers",
  "Customers blame you when things go wrong anyway",
  "No clear view of your profit vs payouts",
  "You're paying for a service you could run yourself",
];

export default function FeaturesPage() {
  return (
    <div className="vroom-site min-h-screen bg-vroom-surface text-vroom-ink">
      <SEOHead
        title="Warranty Platform Features | VROOM"
        description="Compare self-funded warranties vs third-party providers. See how VROOM gives UK dealers full control, higher margins, and faster claim decisions."
        canonical="https://govroom.co.uk/features"
      />

      <SiteHeader />

      <main>
        <section className="bg-vroom-dark px-5 pb-16 pt-40 text-vroom-hero-fg lg:px-10 lg:pt-44">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-vroom-green">Platform Features</p>
            <h1 className="text-4xl font-bold leading-[1.04] sm:text-5xl">Everything you need to run warranties in-house</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-7 text-vroom-hero-muted">Built for UK dealers who want higher margins, faster claim decisions, and fewer admin headaches.</p>
          </div>
        </section>

        <section className="bg-vroom-surface px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <motion.p className="mb-4 block text-xs font-bold uppercase tracking-[0.22em] text-vroom-green-deep" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>The Problem</motion.p>
              <motion.h2 className="text-3xl font-bold leading-tight sm:text-4xl" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                Warranty providers are costing you more than you think
              </motion.h2>
              <motion.p className="mx-auto mt-4 max-w-xl text-vroom-ink-muted" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                Every delay, every fee, and every handoff eats into your profit.
              </motion.p>
            </div>
            <div className="mb-10 grid gap-4 sm:grid-cols-2">
              {problemCards.map((issue, i) => (
                <motion.div key={issue} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex items-start gap-3 rounded-xl border border-vroom-line bg-vroom-panel p-5 shadow-sm">
                  <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-vroom-green/15">
                    <CheckCircle2 className="h-3.5 w-3.5 text-vroom-green-deep" />
                  </div>
                  <span className="text-sm leading-relaxed">{issue}</span>
                </motion.div>
              ))}
            </div>
            <motion.div className="text-center" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-3 rounded-2xl border border-vroom-line bg-vroom-panel px-8 py-5 shadow-sm">
                <TrendingUp className="h-6 w-6 text-vroom-green-deep" />
                <div className="text-left">
                  <p className="text-lg font-bold">There's a better way to run warranties.</p>
                  <p className="text-sm text-vroom-ink-muted">Keep an extra £300–£800 per deal by managing warranties in-house.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-vroom-soft px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <p className="mb-4 block text-xs font-bold uppercase tracking-[0.22em] text-vroom-green-deep">Dealer Dashboard</p>
                <h2 className="text-3xl font-bold sm:text-4xl">Built for how dealers actually work</h2>
                <p className="mb-8 mt-4 text-vroom-ink-muted">Most warranty systems are built for providers — not dealers. VROOM is designed for dealerships who want control, speed and better margins without the hassle.</p>
                <div className="mb-8 space-y-3">
                  {["Pay only when you use it", "No monthly fees", "No risk to get started", "Customer portal included from day one"].map(item => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-vroom-green-deep" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <Button size="lg" className="bg-vroom-green font-bold text-vroom-green-foreground hover:bg-vroom-green-hover" asChild>
                  <Link to="/signup">Sign Up <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <p className="mt-3 text-xs text-vroom-ink-muted">No monthly fees. £15 per warranty.</p>
              </div>
              <div className="rounded-2xl border border-vroom-nav-line bg-vroom-dashboard p-5 text-vroom-hero-fg shadow-vroom-device">
                <div className="mb-4 flex items-center gap-2">
                  <span className="font-mono text-[10px] text-vroom-hero-muted">dealer-dashboard</span>
                </div>
                <div className="mb-4 grid grid-cols-3 gap-2.5">
                  <div className="rounded-xl border border-vroom-green/20 bg-vroom-green/10 p-3 text-center">
                    <p className="text-2xl font-bold text-vroom-green">£0</p>
                    <p className="mt-0.5 text-[10px] text-vroom-hero-muted">Monthly Fee</p>
                  </div>
                  <div className="rounded-xl border border-vroom-hero-border/40 bg-vroom-hero-soft p-3 text-center">
                    <p className="text-2xl font-bold text-vroom-hero-fg">£15</p>
                    <p className="mt-0.5 text-[10px] text-vroom-hero-muted">Per Warranty</p>
                  </div>
                  <div className="rounded-xl border border-vroom-hero-border/40 bg-vroom-hero-soft p-3 text-center">
                    <p className="text-2xl font-bold text-vroom-hero-fg">47</p>
                    <p className="mt-0.5 text-[10px] text-vroom-hero-muted">Active</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { reg: "AB12 CDE", car: "BMW 320d M Sport", status: "Active" },
                    { reg: "CD34 FGH", car: "Audi A4 S Line", status: "Active" },
                    { reg: "GH78 LMN", car: "VW Golf R", status: "Expired" },
                  ].map(w => (
                    <div key={w.reg} className="flex items-center justify-between rounded-lg border border-vroom-hero-border/30 bg-vroom-hero-soft/60 p-3">
                      <div className="flex items-center gap-3">
                        <code className="rounded bg-vroom-green/15 px-2 py-1 font-mono text-[10px] tracking-wider text-vroom-green">{w.reg}</code>
                        <span className="text-sm text-vroom-hero-fg/90">{w.car}</span>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${w.status === "Active" ? "bg-vroom-green/15 text-vroom-green" : "bg-vroom-hero-soft text-vroom-hero-muted"}`}>{w.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-vroom-surface px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-10 text-center">
              <p className="mb-4 block text-xs font-bold uppercase tracking-[0.22em] text-vroom-green-deep">Core Features</p>
              <h2 className="text-3xl font-bold sm:text-4xl">Everything you need to stay in control</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <motion.div key={f.title} className="group rounded-xl border border-vroom-line bg-vroom-panel p-6 shadow-sm transition-all duration-300 hover:border-vroom-green/40" custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-vroom-green/10 transition-colors group-hover:bg-vroom-green/15">
                    <f.icon className="h-5 w-5 text-vroom-green-deep" />
                  </div>
                  <h3 className="mb-2 font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-vroom-ink-muted">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-vroom-soft px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-4 block text-xs font-bold uppercase tracking-[0.22em] text-vroom-green-deep">Dealer Comparison</p>
              <h2 className="text-3xl font-bold sm:text-4xl">See the difference in one glance</h2>
              <p className="mx-auto mt-4 max-w-lg text-vroom-ink-muted">Built to make profit and control obvious, not hidden in paperwork and provider delays.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center justify-between px-1">
                  <h3 className="font-semibold text-vroom-ink-muted">With Warranty Providers</h3>
                  <span className="rounded-full bg-destructive/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-destructive">Less Control</span>
                </div>
                <div className="space-y-3">
                  {comparisonRows.map(row => (
                    <div key={row.label} className="rounded-xl border border-vroom-line bg-vroom-panel p-5">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-vroom-ink-muted/70">{row.label}</p>
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4 flex-shrink-0 text-destructive" />
                        <span className="text-sm text-vroom-ink-muted">{row.left}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-4 flex items-center justify-between px-1">
                  <h3 className="font-semibold">With VROOM</h3>
                  <span className="rounded-full bg-vroom-green/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-vroom-green-deep">Higher Margin</span>
                </div>
                <div className="space-y-3">
                  {comparisonRows.map(row => (
                    <div key={row.label} className="rounded-xl border border-vroom-green/25 bg-vroom-green/[0.04] p-5">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-vroom-green-deep/80">{row.label}</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-vroom-green-deep" />
                        <span className="text-sm font-medium">{row.right}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-vroom-surface px-5 py-20 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <p className="mb-4 block text-xs font-bold uppercase tracking-[0.22em] text-vroom-green-deep">Simple Process</p>
              <h2 className="text-3xl font-bold sm:text-4xl">How It Works</h2>
              <p className="mt-3 text-vroom-ink-muted">Get up and running fast with no risk.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <motion.div key={s.num} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative text-center">
                  <div className="mb-3 text-4xl font-bold text-vroom-green-deep">{s.num}</div>
                  <h3 className="mb-2 font-semibold">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-vroom-ink-muted">{s.desc}</p>
                  {i < 3 && <ChevronRight className="absolute -right-3 top-8 hidden h-5 w-5 text-vroom-line lg:block" />}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-vroom-dark px-5 py-20 text-vroom-hero-fg lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to take control?</h2>
            <p className="mb-8 text-lg text-vroom-hero-muted">Join dealers who are keeping more profit and running warranties their way.</p>
            <Button size="lg" className="h-12 bg-vroom-green px-10 font-bold text-vroom-green-foreground hover:bg-vroom-green-hover" asChild>
              <Link to="/signup">Sign Up <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <p className="mt-5 text-xs text-vroom-hero-muted">No monthly fees. £15 per warranty.</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
