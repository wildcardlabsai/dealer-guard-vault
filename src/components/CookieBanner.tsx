import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const STORAGE_KEY = "wv-cookie-consent";

type Consent = "accepted" | "rejected";

export function getCookieConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "accepted" || v === "rejected" ? v : null;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!getCookieConsent()) setVisible(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const setConsent = (value: Consent) => {
    localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new CustomEvent("wv-cookie-consent", { detail: value }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-md z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="glass-card-strong rounded-2xl p-5 shadow-xl border border-border">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground mb-1">We use cookies</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use essential cookies to make our site work and analytics cookies to understand how you use it.
              You can accept or reject non-essential cookies. See our{" "}
              <Link to="/contact" className="underline hover:text-foreground">privacy notice</Link> for details.
            </p>
          </div>
          <button
            onClick={() => setConsent("rejected")}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 h-9 text-xs" onClick={() => setConsent("rejected")}>
            Reject non-essential
          </Button>
          <Button size="sm" className="flex-1 h-9 text-xs btn-cta" onClick={() => setConsent("accepted")}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
