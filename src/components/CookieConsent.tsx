import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "wv-cookie-consent";
const VERSION = "v1";

type Consent = {
  version: string;
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  decidedAt: string;
};

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    if (parsed.version !== VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(c: Omit<Consent, "version" | "necessary" | "decidedAt">) {
  const payload: Consent = {
    version: VERSION,
    necessary: true,
    preferences: c.preferences,
    analytics: c.analytics,
    decidedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent("wv-cookie-consent-change", { detail: payload }));
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [preferences, setPreferences] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    // Defer slightly so it doesn't block initial paint
    const t = setTimeout(() => {
      if (!readConsent()) setVisible(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    saveConsent({ preferences: true, analytics: true });
    setVisible(false);
  };
  const rejectAll = () => {
    saveConsent({ preferences: false, analytics: false });
    setVisible(false);
  };
  const savePrefs = () => {
    saveConsent({ preferences, analytics });
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[100] px-3 sm:px-6 pb-3 sm:pb-6 pointer-events-none"
    >
      <div className="pointer-events-auto max-w-3xl mx-auto rounded-2xl border border-white/10 bg-[hsl(222,30%,8%)]/95 backdrop-blur-xl shadow-2xl shadow-black/40">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-10 h-10 rounded-xl bg-primary/15 items-center justify-center shrink-0">
              <Cookie className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-semibold text-base mb-1">We value your privacy</h2>
              <p className="text-sm text-white/60 leading-relaxed">
                We use cookies to keep you logged in and remember your preferences. We don't use advertising cookies. Read our{" "}
                <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link> and{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>

              {showPrefs && (
                <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                  <Row
                    title="Strictly necessary"
                    desc="Required for login, security and basic site function. Cannot be disabled."
                    checked
                    disabled
                  />
                  <Row
                    title="Preferences"
                    desc="Remember your theme, Simple Mode and other UI choices."
                    checked={preferences}
                    onChange={setPreferences}
                  />
                  <Row
                    title="Analytics"
                    desc="Aggregate, privacy-respecting usage stats. No personal profiles."
                    checked={analytics}
                    onChange={setAnalytics}
                  />
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {!showPrefs ? (
                  <>
                    <Button onClick={acceptAll} className="btn-cta rounded-full h-10 px-5">Accept all</Button>
                    <Button onClick={rejectAll} variant="outline" className="rounded-full h-10 px-5 border-white/15 bg-transparent text-white/80 hover:bg-white/5 hover:text-white">Reject non-essential</Button>
                    <Button onClick={() => setShowPrefs(true)} variant="ghost" className="rounded-full h-10 px-5 text-white/70 hover:text-white hover:bg-white/5">Manage preferences</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={savePrefs} className="btn-cta rounded-full h-10 px-5">Save preferences</Button>
                    <Button onClick={acceptAll} variant="outline" className="rounded-full h-10 px-5 border-white/15 bg-transparent text-white/80 hover:bg-white/5 hover:text-white">Accept all</Button>
                    <Button onClick={() => setShowPrefs(false)} variant="ghost" className="rounded-full h-10 px-5 text-white/70 hover:text-white hover:bg-white/5">Back</Button>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={rejectAll}
              aria-label="Reject non-essential cookies and close"
              className="text-white/40 hover:text-white/80 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  title,
  desc,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative shrink-0 mt-1 w-10 h-6 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-white/15"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
    </div>
  );
}
