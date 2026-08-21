import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, ok, parseBody, requireAuth, numericParam, type RouteCtx } from "@/lib/api";
import { enquiryUpdateSchema } from "@/lib/validations";

/** PUT/DELETE /api/enquiries/[id] — ADMIN only. PUT updates status. */
export const PUT = handle(async (req: NextRequest, ctx: RouteCtx) => {
  await requireAuth(req);
  const id = await numericParam(ctx);
  const body = await parseBody(req, enquiryUpdateSchema);
  const enquiry = await prisma.enquiry.update({ where: { id }, data: body });
  return ok(enquiry);
});

export const DELETE = handle(async (req: NextRequest, ctx: RouteCtx) => {
  await requireAuth(req);
  const id = await numericParam(ctx);
  await prisma.enquiry.delete({ where: { id } });
  return ok({ deleted: id });
});
