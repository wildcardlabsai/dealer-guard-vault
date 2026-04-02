import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <img src={logo} alt="WarrantyVault" className="h-8 mb-6" />
          <h1 className="text-2xl font-bold font-display">Sign in to your account</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter your credentials or use a demo login</p>
          <p className="text-xs text-muted-foreground mt-3">Don't have an account? <Link to="/signup" className="text-primary hover:underline">Apply here</Link></p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card-strong rounded-xl p-6 space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@company.co.uk" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full glow-primary-sm" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="glass-card rounded-xl p-6">
          <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">Demo Logins</p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickLogin("dealer")}>
              <Shield className="w-4 h-4 mr-2 text-primary" /> Login as Dealer
              <span className="ml-auto text-xs text-muted-foreground">dealer@prestige-motors.co.uk</span>
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickLogin("customer")}>
              <Shield className="w-4 h-4 mr-2 text-blue-400" /> Login as Customer
              <span className="ml-auto text-xs text-muted-foreground">john@example.com</span>
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => handleQuickLogin("admin")}>
              <Shield className="w-4 h-4 mr-2 text-amber-400" /> Login as Admin
              <span className="ml-auto text-xs text-muted-foreground">admin@warrantyvault.com</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
