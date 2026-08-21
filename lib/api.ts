import { NextResponse, type NextRequest } from "next/server";
import { ZodError, type ZodType } from "zod";
import { Prisma } from "@/lib/generated/prisma/client";
import { AUTH_COOKIE, verifySession, type SessionPayload } from "@/lib/auth";

/**
 * Shared plumbing for every route handler: one response envelope, one place
 * that maps errors to status codes, one auth guard. Handlers stay to the
 * happy path and throw `ApiError` for everything else.
 */

/* --------------------------- response envelope --------------------------- */

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, details },
    { status },
  );
}

/* ------------------------------- errors ---------------------------------- */

/** Thrown by handlers to short-circuit with a specific status. */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export const unauthorized = (m = "Authentication required") =>
  new ApiError(401, m);
export const forbidden = (m = "Not permitted") => new ApiError(403, m);
export const notFound = (m = "Not found") => new ApiError(404, m);

/**
 * Wraps a handler so any thrown error becomes a clean JSON response with the
 * right status. Zod → 422, known Prisma errors → 404/409, ApiError → its own
 * status, anything else → 500 with the detail hidden from the client.
 */
export function handle(
  fn: (req: NextRequest, ctx: RouteCtx) => Promise<NextResponse>,
) {
  return async (req: NextRequest, ctx: RouteCtx) => {
    try {
      return await fn(req, ctx);
    } catch (err) {
      if (err instanceof ApiError) {
        return fail(err.message, err.status, err.details);
      }
      if (err instanceof ZodError) {
        return fail("Validation failed", 422, flattenZod(err));
      }
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") return fail("Not found", 404);
        if (err.code === "P2002") {
          const target = (err.meta?.target as string[])?.join(", ") ?? "field";
          return fail(`A record with this ${target} already exists`, 409);
        }
        if (err.code === "P2003") {
          return fail("Related record does not exist", 400);
        }
      }
      console.error("[api] unhandled error:", err);
      return fail("Internal server error", 500);
    }
  };
}

function flattenZod(err: ZodError) {
  // Zod 4: issues carry the path; shape them into { field: message }.
  const fields: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_";
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}

/* ------------------------------ validation ------------------------------- */

/** Parse+validate a JSON body. Throws ZodError (→422) or ApiError (bad JSON). */
export async function parseBody<T>(
  req: NextRequest,
  schema: ZodType<T>,
): Promise<T> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new ApiError(400, "Request body must be valid JSON");
  }
  return schema.parse(raw);
}

/* --------------------------------- auth ---------------------------------- */

/**
 * Require a valid admin session. Reads the httpOnly cookie, verifies the JWT,
 * and returns the payload. Throws 401 on any failure. Every mutating and
 * admin-only route calls this first.
 */
export async function requireAuth(req: NextRequest): Promise<SessionPayload> {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) throw unauthorized();
  return session;
}

/* ------------------------------- routing --------------------------------- */

/** Next 15 route context: params is a Promise. */
export type RouteCtx = { params: Promise<Record<string, string>> };

/** Read a numeric [id] param, or throw 400 if it is not a positive integer. */
export async function numericParam(ctx: RouteCtx, key = "id"): Promise<number> {
  const params = await ctx.params;
  const n = Number(params[key]);
  if (!Number.isInteger(n) || n <= 0) {
    throw new ApiError(400, `Invalid ${key}`);
  }
  return n;
}

export async function stringParam(ctx: RouteCtx, key: string): Promise<string> {
  const params = await ctx.params;
  const v = params[key];
  if (!v) throw new ApiError(400, `Missing ${key}`);
  return v;
}
