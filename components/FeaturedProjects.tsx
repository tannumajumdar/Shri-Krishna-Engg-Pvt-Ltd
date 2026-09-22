"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MediaImage } from "@/components/ui/MediaImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { facilities as staticFacilities, type Facility } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The four jobs the design puts forward on the landing page, in order.
 *
 * Named for what the photographs actually show — these are real sites, and a
 * caption that does not match the frame under it reads as stock. Imagery comes
 * from the facility record by position. Beyond these four the record's own
 * caption is used, because inventing project names for every frame would be
 * making claims the photographs do not support.
 */
const FEATURED: { title: string; sub: string }[] = [
  { title: "Tank & Hopper Fabrication", sub: "Fabrication" },
  { title: "Silo Erection", sub: "Erection & Commissioning" },
  { title: "EOT Crane Maintenance", sub: "Mechanical Works" },
  { title: "Control Room Handover", sub: "Civil Works & Interiors" },
];

/**
 * Jobs, shown large.
 *
 * Draws on the same facility photography the infrastructure gallery uses —
 * there is no separate projects record, and inventing one would mean an admin
 * screen nobody asked for.
 */
export function FeaturedProjects({
  items,
  /**
   * "rail" is the landing-page teaser: four jobs on one scrolling line, linking
   * on to the full page. "grid" is /projects, where the PageHero carries the
   * title and every frame should be reachable without scrolling sideways.
   */
  variant = "rail",
}: {
  items?: readonly Facility[];
  variant?: "rail" | "grid";
} = {}) {
  const source = items?.length ? items : staticFacilities;
  const scrollRef = useRef<HTMLDivElement>(null);

  const step = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const tile = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * (tile ? tile.offsetWidth + 20 : 340), behavior: "smooth" });
  };

  if (variant === "grid") {
    return (
      <section id="projects" className="bg-surface-2 py-20 lg:py-28">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {source.map((project, i) => (
              <Reveal key={project.src} delay={(i % 3) * 0.06}>
                <ProjectTile
                  src={project.src}
                  title={FEATURED[i]?.title ?? project.caption}
                  sub={FEATURED[i]?.sub ?? "BALCO, Korba"}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const projects = source.slice(0, 4);

  return (
    <section id="projects" className="bg-surface-2 py-20 lg:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Work that speaks for itself."
          action={
            <div className="flex items-center gap-3">
              <Button href="/projects" variant="ghost" size="sm" withArrow>
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
              <ProjectTile
                src={project.src}
                title={FEATURED[i].title}
                sub={FEATURED[i].sub}
                className="w-[260px] sm:w-[300px]"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectTile({
  src,
  title,
  sub,
  className,
}: {
  src: string;
  title: string;
  sub: string;
  className?: string;
}) {
  return (
    <article className={cn("group/proj relative overflow-hidden rounded-md", className)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <MediaImage
          src={src}
          alt={title}
          className="h-full w-full"
          imgClassName="transition-transform duration-[1400ms] ease-brand group-hover/proj:scale-[1.07]"
          sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
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
            {title}
          </h3>
          <p className="mt-1.5 text-[11.5px] leading-snug text-white/55">{sub}</p>
          <span
            className="mt-3 block h-[2px] w-0 bg-accent-400 transition-all duration-700 ease-brand group-hover/proj:w-10"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
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
