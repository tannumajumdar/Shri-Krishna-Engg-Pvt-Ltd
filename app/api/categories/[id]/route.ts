import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  handle,
  ok,
  parseBody,
  requireAuth,
  numericParam,
  type RouteCtx,
} from "@/lib/api";
import { categoryUpdateSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils/slug";

/** PUT/DELETE /api/categories/[id] — admin only. */
export const PUT = handle(async (req: NextRequest, ctx: RouteCtx) => {
  await requireAuth(req);
  const id = await numericParam(ctx);
  const body = await parseBody(req, categoryUpdateSchema);

  const data = { ...body };
  if (body.name && !body.slug) data.slug = slugify(body.name);

  const category = await prisma.productCategory.update({ where: { id }, data });
  return ok(category);
});

export const DELETE = handle(async (req: NextRequest, ctx: RouteCtx) => {
  await requireAuth(req);
  const id = await numericParam(ctx);
  // Products cascade-delete via the schema relation.
  await prisma.productCategory.delete({ where: { id } });
  return ok({ deleted: id });
});
