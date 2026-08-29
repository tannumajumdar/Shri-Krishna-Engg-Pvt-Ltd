import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getProductCategories, getContact, getSocialLinks } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import Link from "next/link";
import { Metadata } from "next";
import { slugify } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Services | Shree Krishna Engineering Balco",
  description: "Explore our comprehensive engineering services including mechanical, fabrication, erection, civil works, and more.",
};

export const revalidate = 60;

export default async function ProductsPage() {
  const [categories, contact, socials] = await Promise.all([
    getProductCategories(),
    getContact(),
    getSocialLinks(),
  ]);

  return (
    <>
      <Navbar />
      <main className="on-dark min-h-screen bg-navy-950 pb-20 pt-32">
        <div className="container max-w-7xl">
          <Reveal>
            <p className="eyebrow text-white/50">Our Services</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-3xl font-display text-display-sm font-light text-white">
              Comprehensive <span className="text-brand-400">Engineering Solutions</span> for
              Heavy Industry
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60">
              Spanning mechanical works, heavy fabrication, structural erection, civil
              construction and plant operations — delivered with uncompromising quality
              since 2006.
            </p>
          </Reveal>

          <div className="mt-20 space-y-28">
            {categories.map((category) => (
              <section key={category.id} id={category.id} className="scroll-mt-32">
                <Reveal>
                  <SectionHeading
                    eyebrow={category.name}
                    title={category.blurb}
                    tone="dark"
                  />
                </Reveal>

                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {category.products.map((product, i) => {
                    const slug = slugify(product.name);
                    return (
                      <Reveal key={product.name} delay={i * 0.08}>
                        <Link
                          href={`/products/${slug}`}
                          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-navy-900 transition-all duration-500 hover:border-brand-500/40 hover:shadow-lift-lg"
                        >
                          <div className="relative aspect-video overflow-hidden">
                            <MediaImage
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full transition-transform duration-700 group-hover:scale-105"
                            />
                            {product.spec && (
                              <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-navy-950/80 px-3 py-1.5 font-mono text-xs text-brand-400 backdrop-blur-md">
                                {product.spec}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-1 flex-col p-6">
                            <h3 className="font-display text-lg font-medium text-white transition-colors duration-300 group-hover:text-brand-400">
                              {product.name}
                            </h3>
                            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">
                              {product.description}
                            </p>

                            <div className="mt-auto flex items-center gap-2 border-t border-white/5 pt-5 text-sm font-medium text-brand-400">
                              <span>Read More</span>
                              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                          </div>
                        </Link>
                      </Reveal>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer contact={contact} socials={socials} />
    </>
  );
}
