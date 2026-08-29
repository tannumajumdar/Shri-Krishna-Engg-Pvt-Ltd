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
import { CheckCircle2, MessageCircle } from "lucide-react";

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
    title: `${product.name} | Shree Krishna Engineering Balco`,
    description: product.shortDescription || product.description?.substring(0, 160),
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
      return {
        name: dbProduct.name,
        description: dbProduct.description || dbProduct.shortDescription || "",
        shortDescription: dbProduct.shortDescription,
        image: dbProduct.image || "",
        category: dbProduct.category.name,
        categorySlug: dbProduct.category.slug,
        spec: "",
        specifications: dbProduct.specifications as Array<{ label: string; value: string }> | null,
        applications: dbProduct.applications as string[] | null,
      };
    }
  } catch {
    // DB unavailable
  }

  // Fallback to static data
  for (const category of productCategories) {
    for (const product of category.products) {
      if (slugify(product.name) === slug) {
        return {
          name: product.name,
          description: product.description,
          shortDescription: product.description,
          image: product.image,
          category: category.name,
          categorySlug: category.id,
          spec: product.spec,
          specifications: product.spec ? [{ label: "Type", value: product.spec }] : null,
          applications: null,
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

          <div className="mt-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
            {/* ---- image ---- */}
            <Reveal className="w-full">
              <div className="sticky top-32 overflow-hidden rounded-2xl border border-white/10 bg-navy-900">
                <MediaImage
                  src={product.image}
                  alt={product.name}
                  className="aspect-square w-full md:aspect-[4/3] lg:aspect-square"
                />
              </div>
            </Reveal>

            {/* ---- details ---- */}
            <div className="flex flex-col">
              <Reveal>
                <div className="mb-5 inline-flex rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-400">
                  {product.category}
                </div>
                <h1 className="font-display text-3xl font-light leading-tight text-white md:text-4xl lg:text-[2.75rem]">
                  {product.name}
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-6 text-base leading-relaxed text-white/65 md:text-lg">
                  {product.description}
                </p>

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
                    Enquire Now
                  </Button>
                  <Button href="#contact" variant="outline" size="lg">
                    Contact Us
                  </Button>
                </div>
              </Reveal>

              {/* ---- specs & applications ---- */}
              {(product.specifications || product.applications) && (
                <Reveal delay={0.2}>
                  <div className="mt-10 space-y-8 border-t border-white/10 pt-8">
                    {product.specifications &&
                      Array.isArray(product.specifications) &&
                      product.specifications.length > 0 && (
                        <div>
                          <h3 className="mb-4 font-display text-lg font-medium text-white">
                            Technical Specifications
                          </h3>
                          <div className="overflow-hidden rounded-xl border border-white/5 bg-navy-900/50">
                            <table className="w-full text-left text-sm text-white/70">
                              <tbody className="divide-y divide-white/5">
                                {product.specifications.map(
                                  (spec: { label?: string; name?: string; value: string }, i: number) => (
                                    <tr
                                      key={i}
                                      className={i % 2 === 0 ? "bg-white/[0.02]" : ""}
                                    >
                                      <th className="w-1/3 px-4 py-3 font-medium text-white/90">
                                        {spec.label || spec.name || "Spec"}
                                      </th>
                                      <td className="px-4 py-3">{spec.value}</td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                    {product.applications &&
                      Array.isArray(product.applications) &&
                      product.applications.length > 0 && (
                        <div>
                          <h3 className="mb-4 font-display text-lg font-medium text-white">
                            Applications
                          </h3>
                          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {product.applications.map((app: string, i: number) => (
                              <li key={i} className="flex items-start text-white/70">
                                <CheckCircle2 className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                                <span>{app}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>

        <RelatedProducts products={categoryProducts} currentSlug={slug} />
      </main>
      <Footer contact={contact} socials={socials} />
    </>
  );
}
