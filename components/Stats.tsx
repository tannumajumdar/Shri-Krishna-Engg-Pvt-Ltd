"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Ease-out curve for the count-up — fast start, settled finish. */
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function Counter({
  to,
  suffix = "",
  duration = 1900,
  start,
  suffixClass,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  start: boolean;
  /** The lime needs a darker step to stay legible on white. */
  suffixClass: string;
}) {
  const [value, setValue] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!start || done.current) return;

    // Anyone who asked for less motion still gets the number, just instantly.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      done.current = true;
      return;
    }

    let frame = 0;
    let startedAt: number | null = null;

    const tick = (now: number) => {
      if (startedAt === null) startedAt = now;
      const progress = Math.min((now - startedAt) / duration, 1);
      setValue(Math.round(easeOutExpo(progress) * to));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else done.current = true;
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, to, duration]);

  return (
    <span className="tabular-nums">
      {value}
      <span className={suffixClass}>{suffix}</span>
    </span>
  );
}

export function Stats({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const dark = variant === "dark";

  return (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-xl lg:grid-cols-4",
        dark ? "bg-white/10" : "bg-hairline",
        className,
      )}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.1, duration: 0.75, ease: EASE }}
          className={cn(
            "group relative px-5 py-7 transition-colors duration-500 sm:px-7 sm:py-9",
            dark ? "bg-navy-900 hover:bg-navy-800" : "bg-surface hover:bg-surface-2",
          )}
        >
          {/* accent rule that draws in on hover */}
          <span
            className={cn(
              "absolute left-0 top-0 h-0.5 w-0 transition-[width] duration-700 ease-brand group-hover:w-full",
              dark ? "bg-accent-400" : "bg-ink",
            )}
          />

          <div
            className={cn(
              "font-display text-4xl font-light leading-none tracking-tightest sm:text-5xl",
              dark ? "text-white" : "text-ink",
            )}
          >
            <Counter
              to={stat.value}
              suffix={stat.suffix}
              start={inView}
              suffixClass={dark ? "text-accent-400" : "text-accent-600 dark:text-accent-400"}
            />
          </div>

          <div
            className={cn(
              "mt-4 text-[13px] font-medium leading-snug",
              dark ? "text-white/85" : "text-ink",
            )}
          >
            {stat.label}
          </div>
          <div
            className={cn(
              "mt-1 text-xs leading-snug",
              dark ? "text-white/45" : "text-ink-faint",
            )}
          >
            {stat.detail}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
