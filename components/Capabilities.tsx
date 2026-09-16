"use client";

import { useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { MediaImage } from "@/components/ui/MediaImage";
import { Reveal } from "@/components/ui/Reveal";
import { productCategories as staticCategories, type ProductCategory } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The six things the company actually does, as one row of numbered plates.
 *
 * Numbering is not decoration here: the six are a fixed, named set that the
 * navbar, the footer and the services page all refer to, so a reader can carry
 * "04" from one place to another. Each plate links to that group's services.
 *
 * The row scrolls horizontally rather than wrapping — six equal plates on one
 * line is the shape of the set, and wrapping to 3×2 would imply a grouping
 * that does not exist.
 */
export function Capabilities({
  categories,
}: {
  categories?: ProductCategory[];
} = {}) {
  const cats = (categories?.length ? categories : staticCategories).slice(0, 6);
  const scrollRef = useRef<HTMLDivElement>(null);

  const step = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    // One plate plus its gap, so a click always lands on a card edge.
    const plate = el.firstElementChild as HTMLElement | null;
    const amount = plate ? plate.offsetWidth + 20 : 300;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section
      id="capabilities"
      className="on-dark relative overflow-hidden bg-navy-950 py-20 lg:py-28"
    >
      <div className="absolute inset-0 bg-grid-fine opacity-[0.35]" aria-hidden="true" />

      <div className="container relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <Reveal className="max-w-2xl">
            <span className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-accent-400">
              <span className="h-px w-10 bg-accent-400" />
              Our Capabilities
            </span>
            <h2 className="font-display text-display-sm font-semibold uppercase leading-[1.05] tracking-tight text-white">
              One engineering partner.
              <br />
              Six core capabilities.
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="lg:max-w-xs lg:pb-2">
            <p className="text-[13.5px] leading-relaxed text-white/55">
              From fabrication to plant operations, we deliver end-to-end solutions
              for critical industrial projects.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <StepButton label="Scroll left" onClick={() => step(-1)}>
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              </StepButton>
              <StepButton label="Scroll right" onClick={() => step(1)}>
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </StepButton>
            </div>
          </Reveal>
        </div>

        <div
          ref={scrollRef}
          className="mt-14 flex gap-5 overflow-x-auto overscroll-x-contain pb-2 lg:mt-16"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {cats.map((cat, i) => (
            <CapabilityPlate key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilityPlate({ category, index }: { category: ProductCategory; index: number }) {
  const [hovered, setHovered] = useState(false);
  const cover = category.products[0]?.image ?? "/media/products-poster.jpg";

  return (
    <Reveal delay={index * 0.06} className="shrink-0">
      <a
        href={`/products#${category.id}`}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        className={cn(
          "group/plate relative flex w-[220px] flex-col overflow-hidden rounded-md",
          "border border-white/10 bg-navy-900 transition-colors duration-500 ease-brand",
          "hover:border-accent-400/50 sm:w-[240px]",
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <MediaImage
            src={cover}
            alt={category.name}
            className="h-full w-full"
            imgClassName="transition-transform duration-[1400ms] ease-brand group-hover/plate:scale-[1.08]"
            sizes="240px"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent"
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <span className="font-mono text-[12px] font-semibold leading-none text-accent-400">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-2.5 text-pretty font-display text-[14px] font-medium leading-snug text-white">
            {category.name}
          </h3>

          <ArrowRight
            className={cn(
              "mt-4 h-4 w-4 text-accent-400 transition-transform duration-500 ease-brand",
              hovered && "translate-x-1",
            )}
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
      </a>
    </Reveal>
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
      className="grid h-9 w-9 place-items-center rounded-md border border-white/25 text-white/75 transition-colors duration-300 ease-brand hover:border-accent-400 hover:bg-accent-400 hover:text-navy-950"
    >
      {children}
    </button>
  );
}
