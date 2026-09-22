import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Industries } from "@/components/Industries";
import { CTA } from "@/components/CTA";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { company, media } from "@/lib/site";
import {
  getContact,
  getIndustries,
  getSectionImages,
  getSocialLinks,
} from "@/lib/content";

export const metadata: Metadata = {
  title: `Industries We Serve — ${company.legalName}`,
  description:
    "Aluminium and metals, steel and heavy engineering, manufacturing, power and energy, mining and minerals, and industrial infrastructure — the sectors Shree Krishna Engineering works in.",
};

export const revalidate = 60;

export default async function IndustriesPage() {
  const [industries, ctaImage, contact, socials] = await Promise.all([
    getIndustries(),
    getSectionImages("CTA", [media.ctaPoster]),
    getContact(),
    getSocialLinks(),
  ]);

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero
          eyebrow="Industries We Serve"
          title="Engineering for"
          accent="critical industries."
          intro="We support India's key industrial sectors with reliable engineering, fabrication and plant services — work that has to hold up under load, heat and continuous running."
          image={media.industryPoster}
          facts={[
            { label: "Sectors", value: String(industries.length) },
            { label: "Anchor Unit", value: "BALCO Rolled Product" },
            { label: "Coverage", value: "Pan-India" },
          ]}
        />

        <Industries items={industries} variant="grid" />
        <CTA image={ctaImage[0]} />
      </main>

      <Footer contact={contact} socials={socials} />
      <WhatsAppFloat />
    </>
  );
}
