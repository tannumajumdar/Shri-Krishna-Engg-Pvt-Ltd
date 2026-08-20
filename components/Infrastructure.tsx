"use client";

import { ImageMarquee, type MarqueeItem } from "@/components/ImageMarquee";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { facilities } from "@/lib/site";

const toItems = (list: typeof facilities): MarqueeItem[] =>
  list.map((f) => ({
    src: f.src,
    alt: f.caption,
    caption: f.caption,
    ratio: f.ratio,
    href: "#contact",
  }));

/* Both rows carry the full set — rotating the second keeps the same tile from
   sitting directly above itself, and a long set keeps the loop period wider
   than any viewport. */
const topRow = toItems(facilities);
const bottomRow = toItems([...facilities.slice(5), ...facilities.slice(0, 5)]);

export function Infrastructure() {
  return (
    <section
      id="infrastructure"
      className="on-dark relative overflow-hidden bg-navy-900 py-24 lg:py-32"
    >
      <div
        className="absolute inset-0 bg-grid-fine bg-grid-fine opacity-25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(70%_100%_at_50%_100%,rgba(140,198,63,0.10),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative">
        <div className="container">
          <SectionHeading
            tone="dark"
            eyebrow="Our Infrastructure"
            title="A plant laid out so metal never waits on a machine."
            intro="Presses, furnaces, machining cells, finishing lines and the metrology lab sit on one continuous flow — which is why our lead times hold."
            action={
              <Button href="#contact" variant="outline" size="lg" withArrow>
                Arrange a Plant Visit
              </Button>
            }
          />
        </div>

        {/* Opposing directions and unequal row heights give the gallery its
            drift — it never reads as a single sliding strip. */}
        <div className="mt-16 space-y-4 lg:mt-20 lg:space-y-6">
          <ImageMarquee
            items={topRow}
            direction="left"
            speed={38}
            heightClass="h-[190px] sm:h-[240px] lg:h-[300px]"
          />
          <ImageMarquee
            items={bottomRow}
            direction="right"
            speed={30}
            heightClass="h-[150px] sm:h-[190px] lg:h-[240px]"
          />
        </div>

        <div className="container mt-14">
          <Reveal>
            <p className="flex items-center justify-center gap-3 text-center text-[11px] uppercase tracking-label text-white/35">
              <span className="h-px w-10 bg-white/20" />
              Hover to pause
              <span className="h-px w-10 bg-white/20" />
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
