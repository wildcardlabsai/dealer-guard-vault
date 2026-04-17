import { useEffect } from "react";

/**
 * Public marketing pages are LIGHT MODE ONLY.
 * This hook forces `body.public-light` on while a public page is mounted
 * and strips it on unmount (so authenticated dashboards stay on their own
 * dark/light theme system driven by `<html class="dark">`).
 *
 * No toggle, no localStorage — by design. Public site = light, always.
 */
export function usePublicTheme() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.add("public-light");
    return () => {
      document.body.classList.remove("public-light");
    };
  }, []);

  return { theme: "light" as const, isLight: true };
}
