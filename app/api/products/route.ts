import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, ok, parseBody, requireAuth } from "@/lib/api";
import { statusFilter, wantsAll } from "@/lib/query";
import { verifySession, AUTH_COOKIE } from "@/lib/session";
import { productCreateSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils/slug";
import type { Prisma } from "@/lib/generated/prisma/client";

/**
 * GET  /api/products         — public list. Filter with ?category=<slug>.
 * GET  /api/products?grouped=1 — categories each with their products, the
 *                               exact shape the frontend marquee section wants.
 * POST /api/products         — admin only.
 */
export const GET = handle(async (req: NextRequest) => {
  const isAdmin =
    wantsAll(req) &&
    Boolean(await verifySession(req.cookies.get(AUTH_COOKIE)?.value));
  const where: Prisma.ProductWhereInput = statusFilter(req, isAdmin);

  const categorySlug = req.nextUrl.searchParams.get("category");
  if (categorySlug) where.category = { slug: categorySlug };

  // Grouped view: categories → products, for the "one marquee per category"
  // Products section. Only published content on the public path.
  if (req.nextUrl.searchParams.get("grouped") === "1") {
    const categories = await prisma.productCategory.findMany({
      where: statusFilter(req, isAdmin),
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        products: {
          where: statusFilter(req, isAdmin),
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          include: { images: { orderBy: { sortOrder: "asc" } } },
        },
      },
    });
    return ok(categories);
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
  return ok(products);
});

export const POST = handle(async (req: NextRequest) => {
  await requireAuth(req);
  const body = await parseBody(req, productCreateSchema);
  const { images, specifications, applications, ...rest } = body;

  const product = await prisma.product.create({
    data: {
      ...rest,
      slug: body.slug || slugify(body.name),
      specifications: specifications ?? undefined,
      applications: applications ?? undefined,
      images: images?.length
        ? {
            create: images.map((imageUrl, i) => ({ imageUrl, sortOrder: i })),
          }
        : undefined,
    },
    include: { images: true, category: true },
  });
  return ok(product, 201);
});
