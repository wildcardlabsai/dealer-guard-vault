import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/vroom-logo.png.asset.json";

export const navItems = [
  { label: "Features", to: "/features" },
  { label: "Warranty Line", to: "/warranty-line" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "Resources", to: "/blog" },
  { label: "FAQ", to: "/faq" },
];

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <img
      src={logoAsset.url}
      alt="VROOM"
      className={compact ? "h-7 w-auto" : "h-8 w-auto md:h-9"}
      width={1980}
      height={384}
    />
  );
}

export default function SiteHeader({ alwaysSolid = false }: { alwaysSolid?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(alwaysSolid);

  useEffect(() => {
    if (alwaysSolid) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysSolid]);

  const closeMenu = () => setMobileMenuOpen(false);
  const isSolid = alwaysSolid || scrolled || mobileMenuOpen;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${isSolid ? "border-vroom-nav-line bg-vroom-nav shadow-vroom-nav" : "border-transparent bg-transparent"}`}>
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 lg:px-10">
        <Link to="/" aria-label="VROOM home" onClick={closeMenu}><Brand /></Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.label} to={item.to} className="text-sm font-medium text-vroom-hero-muted transition-colors hover:text-vroom-hero-fg">{item.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden border-vroom-hero-border bg-transparent text-vroom-hero-fg hover:bg-vroom-hero-soft hover:text-vroom-hero-fg sm:inline-flex" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button size="sm" className="hidden bg-vroom-green font-bold text-vroom-green-foreground hover:bg-vroom-green-hover sm:inline-flex" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button variant="ghost" size="icon" className="text-vroom-hero-fg hover:bg-vroom-hero-soft hover:text-vroom-hero-fg lg:hidden" onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {mobileMenuOpen && (
        <nav className="border-t border-vroom-nav-line bg-vroom-nav px-5 pb-6 pt-3 lg:hidden" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Link key={item.label} to={item.to} onClick={closeMenu} className="block border-b border-vroom-nav-line py-3 text-sm text-vroom-hero-fg">{item.label}</Link>
          ))}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-vroom-hero-border bg-transparent text-vroom-hero-fg" asChild><Link to="/login" onClick={closeMenu}>Login</Link></Button>
            <Button className="bg-vroom-green font-bold text-vroom-green-foreground" asChild><Link to="/signup" onClick={closeMenu}>Get Started</Link></Button>
          </div>
        </nav>
      )}
    </header>
  );
}
