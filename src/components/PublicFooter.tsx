import { Link } from "react-router-dom";
import logo from "@/assets/warrantylogo.png";

export default function PublicFooter() {
  return (
    <footer className="py-10 px-6 border-t border-white/[0.04] bg-[hsl(222_30%_6%)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/"><img src={logo} alt="WarrantyVault" className="h-6 opacity-50 mb-3" /></Link>
            <p className="text-[11px] text-white/20 leading-relaxed">Self-funded warranty software built for UK independent car dealers.</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/25 mb-3">Product</p>
            <div className="space-y-2">
              <Link to="/features" className="block text-xs text-white/35 hover:text-white/60 transition-colors">Features</Link>
              <Link to="/disputeiq" className="block text-xs text-white/35 hover:text-white/60 transition-colors">DisputeIQ</Link>
              <a href="#pricing" className="block text-xs text-white/35 hover:text-white/60 transition-colors">Pricing</a>
              <a href="#how-it-works" className="block text-xs text-white/35 hover:text-white/60 transition-colors">How It Works</a>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/25 mb-3">Resources</p>
            <div className="space-y-2">
              <Link to="/faq" className="block text-xs text-white/35 hover:text-white/60 transition-colors">FAQ</Link>
              <Link to="/blog" className="block text-xs text-white/35 hover:text-white/60 transition-colors">Blog</Link>
              <Link to="/warranty-line" className="block text-xs text-white/35 hover:text-white/60 transition-colors">Warranty Line</Link>
              <Link to="/contact" className="block text-xs text-white/35 hover:text-white/60 transition-colors">Contact Us</Link>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/25 mb-3">Portals</p>
            <div className="space-y-2">
              <Link to="/dealers" className="block text-xs text-white/35 hover:text-white/60 transition-colors">Dealer Login</Link>
              <Link to="/customers" className="block text-xs text-white/35 hover:text-white/60 transition-colors">Customer Login</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/15">© {new Date().getFullYear()} WarrantyVault by <span className="text-white/25">Wildcard Labs</span></p>
          <div className="flex gap-5 text-[11px] text-white/20">
            <a href="#" className="hover:text-white/40 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/40 transition-colors">Terms</a>
            <Link to="/contact" className="hover:text-white/40 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
