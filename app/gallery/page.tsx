import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GalleryGrid } from "@/components/GalleryGrid";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { PageHero } from "@/components/ui/PageHero";
import { company } from "@/lib/site";
import { galleryEvents, galleryHero, galleryPhotos } from "@/lib/gallery";
import { getContact, getSocialLinks } from "@/lib/content";

export const metadata: Metadata = {
  title: `Gallery — ${company.legalName}`,
  description:
    "Photographs from the Sahbhagita Milap team events run by Shree Krishna Engineering at the BALCO Rolled Product unit, Korba.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const [contact, socials] = await Promise.all([getContact(), getSocialLinks()]);

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero
          eyebrow={`${company.legalName} Media Archives`}
          title="Shree Krishna"
          accent="Engineering Gallery"
          intro="Moments from our Sahbhagita Milap team events at the BALCO Rolled Product unit — recognising the crews behind every shift, every closure and every dispatch."
          image={galleryHero}
          facts={[
            { label: "Photographs", value: String(galleryPhotos.length) },
            { label: "Events", value: String(galleryEvents.length) },
            { label: "Unit", value: "BALCO, Korba" },
          ]}
        />

        <GalleryGrid />
      </main>

      <Footer contact={contact} socials={socials} />
      <WhatsAppFloat />
    </>
  );
}
