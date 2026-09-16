"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MediaImage } from "@/components/ui/MediaImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { facilities as staticFacilities, type Facility } from "@/lib/site";

/**
 * The four jobs the design puts forward, in order.
 *
 * Only the first carries a site name over its discipline; the rest are named
 * by the work itself, which is how the design reads them. Imagery comes from
 * the facility record by position.
 */
const FEATURED: { title: string; sub?: string }[] = [
  { title: "BALCO Rolled Products", sub: "Plant Operations & Maintenance" },
  { title: "Mechanical & Structural Execution" },
  { title: "Fabrication & Erection" },
  { title: "Industrial Maintenance" },
];

/**
 * Four jobs, shown large.
 *
 * Draws on the same facility photography the infrastructure gallery uses —
 * there is no separate projects record, and inventing one would mean an admin
 * screen nobody asked for. The caption carries the site, the label under it
 * the discipline.
 */
export function FeaturedProjects({ items }: { items?: readonly Facility[] } = {}) {
  const source = items?.length ? items : staticFacilities;
  const projects = source.slice(0, 4);
  const scrollRef = useRef<HTMLDivElement>(null);

  const step = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const tile = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * (tile ? tile.offsetWidth + 20 : 340), behavior: "smooth" });
  };

  return (
    <section id="projects" className="bg-surface-2 py-20 lg:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Work that speaks for itself."
          action={
            <div className="flex items-center gap-3">
              <Button href="/products" variant="ghost" size="sm" withArrow>
                View All Projects
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
          {projects.map((project, i) => (
            <Reveal key={project.src} delay={i * 0.07} className="shrink-0">
              <article className="group/proj relative w-[260px] overflow-hidden rounded-md sm:w-[300px]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <MediaImage
                    src={project.src}
                    alt={FEATURED[i % FEATURED.length].title}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-[1400ms] ease-brand group-hover/proj:scale-[1.07]"
                    sizes="320px"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-transparent"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-0 rounded-md ring-1 ring-inset ring-white/10"
                    aria-hidden="true"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="text-pretty font-display text-[14px] font-semibold uppercase leading-snug tracking-tight text-white">
                      {FEATURED[i % FEATURED.length].title}
                    </h3>
                    {FEATURED[i % FEATURED.length].sub && (
                      <p className="mt-1.5 text-[11.5px] leading-snug text-white/55">
                        {FEATURED[i % FEATURED.length].sub}
                      </p>
                    )}
                    <span
                      className="mt-3 block h-[2px] w-0 bg-accent-400 transition-all duration-700 ease-brand group-hover/proj:w-10"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
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
