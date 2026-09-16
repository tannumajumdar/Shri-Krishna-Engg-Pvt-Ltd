"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MediaImage } from "@/components/ui/MediaImage";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { company, media } from "@/lib/site";
import { parallaxRange, useParallaxEnabled } from "@/lib/use-parallax";

/** The three facts that place the company, shown under the portrait. */
const MARKERS = [
  { value: String(company.established), label: "Established" },
  { value: "Korba", label: "Chhattisgarh" },
  { value: "India", label: "Operations" },
];

export function About({
  /** Kept so the page can pass DB statistics; the figures now live in the
   *  stats bar directly above this section. */
  stats,
}: {
  stats?: { value: number; suffix: string; label: string; detail?: string }[];
} = {}) {
  void stats;

  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const parallax = useParallaxEnabled();
  const imgY = useTransform(scrollYProgress, [0, 1], parallaxRange(parallax, ["-7%", "7%"], "0%"));

  return (
    <section id="about" className="bg-surface-2 py-20 lg:py-28">
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* ------------------------------- copy ------------------------- */}
          <div className="lg:col-span-6 xl:col-span-7">
            <Reveal>
              <span className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-ink-faint">
                <span className="h-px w-10 bg-accent-500" />
                About {company.name}
              </span>
              <h2 className="max-w-xl font-display text-display-sm font-semibold uppercase leading-[1.05] tracking-tight text-ink">
                Engineering experience built on the shop floor.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 max-w-xl space-y-5 text-[14px] leading-relaxed text-ink-muted">
                <p>
                  Established in {company.established} in the BALCO industrial belt at Korba,
                  {" "}{company.name} has grown into a dependable engineering and
                  plant-services partner for aluminium and heavy-industry operations.
                </p>
                <p>
                  Our capabilities extend across mechanical engineering, structural
                  fabrication, equipment erection, civil works, transportation and plant
                  operations &amp; maintenance.
                </p>
                <p>
                  With our own trained workforce, fabrication capability and transportation
                  resources, we provide single-point responsibility from foundation to
                  commissioning — and beyond.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9">
                <Button href="#capabilities" variant="solid" size="md" withArrow>
                  Discover Our Story
                </Button>
              </div>
            </Reveal>
          </div>

          {/* ------------------------- portrait + quote ------------------- */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div className="grid gap-6 sm:grid-cols-2 lg:gap-5">
              <Reveal delay={0.12}>
                <div
                  ref={imageRef}
                  className="relative aspect-[3/4] overflow-hidden rounded-md"
                >
                  <motion.div style={{ y: imgY }} className="absolute -inset-y-[8%] inset-x-0">
                    <MediaImage
                      src={media.about}
                      alt={`${company.name} — structural erection at BALCO, Korba`}
                      className="h-full w-full"
                      sizes="(min-width: 1024px) 24rem, 100vw"
                    />
                  </motion.div>
                  <div
                    className="absolute inset-0 rounded-md ring-1 ring-inset ring-ink/10"
                    aria-hidden="true"
                  />
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <figure className="flex h-full flex-col justify-between rounded-md border border-hairline bg-surface p-6">
                  <blockquote className="text-pretty font-display text-[15px] font-medium leading-snug text-ink">
                    <span className="mb-3 block text-2xl leading-none text-accent-500" aria-hidden="true">
                      &ldquo;
                    </span>
                    Delivering engineering solutions that create lasting value for industry.
                  </blockquote>

                  <figcaption className="mt-8">
                    <span
                      className="mb-3 block h-px w-10 bg-accent-500"
                      aria-hidden="true"
                    />
                    <span className="block font-display text-[12.5px] font-semibold text-ink">
                      Managing Director
                    </span>
                    <span className="mt-0.5 block text-[11.5px] text-ink-faint">
                      {company.name}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </div>

            {/* the three placing facts */}
            <Reveal delay={0.26}>
              <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden border-y border-hairline bg-hairline">
                {MARKERS.map((marker) => (
                  <div key={marker.label} className="bg-surface-2 px-4 py-5">
                    <dt className="sr-only">{marker.label}</dt>
                    <dd className="font-display text-[17px] font-semibold leading-none tracking-tight text-ink">
                      {marker.value}
                    </dd>
                    <p className="mt-1.5 text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                      {marker.label}
                    </p>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
