import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { CTA } from "@/components/CTA";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { company, media } from "@/lib/site";
import { slugify } from "@/lib/utils";
import {
  getContact,
  getProductCategories,
  getSectionImages,
  getSocialLinks,
} from "@/lib/content";

export const metadata: Metadata = {
  title: `Our Services — ${company.legalName}`,
  description:
    "Mechanical works, heavy fabrication, structural erection, civil construction, transportation and plant operations & maintenance — delivered with our own workforce since 2006.",
};

export const revalidate = 60;

export default async function ServicesPage() {
  const [categories, ctaImage, contact, socials] = await Promise.all([
    getProductCategories(),
    getSectionImages("CTA", [media.ctaPoster]),
    getContact(),
    getSocialLinks(),
  ]);

  const serviceCount = categories.reduce((n, c) => n + c.products.length, 0);

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero
          eyebrow="Our Services"
          title="Comprehensive engineering"
          accent="for heavy industry."
          intro={`Spanning mechanical works, heavy fabrication, structural erection, civil construction and plant operations — delivered with uncompromising quality since ${company.established}.`}
          image={media.productsPoster}
          facts={[
            { label: "Capabilities", value: String(categories.length) },
            { label: "Services", value: String(serviceCount) },
            { label: "Since", value: String(company.established) },
          ]}
        />

        {/* Each capability gets its own band, alternating light and dark so a
            reader scrolling the full list can tell where one ends and the next
            begins without counting headings. */}
        {categories.map((category, index) => {
          const dark = index % 2 === 1;
          return (
            <section
              key={category.id}
              id={category.id}
              className={`${dark ? "on-dark bg-navy-950" : "bg-surface"} scroll-mt-24 py-20 lg:py-28`}
            >
              <div className="container">
                <SectionHeading
                  eyebrow={`0${index + 1} · ${category.name}`}
                  title={category.blurb}
                  tone={dark ? "dark" : "light"}
                />

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
                  {category.products.map((product, i) => (
                    <Reveal key={product.name} delay={(i % 3) * 0.06}>
                      <Link
                        href={`/services/${slugify(product.name)}`}
                        className={`group/svc flex h-full flex-col overflow-hidden rounded-md border transition-colors duration-500 ease-brand ${
                          dark
                            ? "border-white/10 bg-navy-900 hover:border-accent-400/50"
                            : "border-hairline bg-surface-2 hover:border-accent-500/60"
                        }`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <MediaImage
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full"
                            imgClassName="transition-transform duration-[1400ms] ease-brand group-hover/svc:scale-[1.07]"
                            sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                          />
                          <div
                            className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent"
                            aria-hidden="true"
                          />
                          {product.spec && (
                            <span className="absolute left-4 top-4 rounded-md border border-white/15 bg-navy-950/80 px-2.5 py-1 font-mono text-[11px] text-accent-400 backdrop-blur-sm">
                              {product.spec}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <h3
                            className={`text-pretty font-display text-[17px] font-medium leading-snug ${
                              dark ? "text-white" : "text-ink"
                            }`}
                          >
                            {product.name}
                          </h3>
                          <p
                            className={`mt-3 line-clamp-3 text-[13.5px] leading-relaxed ${
                              dark ? "text-white/60" : "text-ink-muted"
                            }`}
                          >
                            {product.description}
                          </p>

                          <span
                            className={`mt-auto flex items-center gap-2 border-t pt-5 text-[12px] font-semibold uppercase tracking-label ${
                              dark
                                ? "border-white/10 text-accent-400"
                                : "border-hairline text-accent-600"
                            }`}
                          >
                            Read More
                            <ArrowRight
                              className="h-[18px] w-[18px] transition-transform duration-500 ease-brand group-hover/svc:translate-x-1"
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        <CTA image={ctaImage[0]} />
      </main>

      <Footer contact={contact} socials={socials} />
      <WhatsAppFloat />
    </>
  );
}
