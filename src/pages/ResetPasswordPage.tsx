import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, CheckCircle2, Circle, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/warrantylogo.png";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";

function PasswordRequirements({ password, confirmPassword }: { password: string; confirmPassword: string }) {
  const rules = useMemo(() => [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains an uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains a lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
  ], [password]);

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const showMismatch = confirmPassword.length > 0 && !passwordsMatch;

  return (
    <div className="space-y-2 mt-3">
      <p className="text-xs font-medium text-muted-foreground">Password requirements</p>
      <div className="space-y-1.5">
        {rules.map(rule => (
          <div key={rule.label} className="flex items-center gap-2">
            {rule.met ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
            )}
            <span className={`text-xs ${rule.met ? "text-primary" : "text-muted-foreground"}`}>{rule.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          {passwordsMatch ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          ) : (
            <Circle className={`w-3.5 h-3.5 flex-shrink-0 ${showMismatch ? "text-destructive" : "text-muted-foreground/40"}`} />
          )}
          <span className={`text-xs ${passwordsMatch ? "text-primary" : showMismatch ? "text-destructive" : "text-muted-foreground"}`}>
            {showMismatch ? "Passwords do not match" : "Passwords match"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) setIsRecovery(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const allRulesMet = password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const canSubmit = allRulesMet && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please meet all password requirements");
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
      <SEOHead title="Reset Password | WarrantyVault" description="Set a new password for your WarrantyVault account." noindex />
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
              <Button className="w-full" onClick={() => navigate("/customers")}>Go to Login</Button>
            </div>
          ) : !isRecovery ? (
            <div className="glass-card-strong rounded-xl p-6 text-center space-y-4">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto" />
              <h2 className="font-semibold font-display text-lg">Invalid Reset Link</h2>
              <p className="text-sm text-muted-foreground">This link is invalid or has expired. Please request a new password reset.</p>
              <Button className="w-full" variant="outline" onClick={() => navigate("/customers")}>Back to Login</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card-strong rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="pr-10" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <PasswordRequirements password={password} confirmPassword={confirmPassword} />

              <Button type="submit" className="w-full glow-primary-sm" disabled={loading || !canSubmit}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
