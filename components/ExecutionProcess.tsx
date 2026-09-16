"use client";

import {
  DraftingCompass,
  Hammer,
  Construction,
  ClipboardCheck,
  Factory,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Step = { key: string; label: string; detail: string; icon: LucideIcon };

/**
 * The six stages of a job, in the order they happen.
 *
 * Numbering is earned here — this is a real sequence, and a visitor reading it
 * needs to know that commissioning follows erection, not the other way round.
 * The connecting rule between the icons carries that order visually.
 */
const STEPS: Step[] = [
  { key: "plan", label: "Plan", detail: "Engineering & Planning", icon: DraftingCompass },
  { key: "build", label: "Build", detail: "Fabrication & Civil", icon: Hammer },
  { key: "erect", label: "Erect", detail: "Mechanical & Structural", icon: Construction },
  { key: "commission", label: "Commission", detail: "Testing & Alignment", icon: ClipboardCheck },
  { key: "operate", label: "Operate", detail: "Plant O&M", icon: Factory },
  { key: "support", label: "Support", detail: "Maintenance & Response", icon: LifeBuoy },
];

export function ExecutionProcess() {
  return (
    <section id="process" className="relative bg-surface py-20 lg:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Our Execution Process"
          title="From groundwork to running plant."
          intro="One partner. One accountable team."
        />

        <div className="relative mt-16 lg:mt-20">
          {/* The rule that makes the row read as a sequence. It sits behind the
              icons and stops short of the first and last, so the line never
              appears to run off the section. */}
          <div
            className="pointer-events-none absolute left-[8%] right-[8%] top-[27px] hidden border-t border-dashed border-hairline lg:block"
            aria-hidden="true"
          />

          <ol className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-4">
            {STEPS.map((step, i) => (
              <li key={step.key}>
                <Reveal delay={i * 0.07}>
                  <div className="flex flex-col items-center text-center">
                    <span className="relative grid h-14 w-14 place-items-center rounded-md border border-hairline bg-surface text-ink transition-colors duration-500 ease-brand">
                      <step.icon className="h-6 w-6" strokeWidth={1.35} aria-hidden="true" />
                    </span>

                    <h3 className="mt-5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-ink">
                      {step.label}
                    </h3>
                    <p className="mt-2 text-pretty text-[12.5px] leading-snug text-ink-faint">
                      {step.detail}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
