import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/warrantylogo.png";

const navLinks = [
  { to: "/features", label: "Features" },
  { to: "/#pricing", label: "Pricing", isAnchor: true },
  { to: "/faq", label: "FAQ" },
  { to: "/blog", label: "Blog" },
  { to: "/dealers", label: "Dealers" },
  { to: "/customers", label: "Customers" },
];

interface PublicNavProps {
  currentPage?: string;
}

export default function PublicNav({ currentPage }: PublicNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[hsl(var(--hero-bg))]/95 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
        <Link to="/"><img src={logo} alt="WarrantyVault" className="h-8 sm:h-10" /></Link>
        <div className="hidden md:flex items-center gap-10 text-[15px] text-white/70">
          {navLinks.map(link =>
            link.isAnchor ? (
              <a key={link.to} href={link.to} className="hover:text-white transition-colors">
                {link.label}
              </a>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-colors ${currentPage === link.to ? "text-white" : "hover:text-white"}`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10 text-sm sm:text-[15px] px-3" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button size="sm" className="btn-cta rounded-full px-4 sm:px-6 text-sm sm:text-[15px] h-9 sm:h-10 hidden sm:inline-flex" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
          <button
            className="md:hidden text-white/80 hover:text-white p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-[hsl(var(--hero-bg))] border-t border-white/5 px-4 pb-4 space-y-1">
          {navLinks.map(link =>
            link.isAnchor ? (
              <a key={link.to} href={link.to} className="block py-3 text-white/70 hover:text-white text-sm" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </a>
            ) : (
              <Link key={link.to} to={link.to} className={`block py-3 text-sm ${currentPage === link.to ? "text-white" : "text-white/70 hover:text-white"}`} onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            )
          )}
          <Button size="sm" className="btn-cta rounded-full w-full mt-2 text-sm h-10" asChild>
            <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
