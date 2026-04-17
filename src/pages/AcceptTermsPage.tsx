import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Shield, FileText, ExternalLink, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  CURRENT_DASHBOARD_TERMS_VERSION,
  DEALER_AGREEMENT_SUMMARY,
} from "@/lib/terms-config";
import { recordDealerAcceptance } from "@/lib/dealer-terms-acceptance";
import logo from "@/assets/warrantylogo.png";
import SEOHead from "@/components/SEOHead";

export default function AcceptTermsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [agreeMain, setAgreeMain] = useState(false);
  const [agreeResp, setAgreeResp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!agreeMain || !agreeResp) {
      setError("You must agree to both statements before continuing.");
      return;
    }
    if (!user?.id) {
      setError("Session expired. Please log in again.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await recordDealerAcceptance({ userId: user.id, dealerId: user.dealerId || "" });
      toast.success("Agreement accepted successfully.");
      navigate("/dealer", { replace: true });
    } catch (e: any) {
      setError(e?.message || "Could not record acceptance. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(222,30%,8%)] text-white">
      <SEOHead
        title="Dealer Agreement & Terms Acceptance | WarrantyVault"
        description="Confirm your acceptance of the WarrantyVault Dealer Agreement, Terms of Use and Privacy Policy."
        noindex
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-[hsl(222,30%,7%)]">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="WarrantyVault" className="h-7" />
          </Link>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure acceptance</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        {/* Title */}
        <div className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-3">
            Dealer Onboarding · Step 1 of 1
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3">
            Dealer Agreement & Terms Acceptance
          </h1>
          <p className="text-white/60 leading-relaxed max-w-2xl">
            Before you continue, you must agree to the WarrantyVault Terms of Use, Dealer Agreement summary, and Privacy Policy.
          </p>
        </div>

        {/* Summary card */}
        <section className="rounded-2xl border border-white/10 bg-[hsl(222,28%,11%)] p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-lg font-semibold text-white">What you are agreeing to</h2>
          </div>
          <ul className="space-y-3">
            {DEALER_AGREEMENT_SUMMARY.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[14.5px] text-white/85 leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 pt-5 border-t border-white/8 text-xs text-white/40 leading-relaxed">
            This summary is provided for convenience only. Please read the full Terms of Use and Privacy Policy before accepting.
          </p>
        </section>

        {/* Doc links */}
        <div className="flex flex-wrap gap-3 mb-8">
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-4 py-2.5 bg-white/5 transition-colors"
          >
            <FileText className="w-4 h-4" />
            View Terms of Use
            <ExternalLink className="w-3.5 h-3.5 opacity-50" />
          </a>
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-4 py-2.5 bg-white/5 transition-colors"
          >
            <FileText className="w-4 h-4" />
            View Privacy Policy
            <ExternalLink className="w-3.5 h-3.5 opacity-50" />
          </a>
        </div>

        {/* Checkboxes */}
        <section className="rounded-2xl border border-white/10 bg-[hsl(222,28%,10%)] p-6 md:p-7 mb-6 space-y-5">
          <label className="flex items-start gap-3 cursor-pointer group">
            <Checkbox
              checked={agreeMain}
              onCheckedChange={(c) => { setAgreeMain(c === true); setError(null); }}
              className="mt-0.5 border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="text-[14.5px] text-white/90 leading-relaxed">
              I have read and agree to the <Link to="/terms" target="_blank" className="text-primary hover:underline">Terms of Use</Link>, Dealer Agreement summary, and <Link to="/privacy" target="_blank" className="text-primary hover:underline">Privacy Policy</Link>.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <Checkbox
              checked={agreeResp}
              onCheckedChange={(c) => { setAgreeResp(c === true); setError(null); }}
              className="mt-0.5 border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="text-[13.5px] text-white/75 leading-relaxed">
              I understand that WarrantyVault helps me manage warranties, but I remain responsible for warranty decisions, claims, and legal compliance.
            </span>
          </label>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/5"
            onClick={() => { logout(); navigate("/dealers", { replace: true }); }}
          >
            Log out
          </Button>
          <Button
            size="lg"
            className="btn-cta rounded-full px-8 h-12"
            onClick={handleAccept}
            disabled={submitting}
          >
            {submitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Recording…</>) : "Accept & Continue"}
          </Button>
        </div>

        {/* Audit note */}
        <p className="mt-10 text-center text-xs text-white/35">
          Your acceptance is recorded with the date, time, IP address, and version ({CURRENT_DASHBOARD_TERMS_VERSION}) of the agreement.
        </p>
      </main>
    </div>
  );
}
