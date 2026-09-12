"use client";

import { useEffect, useState } from "react";

/**
 * Whether scroll-linked parallax should run at all.
 *
 * Translating — and worse, scaling — a full-bleed video layer forces the
 * compositor to resample the decoded frame on every scroll event. A desktop
 * GPU absorbs that; a phone spends its frame budget on it and the footage
 * visibly hitches. So parallax is desktop-and-pointer only, and anyone who
 * asked for reduced motion never gets it.
 */
export function useParallaxEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const queries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(min-width: 1024px)"),
      window.matchMedia("(pointer: fine)"),
    ];
    const [reduce, wide, fine] = queries;

    const sync = () => setEnabled(!reduce.matches && wide.matches && fine.matches);
    sync();

    queries.forEach((q) => q.addEventListener("change", sync));
    return () => queries.forEach((q) => q.removeEventListener("change", sync));
  }, []);

  return enabled;
}

/** Picks the parallax range when it is on, and a no-op range when it is not. */
export function parallaxRange<T>(enabled: boolean, range: T[], rest: T): T[] {
  return enabled ? range : range.map(() => rest);
}
