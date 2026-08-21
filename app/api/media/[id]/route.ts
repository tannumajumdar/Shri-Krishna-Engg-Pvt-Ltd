import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, ok, parseBody, requireAuth, numericParam, type RouteCtx } from "@/lib/api";
import { mediaUpdateSchema } from "@/lib/validations";

export const PUT = handle(async (req: NextRequest, ctx: RouteCtx) => {
  await requireAuth(req);
  const id = await numericParam(ctx);
  const body = await parseBody(req, mediaUpdateSchema);
  const row = await prisma.media.update({ where: { id }, data: body });
  return ok(row);
});

export const DELETE = handle(async (req: NextRequest, ctx: RouteCtx) => {
  await requireAuth(req);
  const id = await numericParam(ctx);
  await prisma.media.delete({ where: { id } });
  return ok({ deleted: id });
});
