import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ProductShowcase } from "@/components/ProductShowcase";
import { IndustrialShowcase } from "@/components/IndustrialShowcase";
import { Industries } from "@/components/Industries";
import { Infrastructure } from "@/components/Infrastructure";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { QualitySection } from "@/components/QualitySection";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { media as staticMedia } from "@/lib/site";
import {
  getSectionVideo,
  getProductCategories,
  getIndustries,
  getInfrastructure,
  getStatistics,
  getFeatures,
  getQualityPoints,
  getContact,
  getSocialLinks,
} from "@/lib/content";

/**
 * The landing page is a server component. It pulls every dynamic block from the
 * DB (via lib/content, which falls back to the static content in lib/site if
 * the DB is empty or unreachable) and passes each down to the matching section.
 * Editing content in /admin therefore changes the page with no code edits.
 *
 * Revalidated periodically so admin edits appear without a redeploy, while
 * still serving cached HTML to visitors.
 */
export const revalidate = 60;

export default async function Page() {
  const [
    heroVideo,
    productsVideo,
    qualityVideo,
    ctaVideo,
    productCategories,
    industries,
    infrastructure,
    statistics,
    features,
    qualityPoints,
    contact,
    socials,
  ] = await Promise.all([
    getSectionVideo("HERO", { src: staticMedia.heroVideo, poster: staticMedia.heroPoster }),
    getSectionVideo("PRODUCTS", { src: staticMedia.productsVideo, poster: staticMedia.productsPoster }),
    getSectionVideo("QUALITY", { src: staticMedia.qualityVideo, poster: staticMedia.qualityPoster }),
    getSectionVideo("CTA", { src: staticMedia.ctaVideo, poster: staticMedia.ctaPoster }),
    getProductCategories(),
    getIndustries(),
    getInfrastructure(),
    getStatistics(),
    getFeatures(),
    getQualityPoints(),
    getContact(),
    getSocialLinks(),
  ]);

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero video={heroVideo} />
        <About stats={statistics} />
        <ProductShowcase categories={productCategories} video={productsVideo} />
        <IndustrialShowcase />
        <Industries items={industries} />
        <Infrastructure items={infrastructure} />
        <WhyChooseUs items={features} />
        <QualitySection points={qualityPoints} video={qualityVideo} />
        <CTA video={ctaVideo} />
      </main>
      <Footer contact={contact} socials={socials} />
    </>
  );
}
