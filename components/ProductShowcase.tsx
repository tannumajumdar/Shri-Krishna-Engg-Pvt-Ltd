"use client";

import { ArrowUpRight } from "lucide-react";
import { ImageMarquee, type MarqueeItem } from "@/components/ImageMarquee";
import { MediaImage } from "@/components/ui/MediaImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { products, type Product } from "@/lib/site";

const items: MarqueeItem[] = products.map((p) => ({
  src: p.image,
  alt: p.name,
  href: "#contact",
}));

export function ProductShowcase() {
  return (
    <section
      id="products"
      className="on-dark relative overflow-hidden bg-navy-950 py-24 lg:py-32"
    >
      {/* engineering grid + soft top light */}
      <div className="absolute inset-0 bg-grid-fine bg-grid-fine opacity-[0.35]" aria-hidden="true" />
      <div
        className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(140,198,63,0.11),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative">
        <div className="container">
          <SectionHeading
            tone="dark"
            eyebrow="Products"
            title="A catalogue engineered around how our clients actually build."
            intro="From mill-finish extrusions to fully machined assemblies — every line is produced in-house, inspected against drawing and released with its own test record."
            action={
              <Button href="#contact" variant="outline" size="lg" withArrow>
                Request Full Catalogue
              </Button>
            }
          />
        </div>

        <ImageMarquee
          className="mt-16 lg:mt-20"
          items={items}
          speed={42}
          direction="left"
          heightClass="h-[420px] sm:h-[460px] lg:h-[500px]"
          gapClass="gap-4 lg:gap-6"
          renderItem={(_, i) => <ProductCard product={products[i]} />}
        />

        <div className="container mt-14">
          <Reveal>
            <p className="flex items-center justify-center gap-3 text-center text-[11px] uppercase tracking-label text-white/35">
              <span className="h-px w-10 bg-white/20" />
              Hover to pause · {products.length} product families
              <span className="h-px w-10 bg-white/20" />
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group/card flex h-full w-[280px] flex-col overflow-hidden rounded-xl border border-white/10 bg-navy-900 transition-colors duration-500 ease-brand hover:border-white/25 sm:w-[320px] lg:w-[360px]">
      <div className="relative flex-1 overflow-hidden">
        <MediaImage
          src={product.image}
          alt={product.name}
          className="h-full w-full"
          imgClassName="transition-transform duration-[1400ms] ease-brand group-hover/card:scale-[1.08]"
        />

        {/* overlay deepens on hover so the plate reads as one unit */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/25 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-navy-950/0 transition-colors duration-500 group-hover/card:bg-navy-950/25" />

        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-navy-950/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/75 backdrop-blur-sm">
          {product.spec}
        </span>
      </div>

      <div className="relative flex items-start justify-between gap-4 p-6">
        <div className="min-w-0">
          <h3 className="font-display text-[17px] font-medium leading-snug text-white">
            {product.name}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-white/50">
            {product.description}
          </p>
        </div>

        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition-all duration-500 ease-brand group-hover/card:border-white/40 group-hover/card:bg-white group-hover/card:text-navy-900">
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
