import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BarChart3, ShieldCheck, Users } from "lucide-react";
import logo from "@/assets/warrantylogo.png";
import SEOHead from "@/components/SEOHead";

export default function DealersLoginPage() {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === "dealer") {
      navigate("/dealer", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      const { demoUsers } = await import("@/data/demo-data");
      const found = demoUsers.find(u => u.email === email);
      if (found?.role === "dealer") {
        navigate("/dealer");
      } else {
        setError("This portal is for dealers only. Please use the correct login.");
      }
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <>
      <SEOHead
        title="Dealer Login | WarrantyVault"
        description="Sign in to your WarrantyVault dealer account to manage warranties, handle claims, and grow your business."
        noindex
      />
      <div className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            <img src={logo} alt="WarrantyVault" className="h-8 mb-6" />
            <h1 className="text-2xl font-bold font-display">Dealer Portal</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to manage your warranty business</p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: ShieldCheck, label: "Manage Warranties" },
              { icon: Users, label: "Handle Claims" },
              { icon: BarChart3, label: "Grow Revenue" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="glass-card rounded-lg p-3 text-center">
                <Icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
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

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Don't have an account? <Link to="/signup" className="text-primary hover:underline">Apply here</Link>
            </p>
            <p className="text-xs text-muted-foreground">
              Are you a customer? <Link to="/customers" className="text-primary hover:underline">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
