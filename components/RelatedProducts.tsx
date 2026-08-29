import Link from "next/link";
import { MediaImage } from "@/components/ui/MediaImage";
import { Reveal } from "@/components/ui/Reveal";
import { Product } from "@/lib/site";
import { slugify } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function RelatedProducts({
  products,
  currentSlug,
}: {
  products: Product[];
  currentSlug: string;
}) {
  const related = products
    .filter((p) => slugify(p.name) !== currentSlug)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-white/5 bg-navy-900/40 py-16">
      <div className="container max-w-6xl">
        <Reveal>
          <p className="eyebrow text-white/40">More Services</p>
          <h2 className="mt-4 font-display text-display-sm font-light text-white">
            Related Services
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((product, i) => {
            const slug = slugify(product.name);
            return (
              <Reveal key={product.name} delay={i * 0.08}>
                <Link
                  href={`/products/${slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-navy-900 transition-all duration-500 hover:border-brand-500/50 hover:shadow-lift"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <MediaImage
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.spec && (
                      <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-navy-950/80 px-3 py-1 font-mono text-xs text-brand-400 backdrop-blur-sm">
                        {product.spec}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-brand-400">
                      {product.name}
                    </h3>
                    <div className="mt-auto flex items-center gap-1 pt-4 text-sm font-medium text-brand-400">
                      <span>Read More</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
