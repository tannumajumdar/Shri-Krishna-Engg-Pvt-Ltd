import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { StatsBar } from "@/components/StatsBar";
import { About } from "@/components/About";
import { ExecutionProcess } from "@/components/ExecutionProcess";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { CTA } from "@/components/CTA";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { company, media } from "@/lib/site";
import {
  getContact,
  getFeatures,
  getSectionImages,
  getSocialLinks,
  getStatistics,
} from "@/lib/content";

export const metadata: Metadata = {
  title: `About Us — ${company.legalName}`,
  description:
    "Established in 2006 in the BALCO industrial belt at Korba, Shree Krishna Engineering delivers mechanical, fabrication, erection, civil and plant services with its own workforce.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const [statistics, features, ctaImage, contact, socials] = await Promise.all([
    getStatistics(),
    getFeatures(),
    getSectionImages("CTA", [media.ctaPoster]),
    getContact(),
    getSocialLinks(),
  ]);

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero
          eyebrow={`About ${company.name}`}
          title="Engineering experience built on"
          accent="the shop floor."
          intro={`Established in ${company.established} at Korba, Chhattisgarh, we deliver single-point responsibility from foundation to commissioning — with our own trained workforce, fabrication capability and transport fleet.`}
          image={media.about}
          facts={[
            { label: "Established", value: String(company.established) },
            { label: "Base", value: "Korba, Chhattisgarh" },
            { label: "Unit", value: company.unit },
          ]}
        />

        <StatsBar items={statistics} />
        <About stats={statistics} variant="full" />
        <ExecutionProcess />
        <WhyChooseUs items={features} />
        <CTA image={ctaImage[0]} />
      </main>

      <Footer contact={contact} socials={socials} />
      <WhatsAppFloat />
    </>
  );
}
