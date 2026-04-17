import { Link } from "react-router-dom";
import { Tag, ClipboardCheck, LayoutDashboard, Info } from "lucide-react";

const steps = [
  {
    icon: Tag,
    title: "You sell the warranty",
    description: "You offer warranties to your customers and retain 100% of the funds.",
  },
  {
    icon: ClipboardCheck,
    title: "You manage the claims",
    description: "When a customer reports an issue, you decide how the claim is handled and approved.",
  },
  {
    icon: LayoutDashboard,
    title: "We help you manage it",
    description: "WarrantyVault gives you the tools to track warranties, manage customers, and handle aftersales efficiently.",
  },
];

interface HowItWorksProps {
  className?: string;
}

export default function HowItWorks({ className = "" }: HowItWorksProps) {
  return (
    <section className={className} aria-labelledby="how-it-works-title">
      <div className="mb-4">
        <h2 id="how-it-works-title" className="text-xs font-semibold uppercase tracking-[0.1em] text-white/25">
          How WarrantyVault Works
        </h2>
        <p className="text-[11px] text-white/30 mt-1">
          A quick overview of how the platform works and your responsibilities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {steps.map((step, idx) => (
          <div
            key={step.title}
            className="group relative rounded-xl p-5 border border-white/[0.06] bg-[hsl(222_28%_10%)] transition-all duration-200 hover:border-white/[0.12] hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.04] flex items-center justify-center flex-shrink-0 group-hover:bg-primary/[0.08] group-hover:border-primary/15 transition-colors">
                <step.icon className="w-4 h-4 text-white/45 group-hover:text-primary/80 transition-colors" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/20 mt-2">
                Step {idx + 1}
              </span>
            </div>
            <h3 className="text-sm font-semibold font-display text-white/85 mb-1.5">{step.title}</h3>
            <p className="text-xs leading-relaxed text-white/40">{step.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3 flex items-start gap-3">
        <Info className="w-3.5 h-3.5 text-white/30 mt-0.5 flex-shrink-0" strokeWidth={1.75} />
        <p className="text-[11.5px] leading-relaxed text-white/45">
          WarrantyVault is a software platform. You remain responsible for warranty funding, claim decisions, and compliance with{" "}
          <span className="text-white/60">UK consumer law</span>.
        </p>
      </div>

      <div className="mt-2.5 px-1">
        <Link
          to="/terms"
          className="text-[11px] text-white/35 hover:text-white/70 underline underline-offset-4 decoration-white/15 hover:decoration-white/40 transition-colors"
        >
          View full Terms of Use
        </Link>
      </div>
    </section>
  );
}
