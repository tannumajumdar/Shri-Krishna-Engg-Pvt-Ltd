import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { About } from "@/components/About";
import { Capabilities } from "@/components/Capabilities";
import { Industries } from "@/components/Industries";
import { FeaturedProjects } from "@/components/FeaturedProjects";
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
    ctaImage,
    productCategories,
    industries,
    infrastructure,
    statistics,
    contact,
    socials,
  ] = await Promise.all([
    getSectionImages("CTA", [staticMedia.ctaPoster]),
    getProductCategories(),
    getIndustries(),
    getInfrastructure(),
    getStatistics(),
    getContact(),
    getSocialLinks(),
  ]);

  return (
    <>
      <Navbar />
      {/* A landing page, not the whole site on one scroll. Each block is a
          teaser that hands off to the page carrying the full story: About to
          /about, Capabilities to /services, Industries to /industries and
          Projects to /projects. Execution Process and Why Krishna moved to
          /about; the infrastructure gallery moved to /projects, where it had
          been showing the same records as Featured Projects directly above
          it. */}
      <main id="main">
        <Hero categories={productCategories} />
        <StatsBar items={statistics} />
        <About stats={statistics} />
        <Capabilities categories={productCategories} />
        <Industries items={industries} />
        <FeaturedProjects items={infrastructure} />
        <CTA image={ctaImage[0]} />
      </main>
      <Footer contact={contact} socials={socials} />
      <WhatsAppFloat />
    </>
  );
}
