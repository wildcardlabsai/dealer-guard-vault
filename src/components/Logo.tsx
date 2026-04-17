import { useEffect, useState } from "react";
import logoDark from "@/assets/warrantylogo.png";
import logoLight from "@/assets/warrantylogo-light.png";

interface LogoProps {
  className?: string;
  alt?: string;
}

/**
 * Logo that swaps between dark-mode and light-mode variants based on
 * the `dark` class on <html>. Watches for class changes so theme toggles
 * update the image without a reload.
 */
export default function Logo({ className = "h-6", alt = "WarrantyVault" }: LogoProps) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === "undefined") return true;
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => {
      setIsDark(el.classList.contains("dark"));
    });
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return <img src={isDark ? logoDark : logoLight} alt={alt} className={className} />;
}
