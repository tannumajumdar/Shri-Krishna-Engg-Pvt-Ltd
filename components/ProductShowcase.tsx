"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
import { slugify } from "@/lib/utils";

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
        {/* dissolve the footage into the flat ground the rows sit on */}
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

      {/* ---- categories with marquee & clickable left/right buttons ---- */}
      <div className="relative z-10">
        <div className="space-y-16 lg:space-y-24">
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
              Hover to pause marquee · Click left/right buttons to scroll · {cats.reduce((n, c) => n + c.products.length, 0)} total services
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scrolling marquee effect (pauses when user hovers or clicks buttons)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollLeft = 0;
        } else {
          scrollRef.current.scrollLeft += 1;
        }
      }
    }, 28);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleScroll = (direction: "left" | "right", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Pause auto-marquee temporarily so it doesn't interrupt smooth button scroll
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);

    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }

    // Resume marquee after 3.5 seconds of inactivity
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 3500);
  };

  // Triple the products array to ensure plenty of continuous scroll length
  const marqueeProducts = [
    ...category.products,
    ...category.products,
    ...category.products,
  ];

  return (
    <div id={`products-${category.id}`} className="scroll-mt-32">
      <div className="container">
        <Reveal>
          <div className="flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
            <div className="flex items-baseline gap-4 sm:gap-5">
              <span className="font-mono text-[11px] leading-none text-brand-400 font-bold">
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

            {/* Left & Right Interactive Clickable Buttons */}
            <div className="relative z-30 flex items-center gap-3 shrink-0 pointer-events-auto">
              <span className="mr-2 hidden font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 sm:inline-block">
                {category.products.length} services
              </span>

              <button
                type="button"
                onClick={(e) => handleScroll("left", e)}
                aria-label="Scroll Left"
                className="relative z-30 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-navy-900 text-white shadow-lift transition-all duration-300 hover:border-brand-400 hover:bg-brand-500 hover:text-navy-950 active:scale-90 cursor-pointer pointer-events-auto select-none"
              >
                <ChevronLeft className="h-5 w-5 pointer-events-none" strokeWidth={2.2} />
              </button>

              <button
                type="button"
                onClick={(e) => handleScroll("right", e)}
                aria-label="Scroll Right"
                className="relative z-30 grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-navy-900 text-white shadow-lift transition-all duration-300 hover:border-brand-400 hover:bg-brand-500 hover:text-navy-950 active:scale-90 cursor-pointer pointer-events-auto select-none"
              >
                <ChevronRight className="h-5 w-5 pointer-events-none" strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Marquee Track with Left & Right scroll interaction */}
      <div
        className="container relative mt-6 lg:mt-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 lg:gap-5"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {marqueeProducts.map((product, pIdx) => (
            <ProductCard
              key={`${product.name}-${pIdx}`}
              product={product}
              onEnquire={() => onEnquire(product)}
            />
          ))}
        </div>
      </div>
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
    <article className="group/card flex h-full w-[260px] shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-navy-900 transition-colors duration-500 ease-brand hover:border-brand-400/40 sm:w-[290px] lg:w-[320px]">
      <div className="relative aspect-[16/10] overflow-hidden">
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

        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-navy-950/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
          {product.spec}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col p-5">
        <h4 className="font-display text-[15.5px] font-medium leading-snug text-white">
          {product.name}
        </h4>
        <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-white/50">
          {product.description}
        </p>

        <div className="mt-auto pt-4 flex gap-2">
          {/* Read More → individual product page */}
          <a
            href={`/products/${slugify(product.name)}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 py-2.5 text-[13px] font-medium text-white/80 transition-all duration-300 ease-brand hover:border-brand-400/50 hover:text-brand-400"
          >
            Read More
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          </a>

          {/* Opens the enquiry form */}
          <button
            type="button"
            onClick={onEnquire}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2.5 text-[13px] font-semibold text-[#0C1936] transition-transform duration-300 ease-brand hover:scale-[1.02] hover:bg-[#20c65c] cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
            Enquire
          </button>
        </div>
      </div>
    </article>
  );
}
