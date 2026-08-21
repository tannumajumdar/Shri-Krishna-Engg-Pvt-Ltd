import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, ok, parseBody, requireAuth } from "@/lib/api";
import { statusFilter, wantsAll } from "@/lib/query";
import { verifySession, AUTH_COOKIE } from "@/lib/auth";
import { categoryCreateSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils/slug";

/**
 * GET  /api/categories  — public list (PUBLISHED). Admin sees all with ?all=1.
 * POST /api/categories  — admin only.
 */
export const GET = handle(async (req: NextRequest) => {
  const isAdmin =
    wantsAll(req) &&
    Boolean(await verifySession(req.cookies.get(AUTH_COOKIE)?.value));

  const categories = await prisma.productCategory.findMany({
    where: statusFilter(req, isAdmin),
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { products: true } } },
  });
  return ok(categories);
});

export const POST = handle(async (req: NextRequest) => {
  await requireAuth(req);
  const body = await parseBody(req, categoryCreateSchema);
  const category = await prisma.productCategory.create({
    data: { ...body, slug: body.slug || slugify(body.name) },
  });
  return ok(category, 201);
});
