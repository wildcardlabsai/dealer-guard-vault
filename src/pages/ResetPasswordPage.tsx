import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import logo from "@/assets/warrantylogo.png";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    // Listen for auth state changes (recovery flow sets session automatically)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSuccess(true);
      toast.success("Password updated successfully!");
    }
  };

  return (
    <>
      <SEOHead
        title="Reset Password | WarrantyVault"
        description="Set a new password for your WarrantyVault account."
        noindex
      />
      <div className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="w-full max-w-md relative">
          <div className="mb-8">
            <Link to="/customers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
            <img src={logo} alt="WarrantyVault" className="h-8 mb-6" />
            <h1 className="text-2xl font-bold font-display">Reset Password</h1>
            <p className="text-muted-foreground text-sm mt-1">Enter your new password below</p>
          </div>

          {success ? (
            <div className="glass-card-strong rounded-xl p-6 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
              <h2 className="font-semibold font-display text-lg">Password Updated</h2>
              <p className="text-sm text-muted-foreground">Your password has been successfully reset. You can now sign in with your new password.</p>
              <Button className="w-full" onClick={() => navigate("/customers")}>
                Go to Login
              </Button>
            </div>
          ) : !isRecovery ? (
            <div className="glass-card-strong rounded-xl p-6 text-center space-y-4">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
              <h2 className="font-semibold font-display text-lg">Invalid Reset Link</h2>
              <p className="text-sm text-muted-foreground">This link is invalid or has expired. Please request a new password reset.</p>
              <Button className="w-full" variant="outline" onClick={() => navigate("/customers")}>
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card-strong rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full glow-primary-sm" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
