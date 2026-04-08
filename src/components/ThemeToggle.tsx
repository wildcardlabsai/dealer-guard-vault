import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("wv-theme", theme);
  }, [theme]);

  const toggleTheme = () => setThemeState(prev => prev === "dark" ? "light" : "dark");

  return { theme, toggleTheme };
}

interface ThemeToggleProps {
  collapsed?: boolean;
}

export default function ThemeToggle({ collapsed }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`${collapsed ? "w-8 h-8 p-0 justify-center" : "w-full justify-start"} text-muted-foreground`}
      onClick={toggleTheme}
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      {!collapsed && <span className="ml-2">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
    </Button>
  );
}
