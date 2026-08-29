"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "light" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium " +
  "transition-[color,background-color,border-color,box-shadow,transform] duration-500 ease-brand " +
  "active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  /* Primary action — the brand green, lifting to a brighter tone on hover */
  solid:
    "bg-brand-500 text-white shadow-lift hover:bg-brand-600 hover:shadow-lift-lg",
  /* On dark imagery: hairline metal outline that fills on hover */
  outline:
    "border border-white/30 text-white backdrop-blur-sm hover:border-brand-400/70 hover:bg-brand-500/15",
  /* On dark imagery: solid green pill */
  light: "bg-brand-400 text-navy-950 shadow-lift hover:bg-brand-300 hover:shadow-lift-lg",
  ghost: "text-ink hover:bg-surface-2",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-[13px]",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-[15px]",
};

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Appends an arrow that nudges right on hover. */
  withArrow?: boolean;
} & ComponentPropsWithoutRef<"a">;

export function Button({
  children,
  variant = "solid",
  size = "md",
  className,
  withArrow = false,
  ...props
}: ButtonProps) {
  return (
    <a className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {/* metallic sheen sweeps across on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-brand group-hover/btn:translate-x-[130%]"
      />
      <span className="relative z-10">{children}</span>
      {withArrow && (
        <ArrowRight
          className="relative z-10 h-4 w-4 transition-transform duration-500 ease-brand group-hover/btn:translate-x-1"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      )}
    </a>
  );
}
