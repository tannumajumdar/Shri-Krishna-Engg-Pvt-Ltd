"use client";

import {
  Users,
  Factory,
  Target,
  Clock4,
  Award,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { type Feature } from "@/lib/site";

type Reason = { title: string; detail: string; icon: LucideIcon };

/**
 * Five reasons, stated flat.
 *
 * These are claims a buyer checks off, not articles to read, so each gets one
 * line of substantiation and nothing more. Kept as a fixed set rather than
 * driven from the features record: that record holds long marketing paragraphs
 * which do not fit this shape, and trimming them at render would silently cut
 * sentences in half.
 */
const REASONS: Reason[] = [
  { title: "Own Workforce", detail: "250+ trained professionals", icon: Users },
  { title: "In-house Fabrication", detail: "Structural, plate, pipe & tanks", icon: Factory },
  { title: "Single-point Responsibility", detail: "From foundation to commissioning", icon: Target },
  { title: "24×7 Response", detail: "Rapid support for critical breakdowns", icon: Clock4 },
  { title: "Industrial Experience", detail: "19+ years in heavy industry", icon: Award },
];

export function WhyChooseUs({
  /** Accepted so the page can keep passing DB features; see the note above. */
  items,
}: {
  items?: Feature[];
} = {}) {
  void items;

  return (
    <section id="why" className="bg-surface-2 py-20 lg:py-28">
      <div className="container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <Reveal className="max-w-2xl">
            <span className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-ink-faint">
              <span className="h-px w-10 bg-accent-500" />
              Why Krishna
            </span>
            <h2 className="font-display text-display-sm font-semibold uppercase leading-[1.05] tracking-tight text-ink">
              Trusted where
              <br />
              performance matters.
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="lg:max-w-xs lg:pb-2">
            <p className="text-[13.5px] leading-relaxed text-ink-faint">
              Our relationships are built through on-time delivery, safety and
              consistent execution.
            </p>
          </Reveal>
        </div>

        {/* A five-across rule-separated row, not five cards: these are entries
            in one list, and boxing each would make them read as alternatives
            to choose between. */}
        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden border-y border-hairline bg-hairline sm:grid-cols-3 lg:mt-16 lg:grid-cols-5">
          {REASONS.map((reason, i) => (
            <div key={reason.title} className="bg-surface-2 px-5 py-8">
              <Reveal delay={i * 0.06}>
                <reason.icon
                  className="h-[26px] w-[26px] text-ink"
                  strokeWidth={1.35}
                  aria-hidden="true"
                />
                <dt className="mt-5 text-pretty font-display text-[14px] font-semibold leading-snug text-ink">
                  {reason.title}
                </dt>
                <dd className="mt-2 text-pretty text-[12.5px] leading-snug text-ink-faint">
                  {reason.detail}
                </dd>
              </Reveal>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
