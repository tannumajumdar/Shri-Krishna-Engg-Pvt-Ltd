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

export default function Page() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <ProductShowcase />
        <IndustrialShowcase />
        <Industries />
        <Infrastructure />
        <WhyChooseUs />
        <QualitySection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
