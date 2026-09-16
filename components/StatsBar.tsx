"use client";

import { CalendarClock, Users, Clock4, Layers } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { stats as staticStats } from "@/lib/site";

type Stat = { value: number; suffix: string; label: string; detail?: string };

/* The bar carries four figures and no more — it sits directly under the hero,
   and a fifth would push the About heading below the fold on a laptop. */
const ICONS = [CalendarClock, Users, Clock4, Layers];

/**
 * The band of numbers between the hero and the About section.
 *
 * Deliberately a plain white strip rather than a row of cards: it is a
 * caption to the hero, not a set of objects to compare, and boxing each
 * figure would give it more weight than the headline above it.
 */
export function StatsBar({ items }: { items?: readonly Stat[] } = {}) {
  const stats = (items?.length ? items : staticStats).slice(0, 4);

  return (
    <section
      aria-label="Shree Krishna Engineering in numbers"
      className="border-b border-hairline bg-surface"
    >
      <div className="container">
        <div className="grid gap-x-8 gap-y-10 py-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-x-16 lg:py-14">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-4 sm:gap-x-4">
            {stats.map((stat, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <Reveal key={stat.label} delay={i * 0.06}>
                  <div className="flex items-start gap-3.5">
                    <Icon
                      className="mt-0.5 h-[22px] w-[22px] shrink-0 text-ink"
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <dt className="sr-only">{stat.label}</dt>
                      <dd className="font-display text-[26px] font-semibold leading-none tracking-tight text-ink">
                        {stat.value}
                        {stat.suffix}
                      </dd>
                      <p className="mt-1.5 text-[12.5px] leading-snug text-ink-faint">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </dl>

          <Reveal delay={0.24}>
            <p className="font-display text-[19px] font-semibold uppercase leading-[1.25] tracking-tight text-ink lg:text-right">
              Built around
              <br />
              execution,{" "}
              <span className="relative whitespace-nowrap">
                not promises.
                <span
                  className="absolute -bottom-2 right-0 block h-[3px] w-12 bg-accent-500"
                  aria-hidden="true"
                />
              </span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
