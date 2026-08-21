import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, ok, parseBody, requireAuth, numericParam, type RouteCtx } from "@/lib/api";
import { industryUpdateSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils/slug";

export const PUT = handle(async (req: NextRequest, ctx: RouteCtx) => {
  await requireAuth(req);
  const id = await numericParam(ctx);
  const body = await parseBody(req, industryUpdateSchema);
  const data = { ...body };
  if (body.name && !body.slug) data.slug = slugify(body.name);
  const row = await prisma.industry.update({ where: { id }, data });
  return ok(row);
});

export const DELETE = handle(async (req: NextRequest, ctx: RouteCtx) => {
  await requireAuth(req);
  const id = await numericParam(ctx);
  await prisma.industry.delete({ where: { id } });
  return ok({ deleted: id });
});
