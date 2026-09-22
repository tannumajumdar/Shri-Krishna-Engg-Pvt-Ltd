import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { Infrastructure } from "@/components/Infrastructure";
import { CTA } from "@/components/CTA";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { company, media } from "@/lib/site";
import {
  getContact,
  getInfrastructure,
  getSectionImages,
  getSocialLinks,
} from "@/lib/content";

export const metadata: Metadata = {
  title: `Projects & Infrastructure — ${company.legalName}`,
  description:
    "Fabrication, erection, mechanical and civil work delivered at the BALCO Rolled Product unit, Korba — and the shop-floor infrastructure behind it.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const [infrastructure, ctaImage, contact, socials] = await Promise.all([
    getInfrastructure(),
    getSectionImages("CTA", [media.ctaPoster]),
    getContact(),
    getSocialLinks(),
  ]);

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero
          eyebrow="Projects & Infrastructure"
          title="Work that"
          accent="speaks for itself."
          intro="Fabrication yards, silo erection, crane overhauls and control-room handovers — delivered on live plant, around running production."
          /* Not infrastructure[0]: that record is a red-oxide tank shell, and
             a 3:1 band across it is a wall of flat maroon. This is the widest
             real frame we hold (1600x896) and its content runs side to side,
             so the crop still shows the work. */
          image="/media/services/fabrication-01.jpg"
          focus="50% 58%"
          facts={[
            { label: "Frames", value: String(infrastructure.length) },
            { label: "Anchor Unit", value: "BALCO, Korba" },
            { label: "Disciplines", value: "6" },
          ]}
        />

        {/* Projects first, then the plant they came out of. The landing page
            shows only four of these; this is the full set. */}
        <FeaturedProjects items={infrastructure} variant="grid" />
        <Infrastructure items={infrastructure} />
        <CTA image={ctaImage[0]} />
      </main>

      <Footer contact={contact} socials={socials} />
      <WhatsAppFloat />
    </>
  );
}
