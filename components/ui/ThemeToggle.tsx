"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/** Must match the key read by the inline script in app/layout.tsx. */
const THEME_KEY = "ske-theme";

/**
 * Light/dark switch.
 *
 * Deliberately stateless: the current theme lives in a class on <html>, and
 * both the icons and the accessible label are chosen by CSS `dark:` variants.
 * That means the button renders correctly on the very first paint — a React
 * state hook would start on the server default and flip after hydration,
 * which is exactly the flash the inline theme script exists to prevent.
 */
export function ThemeToggle({
  onDark = false,
  className,
}: {
  /** True while the control sits over dark imagery (hero, mobile sheet). */
  onDark?: boolean;
  className?: string;
}) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";

    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;

    // Private browsing can refuse writes; the toggle still works for the
    // session, it just will not be remembered.
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-300",
        onDark
          ? "border-white/25 text-white hover:bg-white/10"
          : "border-hairline text-ink hover:bg-surface-2",
        className,
      )}
    >
      <span className="relative block h-[18px] w-[18px]">
        <Sun
          className="absolute inset-0 h-[18px] w-[18px] rotate-0 scale-100 opacity-100 transition-all duration-500 ease-brand dark:-rotate-90 dark:scale-0 dark:opacity-0"
          strokeWidth={1.6}
          aria-hidden="true"
        />
        <Moon
          className="absolute inset-0 h-[18px] w-[18px] rotate-90 scale-0 opacity-0 transition-all duration-500 ease-brand dark:rotate-0 dark:scale-100 dark:opacity-100"
          strokeWidth={1.6}
          aria-hidden="true"
        />
      </span>

      {/* The button's accessible name, swapped by CSS rather than state. The
          nesting keeps sr-only always applied while only display toggles. */}
      <span className="sr-only">
        <span className="dark:hidden">Switch to dark mode</span>
        <span className="hidden dark:inline">Switch to light mode</span>
      </span>
    </button>
  );
}
