import { Link } from "react-router-dom";
import logo from "@/assets/warrantylogo.png";

export default function PublicFooter() {
  return (
    <footer className="py-8 px-6 border-t border-white/10 hero-gradient">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/"><img src={logo} alt="WarrantyVault" className="h-6 opacity-60" /></Link>
        <p className="text-xs text-muted-foreground">Built by <span className="text-foreground font-medium">Wildcard Labs</span></p>
        <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
          <Link to="/dealers" className="hover:text-foreground transition-colors">Dealer Portal</Link>
          <Link to="/customers" className="hover:text-foreground transition-colors">Customer Portal</Link>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
