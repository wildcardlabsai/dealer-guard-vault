import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import logo from "@/assets/warrantylogo.png";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <>
      <SEOHead
        title="Forgot Password | WarrantyVault"
        description="Reset your WarrantyVault customer account password."
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
            <h1 className="text-2xl font-bold font-display">Forgot Password</h1>
            <p className="text-muted-foreground text-sm mt-1">We'll send you a link to reset your password</p>
          </div>

          {sent ? (
            <div className="glass-card-strong rounded-xl p-6 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
              <h2 className="font-semibold font-display text-lg">Check Your Email</h2>
              <p className="text-sm text-muted-foreground">
                If an account exists for <span className="font-medium text-foreground">{email}</span>, you'll receive a password reset link shortly.
              </p>
              <Link to="/customers">
                <Button variant="outline" className="w-full mt-2">Back to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card-strong rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <Button type="submit" className="w-full glow-primary-sm" disabled={loading}>
                {loading ? "Sending..." : <><Mail className="w-4 h-4 mr-2" /> Send Reset Link</>}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
