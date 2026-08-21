import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  handle,
  ok,
  parseBody,
  requireAuth,
  notFound,
  ApiError,
  stringParam,
  type RouteCtx,
} from "@/lib/api";
import { verifySession, AUTH_COOKIE } from "@/lib/auth";
import { productUpdateSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils/slug";

/**
 * /api/products/[key]
 *
 * Next.js does not allow sibling dynamic segments with different names
 * ([id] vs [slug]), so one segment serves both. GET accepts a slug or a
 * numeric id; PUT/DELETE require a numeric id (they mutate by primary key).
 */

/** A slug for reads, or a positive integer id. */
function whereFromKey(key: string) {
  return /^\d+$/.test(key)
    ? { id: Number(key) }
    : { slug: key };
}

function requireId(key: string): number {
  if (!/^\d+$/.test(key)) {
    throw new ApiError(400, "Update and delete require a numeric product id");
  }
  return Number(key);
}

export const GET = handle(async (req: NextRequest, ctx: RouteCtx) => {
  const key = await stringParam(ctx, "key");
  const product = await prisma.product.findUnique({
    where: whereFromKey(key),
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!product) throw notFound("Product not found");

  // Drafts are only visible to a signed-in admin.
  if (product.status !== "PUBLISHED") {
    const session = await verifySession(req.cookies.get(AUTH_COOKIE)?.value);
    if (!session) throw notFound("Product not found");
  }
  return ok(product);
});

export const PUT = handle(async (req: NextRequest, ctx: RouteCtx) => {
  await requireAuth(req);
  const id = requireId(await stringParam(ctx, "key"));
  const body = await parseBody(req, productUpdateSchema);
  const { images, specifications, applications, name, slug, ...rest } = body;

  const product = await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        ...rest,
        ...(name ? { name } : {}),
        ...(slug ? { slug } : name ? { slug: slugify(name) } : {}),
        ...(specifications !== undefined ? { specifications } : {}),
        ...(applications !== undefined ? { applications } : {}),
      },
    });

    if (images !== undefined) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (images.length) {
        await tx.productImage.createMany({
          data: images.map((imageUrl, i) => ({
            productId: id,
            imageUrl,
            sortOrder: i,
          })),
        });
      }
    }

    return tx.product.findUniqueOrThrow({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    });
  });

  return ok(product);
});

export const DELETE = handle(async (req: NextRequest, ctx: RouteCtx) => {
  await requireAuth(req);
  const id = requireId(await stringParam(ctx, "key"));
  await prisma.product.delete({ where: { id } }); // images cascade
  return ok({ deleted: id });
});
