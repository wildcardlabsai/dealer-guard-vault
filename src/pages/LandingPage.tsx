import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CarFront,
  Check,
  Clock3,
  FileText,
  Play,
  ShieldCheck,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import SiteHeader, { Brand } from "@/components/vroom/SiteHeader";
import SiteFooter from "@/components/vroom/SiteFooter";
import heroImage from "@/assets/vroom-hero.jpg";
import roadImage from "@/assets/vroom-road.jpg";

const features = [
  { icon: ShieldCheck, title: "Warranties", copy: "Create, issue and manage every warranty from one clear workspace." },
  { icon: Wrench, title: "Claims", copy: "Triage claims quickly, track decisions and keep customers informed." },
  { icon: Users, title: "Customers", copy: "Keep customer details, cover and aftersales history connected." },
  { icon: CarFront, title: "Vehicles", copy: "Bring vehicle details and registration lookups into one place." },
  { icon: BarChart3, title: "Insights", copy: "See exposure, claim activity and performance as it changes." },
  { icon: FileText, title: "Documents", copy: "Generate and find policy documents whenever you need them." },
];

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" },
};

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] ${dark ? "text-vroom-green" : "text-vroom-ink-muted"}`}>
      <span className="h-px w-7 bg-vroom-green" />
      {children}
    </div>
  );
}

function ProductPreview() {
  const bars = [38, 58, 46, 72, 61, 82];
  return (
    <div className="relative mx-auto w-full max-w-[760px] pt-8 lg:pt-0">
      <div className="overflow-hidden rounded-t-[18px] border-[7px] border-vroom-frame bg-vroom-canvas shadow-vroom-device">
        <div className="flex h-8 items-center gap-1.5 border-b border-vroom-line bg-vroom-panel px-3">
          <span className="h-2 w-2 rounded-full bg-vroom-dot" />
          <span className="h-2 w-2 rounded-full bg-vroom-dot" />
          <span className="h-2 w-2 rounded-full bg-vroom-dot" />
        </div>
        <div className="grid min-h-[390px] grid-cols-[70px_1fr] sm:grid-cols-[150px_1fr]">
          <aside className="bg-vroom-dashboard px-3 py-5 text-vroom-hero-fg">
            <Brand compact />
            <div className="mt-8 space-y-2 text-[9px] sm:text-[11px]">
              {["Dashboard", "Warranties", "Claims", "Customers", "Vehicles", "Insights"].map((item, index) => (
                <div key={item} className={`rounded px-2 py-2 ${index === 0 ? "bg-vroom-green/15 text-vroom-green" : "text-vroom-hero-muted"}`}>
                  <span className="hidden sm:inline">{item}</span>
                  <span className="sm:hidden">{item.slice(0, 1)}</span>
                </div>
              ))}
            </div>
          </aside>
          <div className="min-w-0 bg-vroom-canvas p-3 sm:p-5">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] text-vroom-ink-muted">Monday, 18 September</p>
                <p className="mt-1 text-base font-bold text-vroom-ink sm:text-xl">Good morning, Matt.</p>
              </div>
              <div className="hidden rounded border border-vroom-line bg-vroom-panel px-3 py-1.5 text-[10px] text-vroom-ink-muted sm:block">This month</div>
            </div>
            <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
              {[
                ["Active Warranties", "132", "+12%"],
                ["Open Claims", "8", "2 priority"],
                ["Claims This Month", "14", "+7%"],
                ["Warranty Exposure", "£48,320", "Stable"],
              ].map(([label, value, meta]) => (
                <div key={label} className="rounded-md border border-vroom-line bg-vroom-panel p-3">
                  <p className="text-[9px] text-vroom-ink-muted">{label}</p>
                  <p className="mt-2 text-lg font-bold text-vroom-ink">{value}</p>
                  <p className="mt-1 text-[9px] font-semibold text-vroom-positive">{meta}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1.25fr_.75fr]">
              <div className="rounded-md border border-vroom-line bg-vroom-panel p-4">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-xs font-bold text-vroom-ink">Warranty Activity</p>
                  <span className="text-[9px] text-vroom-ink-muted">Last 6 months</span>
                </div>
                <div className="flex h-24 items-end justify-between gap-2 border-b border-vroom-line">
                  {bars.map((height, index) => (
                    <div key={index} className="w-full rounded-t-sm bg-vroom-green" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-vroom-line bg-vroom-panel p-4">
                <p className="text-xs font-bold text-vroom-ink">Claims by Status</p>
                <div className="mx-auto mt-4 flex h-24 w-24 items-center justify-center rounded-full border-[15px] border-vroom-green">
                  <div className="text-center"><strong className="block text-lg text-vroom-ink">28</strong><span className="text-[8px] text-vroom-ink-muted">Total</span></div>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-md border border-vroom-line bg-vroom-panel p-3">
              <p className="mb-2 text-[10px] font-bold text-vroom-ink">Recent Activity</p>
              <div className="flex items-center justify-between text-[9px] text-vroom-ink-muted"><span>Warranty issued · BF72 KLM</span><span>12 min ago</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto h-3 w-[92%] rounded-b-xl bg-vroom-laptop shadow-vroom-laptop" />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="vroom-site min-h-screen bg-vroom-surface text-vroom-ink">
      <SEOHead
        title="VROOM — Dealer Aftersales, Simplified"
        description="Manage warranties, claims, customers and vehicles in one clear aftersales platform built for UK motor dealers."
        canonical="https://govroom.co.uk/"
      />

      <SiteHeader />

      <main>
        <section className="relative flex min-h-[720px] items-end overflow-hidden bg-vroom-dark pt-28 text-vroom-hero-fg lg:min-h-[780px] lg:items-center">
          <img src={heroImage} alt="Premium vehicle outside a modern dealership workshop" className="absolute inset-0 h-full w-full object-cover object-[64%_center]" width={1920} height={1080} />
          <div className="absolute inset-0 bg-vroom-hero-overlay" />
          <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-12 lg:px-10 lg:pb-0">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="max-w-2xl">
              <p className="mb-6 text-xs font-bold uppercase tracking-[0.22em] text-vroom-green">Dealer aftersales. Simplified.</p>
              <h1 className="max-w-[680px] text-[clamp(3rem,6vw,5.75rem)] font-bold leading-[0.98] tracking-normal">Everything after the sale. In one place.</h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-vroom-hero-muted md:text-lg">VROOM helps motor dealers manage warranties, claims, customers and vehicles in one clear place—saving time, reducing risk and keeping customers moving.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="h-12 bg-vroom-green px-7 font-bold text-vroom-green-foreground hover:bg-vroom-green-hover" asChild><Link to="/signup">Get Started <ArrowRight /></Link></Button>
                <Button size="lg" variant="outline" className="h-12 border-vroom-hero-border bg-vroom-dark/20 px-7 text-vroom-hero-fg hover:bg-vroom-hero-soft hover:text-vroom-hero-fg" asChild><a href="#platform"><Play className="fill-current" /> See How It Works</a></Button>
              </div>
              <div className="mt-12 grid max-w-2xl grid-cols-1 gap-5 border-t border-vroom-hero-border pt-6 sm:grid-cols-3">
                {[[ShieldCheck, "Built for dealers"], [Clock3, "Saves time"], [TrendingUp, "More profitable aftersales"]].map(([Icon, label]) => {
                  const ItemIcon = Icon as typeof ShieldCheck;
                  return <div key={label as string} className="flex items-center gap-3"><ItemIcon className="h-5 w-5 text-vroom-green" /><span className="text-[10px] font-bold uppercase tracking-[0.17em] text-vroom-hero-muted">{label as string}</span></div>;
                })}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="bg-vroom-surface px-5 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-[1400px]">
            <motion.div {...reveal} className="grid gap-8 border-b border-vroom-line pb-14 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
              <div><Eyebrow>Features</Eyebrow><h2 className="max-w-3xl text-4xl font-bold leading-[1.04] tracking-normal md:text-6xl">Everything you need for a stronger aftersales operation.</h2></div>
              <div className="max-w-lg lg:justify-self-end"><p className="leading-7 text-vroom-ink-muted">Bring warranties, claims, customers and documents together in one simple platform, designed around how the motor trade works.</p><Link to="/features" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-vroom-green-deep hover:gap-3">Explore all features <ArrowRight className="h-4 w-4" /></Link></div>
            </motion.div>
            <div className="grid gap-x-8 gap-y-12 pt-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {features.map((feature, index) => (
                <motion.article key={feature.title} {...reveal} transition={{ ...reveal.transition, delay: index * 0.05 }} className="group border-l border-vroom-line pl-5">
                  <feature.icon className="mb-5 h-7 w-7 text-vroom-green-deep transition-transform group-hover:-translate-y-1" />
                  <h3 className="text-base font-bold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-vroom-ink-muted">{feature.copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="platform" className="overflow-hidden bg-vroom-soft px-5 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-[1400px] items-center gap-14 lg:grid-cols-[.72fr_1.28fr]">
            <motion.div {...reveal}>
              <Eyebrow>The platform</Eyebrow>
              <h2 className="text-4xl font-bold leading-[1.04] tracking-normal md:text-6xl">A clearer view of your aftersales.</h2>
              <p className="mt-6 max-w-lg leading-7 text-vroom-ink-muted">See the full picture across every warranty and claim. VROOM keeps the information your team needs visible, current and ready to act on.</p>
              <Button className="mt-8 bg-vroom-green font-bold text-vroom-green-foreground hover:bg-vroom-green-hover" asChild><Link to="/signup">Get Started <ArrowRight /></Link></Button>
            </motion.div>
            <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.12 }}><ProductPreview /></motion.div>
          </div>
        </section>

        <section id="dealers" className="bg-vroom-surface px-5 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <motion.div {...reveal}>
              <Eyebrow>Built for modern dealers</Eyebrow>
              <h2 className="max-w-3xl text-4xl font-bold leading-[1.04] tracking-normal md:text-6xl">Less admin.<br />More time for what matters.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-vroom-ink-muted">VROOM makes aftersales easier to manage, so your team can focus on selling vehicles, looking after customers and building a stronger business.</p>
            </motion.div>
            <motion.ul {...reveal} className="space-y-5">
              {["Easy for your team to use", "Designed around the motor trade", "Less time spent on repetitive admin", "Clear decisions and fewer delays", "Live insight into warranty performance"].map((item) => <li key={item} className="flex items-center gap-4 border-b border-vroom-line pb-4 text-sm font-semibold"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-vroom-green text-vroom-green-foreground"><Check className="h-3.5 w-3.5" /></span>{item}</li>)}
            </motion.ul>
          </div>
        </section>

        <section id="pricing" className="bg-vroom-dark px-5 py-20 text-vroom-hero-fg lg:px-10 lg:py-24">
          <motion.div {...reveal} className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[1fr_.7fr] lg:items-center">
            <div><Eyebrow dark>Simple pricing</Eyebrow><h2 className="text-4xl font-bold leading-[1.04] tracking-normal md:text-6xl">Pay for warranties.<br />Not software overhead.</h2><p className="mt-6 max-w-xl leading-7 text-vroom-hero-muted">No platform subscription and no long contract. Your first five warranties are free, then pay only when you issue one.</p><Link to="/pricing" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-vroom-green hover:gap-3">See full pricing <ArrowRight className="h-4 w-4" /></Link></div>
            <div className="border-l border-vroom-hero-border pl-8"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-vroom-hero-muted">Per warranty</p><p className="mt-3 text-7xl font-bold">£15</p><p className="mt-3 text-sm text-vroom-green">£0 monthly platform fee</p><Button className="mt-7 bg-vroom-green font-bold text-vroom-green-foreground hover:bg-vroom-green-hover" asChild><Link to="/signup">Start with 5 free</Link></Button></div>
          </motion.div>
        </section>

        <section id="about" className="bg-vroom-soft px-5 py-20 lg:px-10 lg:py-24">
          <motion.div {...reveal} className="mx-auto max-w-[1200px]">
            <Eyebrow>Trusted by dealers</Eyebrow>
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
              <div><h2 className="text-4xl font-bold leading-[1.04] tracking-normal md:text-6xl">Real dealers.<br />Real results.</h2><Link to="/about" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-vroom-green-deep hover:gap-3">More about VROOM <ArrowRight className="h-4 w-4" /></Link></div>
              <div className="border-l-2 border-vroom-green bg-vroom-panel p-7 md:p-9"><p className="text-xl font-semibold leading-8 text-vroom-ink">Dealer stories are being verified.</p><p className="mt-3 max-w-xl leading-7 text-vroom-ink-muted">We only publish feedback from real VROOM customers. Verified case studies will be added here as they become available.</p></div>
            </div>
          </motion.div>
        </section>

        <section className="relative overflow-hidden bg-vroom-dark px-5 py-24 text-vroom-hero-fg lg:px-10 lg:py-32">
          <img src={roadImage} alt="Executive car travelling through the British countryside" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[64%_center]" width={1920} height={800} />
          <div className="absolute inset-0 bg-vroom-cta-overlay" />
          <motion.div {...reveal} className="relative mx-auto max-w-[1400px]">
            <Eyebrow dark>Ready to get started?</Eyebrow>
            <h2 className="max-w-3xl text-4xl font-bold leading-[1.04] tracking-normal md:text-6xl">Take control of your aftersales with VROOM.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-vroom-hero-muted">Bring warranties, claims and customer care together in one clear place.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button size="lg" className="bg-vroom-green font-bold text-vroom-green-foreground hover:bg-vroom-green-hover" asChild><Link to="/signup">Get Started</Link></Button><Button size="lg" variant="outline" className="border-vroom-hero-border bg-vroom-dark/20 text-vroom-hero-fg hover:bg-vroom-hero-soft hover:text-vroom-hero-fg" asChild><a href="mailto:dealeropsdms@gmail.com?subject=VROOM%20demo%20request">Book a Demo</a></Button></div>
            <p className="mt-10 font-semibold text-vroom-green">GoVroom.co.uk</p>
          </motion.div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}