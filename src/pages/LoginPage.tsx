import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft, Car, Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import type { UserRole } from "@/data/demo-data";
import logo from "@/assets/warrantylogo.png";

export default function LoginPage() {
  const { login, loginAs } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      const user = (await import("@/data/demo-data")).demoUsers.find(u => u.email === email);
      if (user?.role === "admin") navigate("/admin");
      else if (user?.role === "dealer") navigate("/dealer");
      else navigate("/customer");
    } else {
      setError("Invalid credentials. Use a demo login below.");
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    loginAs(role);
    if (role === "admin") navigate("/admin");
    else if (role === "dealer") navigate("/dealer");
    else navigate("/customer");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - dark teal branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-accent/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-teal-light/20 rounded-full blur-[80px]" />
        <div className="relative text-center text-white max-w-md">
          <img src={logo} alt="WarrantyVault" className="h-12 mx-auto mb-8 brightness-200" />
          <h2 className="text-3xl font-bold font-display mb-4">
            Welcome back<span className="text-accent">.</span>
          </h2>
          <p className="text-white/60 leading-relaxed">
            Manage your warranties, track claims, and keep full control of your dealership's warranty programme.
          </p>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            <div className="lg:hidden mb-6">
              <img src={logo} alt="WarrantyVault" className="h-8" />
            </div>
            <h1 className="text-2xl font-bold font-display">Sign in to your account</h1>
            <p className="text-muted-foreground text-sm mt-1">Enter your credentials or use a demo login</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-4 mb-6 shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.co.uk" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">Demo Logins</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start rounded-lg" onClick={() => handleQuickLogin("dealer")}>
                <Car className="w-4 h-4 mr-2 text-accent" /> Login as Dealer
                <span className="ml-auto text-xs text-muted-foreground">dealer@prestige-motors.co.uk</span>
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-lg" onClick={() => handleQuickLogin("customer")}>
                <Users className="w-4 h-4 mr-2 text-primary" /> Login as Customer
                <span className="ml-auto text-xs text-muted-foreground">john@example.com</span>
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-lg" onClick={() => handleQuickLogin("admin")}>
                <Settings className="w-4 h-4 mr-2 text-muted-foreground" /> Login as Admin
                <span className="ml-auto text-xs text-muted-foreground">admin@warrantyvault.com</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
