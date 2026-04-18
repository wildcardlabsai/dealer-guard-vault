import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield, FileText, ClipboardList } from "lucide-react";
import logo from "@/assets/warrantylogo.png";
import SEOHead from "@/components/SEOHead";

export default function CustomersLoginPage() {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === "customer") {
      navigate("/customer", { replace: true });
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
      // After login, check the user from context — supports both demo and real users
      // Small delay to let state settle
      await new Promise(r => setTimeout(r, 100));
      navigate("/customer");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <>
      <SEOHead
        title="Customer Login | WarrantyVault"
        description="Sign in to your WarrantyVault customer account to view warranties, track claims, and download certificates."
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
            <h1 className="text-2xl font-bold font-display">Customer Portal</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to access your warranty dashboard</p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Shield, label: "View Warranty" },
              { icon: ClipboardList, label: "Track Claims" },
              { icon: FileText, label: "Certificates" },
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
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full glow-primary-sm" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Are you a dealer? <Link to="/dealers" className="text-primary hover:underline">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
