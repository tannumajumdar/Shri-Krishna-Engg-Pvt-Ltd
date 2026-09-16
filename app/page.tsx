import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { About } from "@/components/About";
import { Capabilities } from "@/components/Capabilities";
import { ExecutionProcess } from "@/components/ExecutionProcess";
import { Industries } from "@/components/Industries";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { Infrastructure } from "@/components/Infrastructure";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { media as staticMedia } from "@/lib/site";
import {
  getSectionImages,
  getProductCategories,
  getIndustries,
  getInfrastructure,
  getStatistics,
  getFeatures,
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
    heroSlides,
    ctaImage,
    productCategories,
    industries,
    infrastructure,
    statistics,
    features,
    contact,
    socials,
  ] = await Promise.all([
    getSectionImages("HERO", staticMedia.heroSlides),
    getSectionImages("CTA", [staticMedia.ctaPoster]),
    getProductCategories(),
    getIndustries(),
    getInfrastructure(),
    getStatistics(),
    getFeatures(),
    getContact(),
    getSocialLinks(),
  ]);

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero slides={heroSlides} />
        <StatsBar items={statistics} />
        <About stats={statistics} />
        <Capabilities categories={productCategories} />
        <ExecutionProcess />
        <Industries items={industries} />
        <FeaturedProjects items={infrastructure} />
        <Infrastructure items={infrastructure} />
        <WhyChooseUs items={features} />
        <CTA image={ctaImage[0]} />
      </main>
      <Footer contact={contact} socials={socials} />
      <WhatsAppFloat />
    </>
  );
}
