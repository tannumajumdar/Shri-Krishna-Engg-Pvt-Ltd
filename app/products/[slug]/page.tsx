import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductBreadcrumb } from "@/components/ProductBreadcrumb";
import { RelatedProducts } from "@/components/RelatedProducts";
import { Reveal } from "@/components/ui/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { Button } from "@/components/ui/Button";
import { getContact, getSocialLinks, getProductCategories } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { productCategories, whatsappLink, productEnquiryMessage, contact as siteContact } from "@/lib/site";
import { slugify } from "@/lib/utils";
import {
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Wrench,
  Clock,
  Award,
  FileText,
  Check,
  ArrowRight,
  PhoneCall,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const dbProducts = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
    if (dbProducts.length > 0) {
      return dbProducts.map((p) => ({ slug: p.slug }));
    }
  } catch {
    // DB unavailable — fall back to static
  }

  return productCategories.flatMap((c) =>
    c.products.map((p) => ({ slug: slugify(p.name) })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Service Not Found" };

  return {
    title: `${product.name} — Engineering Services | Shree Krishna Engineering Balco`,
    description: product.shortDescription || product.description?.substring(0, 160),
  };
}

/** Generates rich, detailed industrial content for any product based on its trade and name. */
function generateRichProductData(name: string, category: string, baseDesc: string, spec: string) {
  const isMechanical = category.toLowerCase().includes("mechanical") || name.toLowerCase().includes("equipment") || name.toLowerCase().includes("pump") || name.toLowerCase().includes("rotary");
  const isFabrication = category.toLowerCase().includes("fabrication") || name.toLowerCase().includes("plate") || name.toLowerCase().includes("welding") || name.toLowerCase().includes("tank");
  const isErection = category.toLowerCase().includes("erection") || name.toLowerCase().includes("crane") || name.toLowerCase().includes("heavy");
  const isCivil = category.toLowerCase().includes("civil") || name.toLowerCase().includes("foundation") || name.toLowerCase().includes("concrete") || name.toLowerCase().includes("rcc");
  const isTransport = category.toLowerCase().includes("transport") || name.toLowerCase().includes("hydra") || name.toLowerCase().includes("haulage");

  let overviewParagraphs = [
    `${name} is a core engineering capability delivered by Shree Krishna Engineering Balco for heavy industrial complexes, aluminium smelters, thermal power plants, and continuous manufacturing facilities across Korba and Chhattisgarh. Established in 2006, our specialized execution crews combine decades of field experience with precision engineering standards to deliver reliable, high-uptime performance.`,
    `Our turnkey execution methodology incorporates rigorous pre-job planning, laser-guided measurement, OEM-compliant tolerances, and non-destructive testing (NDT) to ensure seamless integration. Whether supporting planned annual overhauls or executing 24/7 emergency breakdown interventions, our teams operate with strict adherence to industrial EHS safety norms and quality control protocols.`,
    `By deploying certified technicians, specialized heavy rigging tools, and calibrated testing equipment, Shree Krishna Engineering Balco minimizes plant downtime, prevents catastrophic machine failures, and ensures long-term operational efficiency for critical infrastructure.`,
  ];

  let specifications = [
    { label: "Execution Model", value: "Turnkey On-Site & Workshop Execution" },
    { label: "Precision Tolerance", value: isMechanical ? "Laser Aligned (±0.02 mm)" : isFabrication ? "ASME / IS 2062 Class A" : "OEM Compliant Standards" },
    { label: "Workforce & Crew", value: "Trained & Safety-Certified Technicians" },
    { label: "Quality Testing", value: "NDT / DPT / Ultrasonic / Load Tested" },
    { label: "Safety Protocol", value: "BALCO EHS Norms & Zero-Harm Standard" },
    { label: "Availability", value: "24/7 Emergency Support & Shutdown Support" },
  ];

  let applications = [
    "BALCO Aluminium Smelter & Potroom Facilities",
    "Thermal Power Plants & Captive Generation Units",
    "Steel Rolling Mills & Heavy Processing Plants",
    "Material Handling Systems & Overhead Cranes",
    "Chemical, Alumina & Heavy Fabrication Units",
    "Substation Infrastructure & Civil Foundations",
  ];

  let keyHighlights = [
    {
      iconType: "precision",
      title: "Laser Precision & Tolerances",
      desc: "Executed using calibrated laser aligners and dial gauges meeting strict OEM tolerances.",
    },
    {
      iconType: "crew",
      title: "Certified Skilled Crew",
      desc: "Deployed by certified riggers, welders, and mechanical fitters with 19+ years of plant experience.",
    },
    {
      iconType: "clock",
      title: "24/7 Emergency Response",
      desc: "Round-the-clock emergency dispatch for unplanned breakdowns and critical shutdown overhauls.",
    },
    {
      iconType: "quality",
      title: "ISO 9001:2015 Quality",
      desc: "Full quality sign-off with comprehensive inspection reports and NDT verification.",
    },
  ];

  return {
    overviewParagraphs,
    specifications,
    applications,
    keyHighlights,
  };
}

async function getProduct(slug: string) {
  // Try DB first
  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug, status: "PUBLISHED" },
      include: { category: true },
    });

    if (dbProduct) {
      const baseDesc = dbProduct.description || dbProduct.shortDescription || "";
      const extra = generateRichProductData(dbProduct.name, dbProduct.category.name, baseDesc, "");
      return {
        name: dbProduct.name,
        description: baseDesc,
        shortDescription: dbProduct.shortDescription,
        image: dbProduct.image || "",
        category: dbProduct.category.name,
        categorySlug: dbProduct.category.slug,
        spec: "",
        specifications: (dbProduct.specifications as Array<{ label: string; value: string }>) || extra.specifications,
        applications: (dbProduct.applications as string[]) || extra.applications,
        overviewParagraphs: extra.overviewParagraphs,
        keyHighlights: extra.keyHighlights,
      };
    }
  } catch {
    // DB unavailable
  }

  // Fallback to static data
  for (const category of productCategories) {
    for (const product of category.products) {
      if (slugify(product.name) === slug) {
        const extra = generateRichProductData(product.name, category.name, product.description, product.spec);
        return {
          name: product.name,
          description: product.description,
          shortDescription: product.description,
          image: product.image,
          category: category.name,
          categorySlug: category.id,
          spec: product.spec,
          specifications: extra.specifications,
          applications: extra.applications,
          overviewParagraphs: extra.overviewParagraphs,
          keyHighlights: extra.keyHighlights,
        };
      }
    }
  }

  return null;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const [contact, socials, allCategories] = await Promise.all([
    getContact(),
    getSocialLinks(),
    getProductCategories(),
  ]);

  const categoryData = allCategories.find(
    (c) => c.id === product.categorySlug || slugify(c.name) === slugify(product.category),
  );
  const categoryProducts = categoryData?.products || [];

  const waMessage = productEnquiryMessage({
    name: product.name,
    category: product.category,
    spec: product.spec,
  });
  const waLink = whatsappLink(contact.whatsapp || siteContact.whatsapp, waMessage);

  return (
    <>
      <Navbar />
      <main className="on-dark min-h-screen bg-navy-950 pb-0 pt-32">
        <div className="container mx-auto mb-20 max-w-6xl">
          <ProductBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/products" },
              { label: product.category, href: `/products#${product.categorySlug}` },
              { label: product.name },
            ]}
          />

          {/* ---- Main Hero Section ---- */}
          <div className="mt-8 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
            {/* ---- Image Showcase ---- */}
            <Reveal className="w-full">
              <div className="sticky top-32 overflow-hidden rounded-2xl border border-white/10 bg-navy-900 shadow-2xl">
                <MediaImage
                  src={product.image}
                  alt={product.name}
                  className="aspect-square w-full md:aspect-[4/3] lg:aspect-square"
                />
                <div className="p-4 bg-navy-900/90 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-xs text-brand-400 font-semibold">
                    Shree Krishna Engineering Balco
                  </span>
                  <span className="font-mono text-xs text-white/50">
                    Established 2006 · Korba
                  </span>
                </div>
              </div>
            </Reveal>

            {/* ---- Header Details & CTAs ---- */}
            <div className="flex flex-col">
              <Reveal>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
                  {product.category}
                </div>
                <h1 className="font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-[2.6rem]">
                  {product.name}
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-5 text-base leading-relaxed text-white/75 md:text-lg">
                  {product.description}
                </p>

                {/* Direct Action Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="solid"
                    size="lg"
                    withArrow
                  >
                    <MessageCircle className="h-4 w-4" />
                    Enquire on WhatsApp
                  </Button>
                </div>
              </Reveal>

              {/* ---- Quick Facts Strip ---- */}
              <Reveal delay={0.15}>
                <div className="mt-8 grid grid-cols-2 gap-3 border-y border-white/10 py-6 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/15 bg-white/[0.04]">
                      <Award className="h-5 w-5 text-brand-400" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase text-white/40">Track Record</p>
                      <p className="text-xs font-semibold text-white">19+ Years at BALCO</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/15 bg-white/[0.04]">
                      <Clock className="h-5 w-5 text-brand-400" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase text-white/40">Availability</p>
                      <p className="text-xs font-semibold text-white">24/7 Rapid Response</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/15 bg-white/[0.04]">
                      <Wrench className="h-5 w-5 text-brand-400" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase text-white/40">Execution</p>
                      <p className="text-xs font-semibold text-white">Turnkey On-Site</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/15 bg-white/[0.04]">
                      <ShieldCheck className="h-5 w-5 text-brand-400" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase text-white/40">Compliance</p>
                      <p className="text-xs font-semibold text-white">ISO 9001:2015 & EHS</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* ---- Detailed Engineering Capabilities Section ---- */}
          <div className="mt-16 border-t border-white/10 pt-14">
            <Reveal>
              <div className="max-w-3xl">
                <span className="font-mono text-xs uppercase tracking-wider text-brand-400 font-semibold">
                  Comprehensive Overview
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                  Engineering Capabilities & Scope of Execution
                </h2>
              </div>
            </Reveal>

            <div className="mt-8 space-y-6 text-base leading-relaxed text-white/75 sm:text-lg">
              {product.overviewParagraphs?.map((para, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <p>{para}</p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* ---- 4 Key Feature Cards ---- */}
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {product.keyHighlights?.map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="h-full rounded-xl border border-white/10 bg-navy-900/60 p-5 transition-all duration-300 hover:border-brand-500/40 hover:bg-navy-900">
                  <div className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-brand-500/10 mb-4">
                    {item.iconType === "precision" && <Wrench className="h-5 w-5 text-brand-400" />}
                    {item.iconType === "crew" && <Award className="h-5 w-5 text-brand-400" />}
                    {item.iconType === "clock" && <Clock className="h-5 w-5 text-brand-400" />}
                    {item.iconType === "quality" && <ShieldCheck className="h-5 w-5 text-brand-400" />}
                  </div>
                  <h3 className="font-display text-base font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/60">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* ---- Technical Specifications Table ---- */}
          {product.specifications && (
            <div className="mt-16 border-t border-white/10 pt-14">
              <Reveal>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-brand-400 font-semibold">
                      Technical Specs
                    </span>
                    <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                      Technical Specifications & Operational Standards
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-white/40">
                    Verified to IS / OEM Norms
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-navy-900/70 shadow-xl">
                  <table className="w-full text-left text-sm text-white/80">
                    <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider font-mono text-brand-400">
                      <tr>
                        <th className="px-6 py-4">Specification Parameter</th>
                        <th className="px-6 py-4">Execution Standard & Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {product.specifications.map(
                        (spec: { label?: string; name?: string; value: string }, i: number) => (
                          <tr
                            key={i}
                            className={i % 2 === 0 ? "bg-white/[0.015]" : "bg-transparent"}
                          >
                            <td className="w-1/3 px-6 py-4 font-semibold text-white">
                              {spec.label || spec.name || "Parameter"}
                            </td>
                            <td className="px-6 py-4 text-white/85">{spec.value}</td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            </div>
          )}

          {/* ---- Applications & Use Cases ---- */}
          {product.applications && (
            <div className="mt-16 border-t border-white/10 pt-14">
              <Reveal>
                <span className="font-mono text-xs uppercase tracking-wider text-brand-400 font-semibold">
                  Industry Footprint
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                  Key Applications & Plant Use Cases
                </h2>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {product.applications.map((app: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-navy-900/50 p-4 transition-colors hover:border-white/20"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-400 mt-0.5" />
                      <span className="text-sm font-medium text-white/90">{app}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          )}

          {/* ---- 4-Step Execution Workflow ---- */}
          <div className="mt-16 border-t border-white/10 pt-14">
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-wider text-brand-400 font-semibold">
                Execution Workflow
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                4-Step Standard Operating Procedure
              </h2>
            </Reveal>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Reveal delay={0.05}>
                <div className="h-full rounded-xl border border-white/10 bg-navy-900/40 p-5">
                  <span className="font-mono text-xs font-bold text-brand-400">STEP 01</span>
                  <h3 className="mt-2 font-display text-lg font-bold text-white">Site Survey & Risk Study</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/60">
                    Comprehensive site inspection, GA drawing verification, work permit (PTW) and EHS risk assessment.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="h-full rounded-xl border border-white/10 bg-navy-900/40 p-5">
                  <span className="font-mono text-xs font-bold text-brand-400">STEP 02</span>
                  <h3 className="mt-2 font-display text-lg font-bold text-white">Tooling & Rigging Setup</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/60">
                    Mobilization of calibrated tools, laser aligners, cranes, certified welders, and safety gear.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="h-full rounded-xl border border-white/10 bg-navy-900/40 p-5">
                  <span className="font-mono text-xs font-bold text-brand-400">STEP 03</span>
                  <h3 className="mt-2 font-display text-lg font-bold text-white">Precision Execution</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/60">
                    Turnkey fabrication, alignment, grouting, overhauling or erection to strict tolerances.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="h-full rounded-xl border border-white/10 bg-navy-900/40 p-5">
                  <span className="font-mono text-xs font-bold text-brand-400">STEP 04</span>
                  <h3 className="mt-2 font-display text-lg font-bold text-white">NDT & Quality Handover</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/60">
                    Final load testing, vibration analysis, quality sign-off report, and customer handover.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          {/* ---- Direct Quote Callout Band ---- */}
          <div className="mt-16 rounded-2xl border border-brand-500/30 bg-gradient-to-br from-navy-900 via-navy-900 to-navy-950 p-8 shadow-2xl lg:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-brand-400 font-semibold">
                  Ready to Execute Your Project?
                </span>
                <h3 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                  Require specialized engineering for {product.name}?
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
                  Our engineering team is ready to assist with technical queries, site surveys, or immediate emergency support at BALCO Korba and regional plants.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row shrink-0">
                <Button
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="solid"
                  size="lg"
                  withArrow
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </Button>
                <Button href="#contact" variant="outline" size="lg">
                  <PhoneCall className="h-4 w-4" />
                  Contact Office
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Related Products Row ---- */}
        <RelatedProducts products={categoryProducts} currentSlug={slug} />
      </main>
      <Footer contact={contact} socials={socials} />
    </>
  );
}
