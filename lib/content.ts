import "server-only";
import { prisma } from "@/lib/prisma";
import * as fallback from "@/lib/site";

/**
 * Server-side content layer for the landing page.
 *
 * Reads the same data the public API serves, but straight from Prisma — a
 * server component calling its own HTTP API is an anti-pattern (extra hop,
 * absolute-URL fragility). The admin → DB → page loop is identical either way:
 * edit in /admin, it lands here on the next request. `/api/*` remains the
 * interface for the admin panel and any client-side or external consumer.
 *
 * Every getter falls back to the static content in lib/site.ts if the query
 * returns nothing or throws (fresh clone with no DB, or a transient outage),
 * so the page always renders. Failures are logged, not surfaced.
 */

async function safe<T>(fn: () => Promise<T>, fb: T, label: string): Promise<T> {
  try {
    const value = await fn();
    if (Array.isArray(value) && value.length === 0) return fb;
    return value ?? fb;
  } catch (err) {
    console.error(`[content] ${label} fell back to static:`, err);
    return fb;
  }
}

/* --------------------------------- media --------------------------------- */

export type MediaItem = {
  type: "IMAGE" | "VIDEO";
  fileUrl: string;
  poster: string | null;
  title: string | null;
  alt: string | null;
};

/** All published media in a section, ordered. */
export function getMedia(section: string): Promise<MediaItem[]> {
  return safe(
    () =>
      prisma.media.findMany({
        where: { section: section as never, status: "PUBLISHED" },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: { type: true, fileUrl: true, poster: true, title: true, alt: true },
      }),
    [],
    `media:${section}`,
  );
}

/** First video in a section (hero/products/quality/cta backgrounds). */
export async function getSectionVideo(
  section: string,
  fb: { src: string; poster: string },
) {
  const items = await getMedia(section);
  const video = items.find((m) => m.type === "VIDEO");
  if (!video) return fb;
  return { src: video.fileUrl, poster: video.poster ?? fb.poster };
}

/* ------------------------------- products -------------------------------- */

export async function getProductCategories() {
  return safe(
    async () => {
      const cats = await prisma.productCategory.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: {
          products: {
            where: { status: "PUBLISHED" },
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          },
        },
      });
      return cats.map((c) => ({
        id: c.slug,
        name: c.name,
        blurb: c.description ?? "",
        products: c.products.map((p) => ({
          name: p.name,
          description: p.shortDescription ?? "",
          image: p.image ?? "",
          spec: specOf(p.specifications),
        })),
      }));
    },
    fallback.productCategories,
    "productCategories",
  );
}

/** Pull a short spec label out of the JSON specifications array. */
function specOf(specs: unknown): string {
  if (Array.isArray(specs) && specs[0] && typeof specs[0] === "object") {
    const first = specs[0] as { value?: string };
    return first.value ?? "";
  }
  return "";
}

/* ------------------------------ industries ------------------------------- */

export function getIndustries() {
  return safe(
    async () => {
      const rows = await prisma.industry.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      return rows.map((r, i) => ({
        name: r.name,
        description: r.description ?? "",
        image: r.image ?? fallback.industries[i]?.image ?? "",
        // icon key is presentational; reuse the static mapping by position.
        icon: fallback.industries[i]?.icon ?? "manufacturing",
      }));
    },
    fallback.industries,
    "industries",
  );
}

/* --------------------------- infrastructure ------------------------------ */

const RATIOS = ["wide", "portrait", "landscape", "square"] as const;

export function getInfrastructure() {
  return safe(
    async () => {
      const rows = await prisma.media.findMany({
        where: { section: "INFRASTRUCTURE", status: "PUBLISHED", type: "IMAGE" },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      return rows.map((r, i) => ({
        src: r.fileUrl,
        caption: r.title ?? r.alt ?? "Facility",
        ratio: RATIOS[i % RATIOS.length],
      }));
    },
    fallback.facilities,
    "infrastructure",
  );
}

/* ------------------------------- statistics ------------------------------ */

export function getStatistics() {
  return safe(
    async () => {
      const rows = await prisma.statistic.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      return rows.map((r) => ({
        value: Number(r.value) || 0,
        suffix: r.suffix ?? "",
        label: r.title,
        detail: "",
      }));
    },
    fallback.stats.map((s) => ({ ...s })),
    "statistics",
  );
}

/* -------------------------------- features ------------------------------- */

export function getFeatures() {
  return safe(
    async () => {
      const rows = await prisma.feature.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      return rows.map((r, i) => ({
        title: r.title,
        description: r.description ?? "",
        icon: fallback.features[i]?.icon ?? "custom",
      }));
    },
    fallback.features,
    "features",
  );
}

/* ------------------------------ quality ---------------------------------- */

export function getQualityPoints() {
  return safe(
    async () => {
      const rows = await prisma.qualityPoint.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      return rows.map((r) => ({ title: r.title, description: r.description ?? "" }));
    },
    fallback.qualityPoints.map((q) => ({ ...q })),
    "qualityPoints",
  );
}

/* -------------------------------- contact -------------------------------- */

export function getContact() {
  return safe(
    async () => {
      const c = await prisma.contactInfo.findFirst({ orderBy: { id: "asc" } });
      if (!c) throw new Error("no contact row");
      return {
        address: c.address
          ? c.address.split(",").map((s) => s.trim())
          : [...fallback.contact.address],
        phone: c.phone ?? fallback.contact.phone,
        phoneHref: c.phone ? `tel:${c.phone.replace(/[^\d+]/g, "")}` : fallback.contact.phoneHref,
        email: c.email ?? fallback.contact.email,
        emailHref: c.email ? `mailto:${c.email}` : fallback.contact.emailHref,
        hours: c.hours ?? fallback.contact.hours,
        // Digits only, with country code — used to build wa.me links. Falls
        // back to the phone number if no dedicated WhatsApp is set.
        whatsapp:
          (c.whatsapp ?? "").replace(/[^\d]/g, "") || fallback.contact.whatsapp,
        mapUrl: c.mapUrl ?? undefined,
      };
    },
    {
      ...fallback.contact,
      address: [...fallback.contact.address],
      whatsapp: fallback.contact.whatsapp,
      mapUrl: undefined,
    },
    "contact",
  );
}

/* ------------------------------ social links ----------------------------- */

export function getSocialLinks() {
  return safe(
    async () => {
      const rows = await prisma.socialLink.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      return rows.map((r) => ({
        label: r.platform,
        href: r.url,
        icon: (r.icon ?? r.platform.toLowerCase()) as string,
      }));
    },
    fallback.socials.map((s) => ({ ...s })),
    "socialLinks",
  );
}
