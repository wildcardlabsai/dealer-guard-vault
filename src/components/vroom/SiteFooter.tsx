import { Link } from "react-router-dom";
import { Brand } from "@/components/vroom/SiteHeader";

export default function SiteFooter() {
  return (
    <footer className="border-t border-vroom-nav-line bg-vroom-nav px-5 py-12 text-vroom-hero-muted lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 border-b border-vroom-nav-line pb-10 md:grid-cols-[1fr_2fr]">
          <div>
            <Link to="/"><Brand /></Link>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em]">Dealer aftersales. Simplified.</p>
          </div>
          <nav className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm sm:grid-cols-3 lg:grid-cols-6" aria-label="Footer navigation">
            <Link to="/features" className="hover:text-vroom-hero-fg">Features</Link>
            <Link to="/warranty-line" className="hover:text-vroom-hero-fg">Warranty Line</Link>
            <Link to="/pricing" className="hover:text-vroom-hero-fg">Pricing</Link>
            <Link to="/about" className="hover:text-vroom-hero-fg">About</Link>
            <Link to="/blog" className="hover:text-vroom-hero-fg">Resources</Link>
            <Link to="/faq" className="hover:text-vroom-hero-fg">FAQ</Link>
            <a href="mailto:dealeropsdms@gmail.com" className="hover:text-vroom-hero-fg">Contact</a>
          </nav>
        </div>
        <div className="flex flex-col gap-4 pt-7 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VROOM. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link to="/dealers" className="hover:text-vroom-hero-fg">Dealer Portal</Link>
            <Link to="/customers" className="hover:text-vroom-hero-fg">Customer Portal</Link>
            <span>GoVroom.co.uk</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
