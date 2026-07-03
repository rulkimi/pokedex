"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <Button variant="ghost" size="icon" className="group rounded-full shadow-sm border bg-background h-10 w-10 shrink-0 text-muted-foreground hover:bg-transparent lg:border-transparent lg:shadow-none lg:bg-transparent"><Sun className="w-5 h-5 opacity-0" /></Button>;

  const isDark = resolvedTheme === "dark";

  const toggleTheme = (event: React.MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    const isDarkNext = !isDark;

    if (!document.startViewTransition) {
      setTheme(isDarkNext ? "dark" : "light");
      return;
    }

    // Set CSS variables for the center of the ripple
    document.documentElement.style.setProperty("--click-x", `${x}px`);
    document.documentElement.style.setProperty("--click-y", `${y}px`);

    // Add a class to globally disable CSS transitions during the View Transition API DOM capture
    document.documentElement.classList.add("view-transitioning");

    const transition = document.startViewTransition(() => {
      document.documentElement.classList.toggle("dark", isDarkNext);
      setTheme(isDarkNext ? "dark" : "light");
    });

    // Remove the class once the transition fully finishes
    transition.finished.finally(() => {
      document.documentElement.classList.remove("view-transitioning");
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="group rounded-full shadow-sm border bg-background h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground hover:bg-transparent lg:border-transparent lg:shadow-none lg:bg-transparent transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon className="w-5 h-5 transition-all group-hover:fill-current" />
      ) : (
        <Sun className="w-5 h-5 transition-all group-hover:fill-current" />
      )}
    </Button>
  );
}
