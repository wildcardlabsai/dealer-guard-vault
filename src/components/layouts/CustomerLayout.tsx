import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Shield, FileText, MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/warrantylogo.png";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/customer" },
  { label: "My Warranty", icon: Shield, path: "/customer/warranty" },
  { label: "Claims", icon: FileText, path: "/customer/claims" },
  { label: "Requests", icon: MessageSquare, path: "/customer/requests" },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 flex-shrink-0 border-r border-border/50 bg-card/40 backdrop-blur-sm flex-col hidden md:flex">
        <div className="p-4 border-b border-border/50">
          <img src={logo} alt="WarrantyVault" className="h-6" />
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}>
                <item.icon className="w-4 h-4" /> <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border/50">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 border-b border-border/50 flex items-center px-4 gap-3 bg-card/40">
          <img src={logo} alt="WarrantyVault" className="h-5" />
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4" /></Button>
        </header>
        <div className="md:hidden flex overflow-x-auto border-b border-border/50 bg-card/20 px-2">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 text-xs whitespace-nowrap ${active ? "text-primary" : "text-muted-foreground"}`}>
                <item.icon className="w-4 h-4" />{item.label}
              </Link>
            );
          })}
        </div>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
