import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import {
  company,
  contact,
  socials,
  media as siteMedia,
  productCategories,
  industries,
  facilities,
  stats,
  features,
  qualityPoints,
} from "../lib/site";

/**
 * Seed the database from the exact content the static frontend already ships
 * (lib/site.ts), so switching a component over to the API produces an
 * identical page. Re-running is safe: it clears the content tables first and
 * upserts the admin, so `npm run db:seed` is idempotent.
 */

const url = new URL(process.env.DATABASE_URL!);
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace(/^\//, ""),
  allowPublicKeyRetrieval: true,
});
const prisma = new PrismaClient({ adapter });

/* Map the frontend icon slugs to lucide-react names the admin can edit. */
const FEATURE_ICON: Record<string, string> = {
  expertise: "Compass",
  infrastructure: "Factory",
  quality: "ShieldCheck",
  precision: "Ruler",
  delivery: "Truck",
  custom: "Wrench",
};
const INDUSTRY_ICON: Record<string, string> = {
  power: "Zap",
  infrastructure: "Building2",
  construction: "HardHat",
  manufacturing: "Cog",
  automotive: "Car",
  electrical: "PlugZap",
};
const QUALITY_ICON = ["Award", "ScrollText", "Leaf", "Gauge"];

async function main() {
  console.log("→ seeding ske_db");

  /* ---- admin (upsert, never wiped) ---- */
  const email = process.env.ADMIN_EMAIL || "admin@shrikrishnaengineering.in";
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  const hash = await bcrypt.hash(password, 10);
  await prisma.admin.upsert({
    where: { email },
    update: { name: process.env.ADMIN_NAME || "SKE Administrator" },
    create: {
      email,
      name: process.env.ADMIN_NAME || "SKE Administrator",
      password: hash,
      role: "ADMIN",
    },
  });
  console.log(`  admin: ${email}`);

  /* ---- clear content (order respects FKs; products cascade) ---- */
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.industry.deleteMany();
  await prisma.media.deleteMany();
  await prisma.statistic.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.qualityPoint.deleteMany();
  await prisma.socialLink.deleteMany();

  /* ---- categories + products ---- */
  for (const [ci, cat] of productCategories.entries()) {
    const category = await prisma.productCategory.create({
      data: {
        name: cat.name,
        slug: cat.id,
        description: cat.blurb,
        sortOrder: ci,
        status: "PUBLISHED",
      },
    });

    for (const [pi, p] of cat.products.entries()) {
      await prisma.product.create({
        data: {
          categoryId: category.id,
          name: p.name,
          slug: `${cat.id}-${slug(p.name)}`,
          shortDescription: p.description,
          image: p.image,
          specifications: [{ label: "Spec", value: p.spec }],
          sortOrder: pi,
          status: "PUBLISHED",
          images: { create: [{ imageUrl: p.image, sortOrder: 0 }] },
        },
      });
    }
  }
  console.log(`  categories: ${productCategories.length}`);

  /* ---- industries ---- */
  await prisma.industry.createMany({
    data: industries.map((ind, i) => ({
      name: ind.name,
      slug: slug(ind.name),
      description: ind.description,
      image: ind.image,
      sortOrder: i,
      status: "PUBLISHED" as const,
    })),
  });
  console.log(`  industries: ${industries.length}`);

  /* ---- media: hero/products/quality/cta videos + infra gallery ---- */
  const videoMedia = [
    { section: "HERO", url: siteMedia.heroVideo, poster: siteMedia.heroPoster, title: "Hero background" },
    { section: "PRODUCTS", url: siteMedia.productsVideo, poster: siteMedia.productsPoster, title: "Products header" },
    { section: "QUALITY", url: siteMedia.qualityVideo, poster: siteMedia.qualityPoster, title: "Quality panel" },
    { section: "CTA", url: siteMedia.ctaVideo, poster: siteMedia.ctaPoster, title: "Call to action" },
  ] as const;

  for (const [i, v] of videoMedia.entries()) {
    await prisma.media.create({
      data: {
        type: "VIDEO",
        section: v.section,
        title: v.title,
        fileUrl: v.url,
        poster: v.poster,
        sortOrder: i,
        status: "PUBLISHED",
      },
    });
  }

  // About stills
  await prisma.media.createMany({
    data: [
      { type: "IMAGE" as const, section: "ABOUT" as const, fileUrl: siteMedia.about, title: "Factory interior", sortOrder: 0, status: "PUBLISHED" as const },
      { type: "IMAGE" as const, section: "ABOUT" as const, fileUrl: siteMedia.aboutSecondary, title: "Metrology detail", sortOrder: 1, status: "PUBLISHED" as const },
    ],
  });

  // Infrastructure gallery
  await prisma.media.createMany({
    data: facilities.map((f, i) => ({
      type: "IMAGE" as const,
      section: "INFRASTRUCTURE" as const,
      fileUrl: f.src,
      title: f.caption,
      alt: f.caption,
      sortOrder: i,
      status: "PUBLISHED" as const,
    })),
  });
  console.log(`  media: ${videoMedia.length + 2 + facilities.length}`);

  /* ---- statistics ---- */
  await prisma.statistic.createMany({
    data: stats.map((s, i) => ({
      title: s.label,
      value: String(s.value),
      suffix: s.suffix,
      sortOrder: i,
      status: "PUBLISHED" as const,
    })),
  });
  console.log(`  statistics: ${stats.length}`);

  /* ---- features (why choose us) ---- */
  await prisma.feature.createMany({
    data: features.map((f, i) => ({
      title: f.title,
      description: f.description,
      icon: FEATURE_ICON[f.icon] ?? "CircleCheck",
      sortOrder: i,
      status: "PUBLISHED" as const,
    })),
  });
  console.log(`  features: ${features.length}`);

  /* ---- quality points ---- */
  await prisma.qualityPoint.createMany({
    data: qualityPoints.map((q, i) => ({
      title: q.title,
      description: q.description,
      icon: QUALITY_ICON[i] ?? "Award",
      sortOrder: i,
      status: "PUBLISHED" as const,
    })),
  });
  console.log(`  qualityPoints: ${qualityPoints.length}`);

  /* ---- contact (singleton, id 1) ---- */
  await prisma.contactInfo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      address: contact.address.join(", "),
      phone: contact.phone,
      email: contact.email,
      hours: contact.hours,
    },
  });
  console.log("  contact: 1");

  /* ---- social links ---- */
  await prisma.socialLink.createMany({
    data: socials.map((s, i) => ({
      platform: s.label,
      url: s.href === "#" ? "https://example.com" : s.href,
      icon: s.icon,
      sortOrder: i,
      status: "PUBLISHED" as const,
    })),
  });
  console.log(`  socialLinks: ${socials.length}`);

  console.log(`✓ seed complete for ${company.legalName}`);
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
