import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, ok, parseBody, requireAuth } from "@/lib/api";
import { contactUpdateSchema } from "@/lib/validations";

/**
 * Contact info is a single row (id = 1).
 * GET /api/contact — public.
 * PUT /api/contact — admin; upserts the one row so it always exists.
 */
const SINGLETON_ID = 1;

export const GET = handle(async () => {
  const contact = await prisma.contactInfo.findFirst({
    orderBy: { id: "asc" },
  });
  return ok(contact); // may be null before first save
});

export const PUT = handle(async (req: NextRequest) => {
  await requireAuth(req);
  const body = await parseBody(req, contactUpdateSchema);
  const contact = await prisma.contactInfo.upsert({
    where: { id: SINGLETON_ID },
    create: { id: SINGLETON_ID, ...body },
    update: body,
  });
  return ok(contact);
});
