import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, Shield, Headphones, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/warrantylogo.png";

const productItems = [
  { to: "/features", label: "Warranty Management", icon: Shield, desc: "Issue and manage warranties" },
  { to: "/features", label: "Claim Assist", icon: Headphones, desc: "Handle claims end to end" },
  { to: "/disputeiq", label: "DisputeIQ", icon: Sparkles, desc: "Respond to complaints properly", highlight: true },
  { to: "/features", label: "Warranty Fund", icon: Wallet, desc: "Track your risk and profit" },
];

interface PublicNavProps {
  currentPage?: string;
}

export default function PublicNav({ currentPage }: PublicNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setProductOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[hsl(222_30%_6%)]/90 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="WarrantyVault" className="h-7 sm:h-8" />
        </Link>

        {/* Centre nav */}
        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/50">
          {/* Product dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProductOpen(!productOpen)}
              className="flex items-center gap-1 hover:text-white/80 transition-colors"
            >
              Product <ChevronDown className={`w-3 h-3 transition-transform ${productOpen ? "rotate-180" : ""}`} />
            </button>
            {productOpen && (
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-64 z-[60] rounded-xl border border-white/[0.1] bg-[hsl(222_28%_12%)] shadow-[0_16px_50px_-8px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)] p-2 animate-fade-in">
                {productItems.map(item => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setProductOpen(false)}
                    className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      item.highlight ? "hover:bg-[hsl(var(--cta))]/[0.06]" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      item.highlight ? "bg-[hsl(var(--cta))]/10" : "bg-white/[0.04]"
                    }`}>
                      <item.icon className={`w-3.5 h-3.5 ${item.highlight ? "text-[hsl(var(--cta))]" : "text-white/40"}`} />
                    </div>
                    <div>
                      <p className={`text-[13px] font-medium ${item.highlight ? "text-[hsl(var(--cta))]" : "text-white/70"}`}>{item.label}</p>
                      <p className="text-[11px] text-white/25">{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a href="#how-it-works" className="hover:text-white/80 transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-white/80 transition-colors">Pricing</a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/[0.04] text-[13px] px-3 h-8 hidden sm:inline-flex" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button size="sm" className="btn-cta rounded-full px-5 text-[13px] h-9 shadow-[0_0_16px_-4px_hsl(24,100%,50%,0.3)] hidden sm:inline-flex" asChild>
            <Link to="/signup">Start Free</Link>
          </Button>
          <button
            className="md:hidden text-white/60 hover:text-white p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[hsl(222_28%_8%)] border-t border-white/[0.04] px-4 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/20 px-1 pt-3 pb-1">Product</p>
          {productItems.map(item => (
            <Link key={item.label} to={item.to} className="flex items-center gap-2.5 py-2.5 px-1 text-sm text-white/50 hover:text-white/80" onClick={() => setMobileMenuOpen(false)}>
              <item.icon className={`w-3.5 h-3.5 ${item.highlight ? "text-[hsl(var(--cta))]" : "text-white/30"}`} />
              <span className={item.highlight ? "text-[hsl(var(--cta))]" : ""}>{item.label}</span>
            </Link>
          ))}
          <div className="border-t border-white/[0.04] mt-2 pt-2 space-y-1">
            <a href="#how-it-works" className="block py-2.5 px-1 text-sm text-white/50" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#pricing" className="block py-2.5 px-1 text-sm text-white/50" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="flex-1 text-sm h-9 border-white/[0.08] text-white/50 bg-transparent" asChild>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            </Button>
            <Button size="sm" className="flex-1 btn-cta rounded-full text-sm h-9" asChild>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Start Free</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
