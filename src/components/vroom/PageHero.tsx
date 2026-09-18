import { ReactNode } from "react";
import heroImage from "@/assets/vroom-hero.jpg";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
}

export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className="relative flex min-h-[420px] items-center overflow-hidden bg-vroom-dark pt-28 text-vroom-hero-fg lg:min-h-[480px]">
      <img
        src={heroImage}
        alt="Premium vehicle outside a modern dealership workshop"
        className="absolute inset-0 h-full w-full object-cover object-[64%_center]"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-vroom-hero-overlay" />
      <div className="relative mx-auto w-full max-w-[1400px] px-5 py-12 text-center lg:px-10">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-vroom-green">{eyebrow}</p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.04] sm:text-5xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-5 max-w-2xl text-lg leading-7 text-vroom-hero-muted">{subtitle}</p>}
      </div>
    </section>
  );
}
