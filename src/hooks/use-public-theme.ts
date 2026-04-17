import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "wv-public-theme";
type PublicTheme = "light" | "dark";

function applyTheme(theme: PublicTheme) {
  if (typeof document === "undefined") return;
  if (theme === "light") {
    document.body.classList.add("public-light");
  } else {
    document.body.classList.remove("public-light");
  }
}

function getInitial(): PublicTheme {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(STORAGE_KEY) as PublicTheme | null;
  return saved === "light" ? "light" : "dark";
}

/**
 * Theme hook for the PUBLIC marketing pages (Landing, Features, etc.).
 * Defaults to dark. Toggling adds/removes `body.public-light` which
 * triggers the CSS override block in index.css to flip dark utilities
 * to light equivalents without requiring component-level rewrites.
 */
export function usePublicTheme() {
  const [theme, setTheme] = useState<PublicTheme>(getInitial);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Ensure theme is applied on mount even before first state change
  useEffect(() => {
    applyTheme(getInitial());
    return () => {
      // Strip the class when leaving the public site (e.g. into dashboards)
      document.body.classList.remove("public-light");
    };
  }, []);

  const toggle = useCallback(() => {
    setTheme(t => (t === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggle, isLight: theme === "light" };
}
