"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { ImageMarquee, type MarqueeItem } from "@/components/ImageMarquee";
import { VideoBackground } from "@/components/VideoBackground";
import { ServiceEnquiryModal } from "@/components/ServiceEnquiryModal";
import { MediaImage } from "@/components/ui/MediaImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import {
  contact,
  media,
  productCategories,
  type Product,
  type ProductCategory,
} from "@/lib/site";

/** The service a visitor is enquiring about, carried up to the modal. */
type Enquiring = { product: Product; categoryName: string };

export function ProductShowcase({
  categories,
  video,
  whatsapp,
}: {
  categories?: typeof productCategories;
  video?: { src: string; poster: string };
  /** WhatsApp number (digits, with country code) for product enquiries. */
  whatsapp?: string;
} = {}) {
  const cats = categories ?? productCategories;
  const waNumber = whatsapp || contact.whatsapp;

  // Lifted here so the modal overlays the whole section, not a scrolling card.
  const [enquiring, setEnquiring] = useState<Enquiring | null>(null);
  return (
    <section
      id="products"
      className="on-dark relative overflow-hidden bg-navy-950 pb-24 lg:pb-32"
    >
      {/* engineering grid, carried under the rows */}
      <div className="absolute inset-0 bg-grid-fine bg-grid-fine opacity-[0.35]" aria-hidden="true" />

      {/* ---- header band, set over the service footage ---- */}
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
            eyebrow={`Services · ${cats.length} verticals`}
            title="Engineering services that keep heavy plants running."
            intro="From mechanical maintenance and fabrication to civil works, erection and round-the-clock plant O&M — delivered by our own trained crews."
            action={
              <Button href="#contact" variant="outline" size="lg" withArrow>
                Request a Quote
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
            <CategoryRow
              key={category.id}
              category={category}
              index={i}
              onEnquire={(product) =>
                setEnquiring({ product, categoryName: category.name })
              }
            />
          ))}
        </div>

        <div className="container mt-16">
          <Reveal>
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-[11px] uppercase tracking-label text-white/35">
              <span className="h-px w-10 bg-white/20" />
              Hover to pause · {cats.reduce((n, c) => n + c.products.length, 0)} services
              <span className="h-px w-10 bg-white/20" />
            </p>
          </Reveal>
        </div>
      </div>

      {/* Enquiry form — opens on "Enquire", saves the lead only on submit. */}
      {enquiring && (
        <ServiceEnquiryModal
          product={enquiring.product}
          categoryName={enquiring.categoryName}
          whatsapp={waNumber}
          onClose={() => setEnquiring(null)}
        />
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function CategoryRow({
  category,
  index,
  onEnquire,
}: {
  category: ProductCategory;
  index: number;
  onEnquire: (product: Product) => void;
}) {
  const items: MarqueeItem[] = category.products.map((p) => ({
    src: p.image,
    alt: p.name,
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
              {category.products.length} services
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
        renderItem={(_, i) => (
          <ProductCard
            product={category.products[i]}
            onEnquire={() => onEnquire(category.products[i])}
          />
        )}
      />
    </div>
  );
}

function ProductCard({
  product,
  onEnquire,
}: {
  product: Product;
  /** Opens the enquiry form for this service. No lead is created on click. */
  onEnquire: () => void;
}) {
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

      <div className="relative p-5">
        <h4 className="font-display text-[15.5px] font-medium leading-snug text-white">
          {product.name}
        </h4>
        <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-white/50">
          {product.description}
        </p>

        {/* Opens the enquiry form. The lead is created only when the visitor
            submits it — an accidental tap here costs nothing. */}
        <button
          type="button"
          onClick={onEnquire}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2.5 text-[13px] font-semibold text-[#0C1936] transition-transform duration-300 ease-brand hover:scale-[1.02] hover:bg-[#20c65c]"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
          Enquire on WhatsApp
        </button>
      </div>
    </article>
  );
}
