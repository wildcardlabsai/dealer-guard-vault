import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BarChart3, ShieldCheck, Users } from "lucide-react";
import { Brand } from "@/components/vroom/SiteHeader";
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
        title="Dealer Login | VROOM"
        description="Sign in to your VROOM dealer account to manage warranties, handle claims, and grow your business."
      />
      <div className="min-h-screen flex items-center justify-center px-6 relative bg-vroom-surface text-vroom-ink">
        <div className="absolute inset-0 bg-gradient-to-br from-vroom-green/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-vroom-green/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-vroom-ink-muted hover:text-vroom-ink transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to home
            </Link>
            <Link to="/" className="inline-block mb-6"><Brand compact /></Link>
            <h1 className="text-2xl font-bold">Dealer Portal</h1>
            <p className="text-vroom-ink-muted text-sm mt-1">Sign in to manage your warranty business</p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: ShieldCheck, label: "Manage Warranties" },
              { icon: Users, label: "Handle Claims" },
              { icon: BarChart3, label: "Grow Revenue" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-lg border border-vroom-line bg-vroom-panel p-3 text-center shadow-sm">
                <Icon className="w-5 h-5 mx-auto mb-1 text-vroom-green-deep" />
                <p className="text-xs text-vroom-ink-muted">{label}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="rounded-xl border border-vroom-line bg-vroom-panel p-6 space-y-4 mb-6 shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-vroom-ink">Email</Label>
              <Input id="email" type="email" placeholder="you@company.co.uk" value={email} onChange={e => setEmail(e.target.value)} className="bg-vroom-surface border-vroom-line text-vroom-ink placeholder:text-vroom-ink-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-vroom-ink">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="bg-vroom-surface border-vroom-line text-vroom-ink placeholder:text-vroom-ink-muted" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-vroom-green font-bold text-vroom-green-foreground hover:bg-vroom-green-hover" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-xs text-vroom-ink-muted">
              Don't have an account? <Link to="/signup" className="text-vroom-green-deep hover:underline">Apply here</Link>
            </p>
            <p className="text-xs text-vroom-ink-muted">
              Are you a customer? <Link to="/customers" className="text-vroom-green-deep hover:underline">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
