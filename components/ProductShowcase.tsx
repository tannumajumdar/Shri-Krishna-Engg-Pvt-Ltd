"use client";

import { ArrowUpRight } from "lucide-react";
import { ImageMarquee, type MarqueeItem } from "@/components/ImageMarquee";
import { VideoBackground } from "@/components/VideoBackground";
import { MediaImage } from "@/components/ui/MediaImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import {
  media,
  productCategories,
  type Product,
  type ProductCategory,
} from "@/lib/site";

export function ProductShowcase({
  categories,
  video,
}: {
  categories?: typeof productCategories;
  video?: { src: string; poster: string };
} = {}) {
  const cats = categories ?? productCategories;
  return (
    <section
      id="products"
      className="on-dark relative overflow-hidden bg-navy-950 pb-24 lg:pb-32"
    >
      {/* engineering grid, carried under the rows */}
      <div className="absolute inset-0 bg-grid-fine bg-grid-fine opacity-[0.35]" aria-hidden="true" />

      {/* ---- header band, set over the extrusion line ---- */}
      <div className="relative">
        <VideoBackground
          src={video?.src ?? media.productsVideo}
          poster={video?.poster ?? media.productsPoster}
          overlayOpacity={0.74}
          objectPosition="object-[50%_45%]"
          grid
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(140,198,63,0.12),transparent_70%)]"
          aria-hidden="true"
        />
        {/* dissolve the footage into the flat ground the rows sit on — the
            band has no hard bottom edge */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-navy-950"
          aria-hidden="true"
        />

        <div className="container relative pb-20 pt-24 lg:pb-28 lg:pt-32">
          <SectionHeading
            tone="dark"
            eyebrow={`Products · ${cats.length} categories`}
            title="A catalogue engineered around how our clients actually build."
            intro="From mill-finish extrusions to fully machined assemblies — every line is produced in-house, inspected against drawing and released with its own test record."
            action={
              <Button href="#contact" variant="outline" size="lg" withArrow>
                Request Full Catalogue
              </Button>
            }
          />
        </div>
      </div>

      {/* ---- one row per process, directions alternating so the section
              drifts rather than sliding as a single block ---- */}
      <div className="relative">
        <div className="space-y-14 lg:space-y-20">
          {cats.map((category, i) => (
            <CategoryRow key={category.id} category={category} index={i} />
          ))}
        </div>

        <div className="container mt-16">
          <Reveal>
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-[11px] uppercase tracking-label text-white/35">
              <span className="h-px w-10 bg-white/20" />
              Hover to pause · {cats.reduce((n, c) => n + c.products.length, 0)} product lines
              <span className="h-px w-10 bg-white/20" />
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function CategoryRow({
  category,
  index,
}: {
  category: ProductCategory;
  index: number;
}) {
  const items: MarqueeItem[] = category.products.map((p) => ({
    src: p.image,
    alt: p.name,
    href: "#contact",
  }));

  return (
    <div id={`products-${category.id}`} className="scroll-mt-32">
      <div className="container">
        <Reveal>
          <div className="flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
            <div className="flex items-baseline gap-4 sm:gap-5">
              <span className="font-mono text-[11px] leading-none text-accent-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-xl font-medium leading-tight text-white sm:text-2xl">
                  {category.name}
                </h3>
                <p className="mt-2.5 max-w-xl text-[13.5px] leading-relaxed text-white/50">
                  {category.blurb}
                </p>
              </div>
            </div>

            <span className="shrink-0 whitespace-nowrap pl-9 font-mono text-[10px] uppercase tracking-[0.16em] text-white/30 sm:pl-0">
              {category.products.length} lines
            </span>
          </div>
        </Reveal>
      </div>

      <ImageMarquee
        className="mt-7 lg:mt-9"
        items={items}
        speed={index % 2 === 0 ? 40 : 34}
        direction={index % 2 === 0 ? "left" : "right"}
        heightClass="h-[340px] sm:h-[380px] lg:h-[420px]"
        gapClass="gap-4 lg:gap-5"
        renderItem={(_, i) => <ProductCard product={category.products[i]} />}
      />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group/card flex h-full w-[248px] flex-col overflow-hidden rounded-xl border border-white/10 bg-navy-900 transition-colors duration-500 ease-brand hover:border-white/25 sm:w-[286px] lg:w-[320px]">
      <div className="relative flex-1 overflow-hidden">
        <MediaImage
          src={product.image}
          alt={product.name}
          className="h-full w-full"
          imgClassName="transition-transform duration-[1400ms] ease-brand group-hover/card:scale-[1.08]"
          sizes="320px"
        />

        {/* overlay deepens on hover so the plate reads as one unit */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/25 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-navy-950/0 transition-colors duration-500 group-hover/card:bg-navy-950/25" />

        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-navy-950/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/75 backdrop-blur-sm">
          {product.spec}
        </span>
      </div>

      <div className="relative flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <h4 className="font-display text-[15.5px] font-medium leading-snug text-white">
            {product.name}
          </h4>
          <p className="mt-2 text-[12.5px] leading-relaxed text-white/50">
            {product.description}
          </p>
        </div>

        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition-all duration-500 ease-brand group-hover/card:border-white/40 group-hover/card:bg-white group-hover/card:text-navy-900">
          <ArrowUpRight className="h-[15px] w-[15px]" strokeWidth={1.75} aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
