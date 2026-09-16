"use client";

import type { ReactNode } from "react";
import { Reveal, RevealHeading } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * The repeating section header: eyebrow, large display heading, optional
 * standfirst, optional trailing action. Keeps vertical rhythm identical
 * across every section on the page.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  align = "split",
  tone = "light",
  className,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  action?: ReactNode;
  /** "split" puts the action opposite the heading; "center" stacks it. */
  align?: "split" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16",
        className,
      )}
    >
      <div className={align === "center" ? "" : "max-w-2xl"}>
        <Reveal>
          <p
            className={cn(
              "flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label",
              align === "center" && "justify-center",
              dark ? "text-white/50" : "text-ink-faint",
            )}
          >
            <span
              className={cn("h-px w-10", dark ? "bg-accent-400" : "bg-accent-500")}
              aria-hidden="true"
            />
            {eyebrow}
          </p>
        </Reveal>

        <RevealHeading
          as="h2"
          delay={0.06}
          text={title}
          className={cn(
            "mt-5 font-display text-display-sm font-semibold uppercase leading-[1.05] tracking-tight",
            dark ? "text-white" : "text-ink",
          )}
        />

        {intro && (
          <Reveal delay={0.14}>
            <p
              className={cn(
                "mt-6 max-w-xl text-pretty text-[13.5px] leading-relaxed",
                align === "center" && "mx-auto",
                dark ? "text-white/60" : "text-ink-muted",
              )}
            >
              {intro}
            </p>
          </Reveal>
        )}
      </div>

      {action && (
        <Reveal delay={0.2} className={cn("shrink-0", align === "center" && "mt-8")}>
          {action}
        </Reveal>
      )}
    </div>
  );
}
