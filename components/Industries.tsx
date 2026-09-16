"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MediaImage } from "@/components/ui/MediaImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { industries as staticIndustries, type Industry } from "@/lib/site";

/**
 * The sectors the company works in, as a row of numbered plates.
 *
 * The record stores short internal names ("Power", "Automotive") in whatever
 * order the admin happens to have sorted them. The design fixes both the
 * labels a visitor reads and the order they run in, so that mapping lives
 * here rather than being written back into a database the products API also
 * reads. Anything not in this list falls in afterwards, under its own name.
 */
const SECTOR_ORDER: { key: string; label: string }[] = [
  { key: "Electrical", label: "Aluminium & Metals" },
  { key: "Construction", label: "Steel & Heavy Engineering" },
  { key: "Manufacturing", label: "Manufacturing" },
  { key: "Power", label: "Power & Energy" },
  { key: "Automotive", label: "Mining & Minerals" },
  { key: "Infrastructure", label: "Industrial Infrastructure" },
];

/** Re-orders and re-labels the records to the design's sequence. */
function toDesignOrder(records: Industry[]) {
  const byName = new Map(records.map((r) => [r.name, r]));
  const ordered = SECTOR_ORDER.flatMap(({ key, label }) => {
    const record = byName.get(key);
    if (!record) return [];
    byName.delete(key);
    return [{ record, label }];
  });
  // Anything the design does not name still gets shown, after the six.
  for (const record of byName.values()) ordered.push({ record, label: record.name });
  return ordered;
}

export function Industries({ items }: { items?: Industry[] } = {}) {
  const industries = toDesignOrder(items?.length ? items : staticIndustries).slice(0, 6);
  const scrollRef = useRef<HTMLDivElement>(null);

  const step = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const tile = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * (tile ? tile.offsetWidth + 20 : 260), behavior: "smooth" });
  };

  return (
    <section id="industries" className="bg-surface py-20 lg:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Industries We Serve"
          title="Engineering for critical industries."
          intro="We support India's key industrial sectors with reliable engineering, fabrication and plant services."
          action={
            <div className="flex items-center gap-3">
              <Button href="#capabilities" variant="ghost" size="sm" withArrow>
                View All Industries
              </Button>
              <div className="flex items-center gap-2">
                <StepButton label="Scroll left" onClick={() => step(-1)}>
                  <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                </StepButton>
                <StepButton label="Scroll right" onClick={() => step(1)}>
                  <ChevronRight className="h-4 w-4" strokeWidth={2} />
                </StepButton>
              </div>
            </div>
          }
        />

        <div
          ref={scrollRef}
          className="mt-14 flex gap-5 overflow-x-auto overscroll-x-contain pb-2 lg:mt-16"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {industries.map(({ record: industry, label }, i) => {
            return (
              <Reveal key={industry.name} delay={i * 0.06} className="shrink-0">
                <article className="group/ind relative w-[190px] overflow-hidden rounded-md sm:w-[210px]">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <MediaImage
                      src={industry.image}
                      alt={label}
                      className="h-full w-full"
                      imgClassName="transition-transform duration-[1400ms] ease-brand group-hover/ind:scale-[1.08]"
                      sizes="210px"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-transparent"
                      aria-hidden="true"
                    />
                    <div
                      className="absolute inset-0 rounded-md ring-1 ring-inset ring-white/10"
                      aria-hidden="true"
                    />

                    <span className="absolute left-4 top-4 font-mono text-[12px] font-semibold leading-none text-accent-400">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 flex items-end gap-2 p-4">
                      <h3 className="text-pretty font-display text-[13.5px] font-medium leading-snug text-white">
                        {label}
                      </h3>
                      <span
                        className="mb-1 h-[2px] w-0 shrink-0 bg-accent-400 transition-all duration-700 ease-brand group-hover/ind:w-5"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StepButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-md border border-hairline text-ink-faint transition-colors duration-300 ease-brand hover:border-accent-500 hover:bg-accent-500 hover:text-white"
    >
      {children}
    </button>
  );
}
