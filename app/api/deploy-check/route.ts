import { NextResponse } from "next/server";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/deploy-check — TEMPORARY deployment diagnostic.
 *
 * Every DB-backed endpoint returns a generic "Internal server error" by design
 * (lib/api.ts hides the detail from the client), which makes a broken
 * production connection impossible to diagnose from outside. This route
 * reports what the running process actually sees: whether DATABASE_URL reached
 * it, which host/user/database it resolves to, and the real driver error.
 *
 * The password is never echoed. DELETE THIS FILE once the deployment is fixed.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const raw = process.env.DATABASE_URL;

  const report: Record<string, unknown> = {
    checkedAt: new Date().toISOString(),
    node: process.version,
    nodeEnv: process.env.NODE_ENV ?? null,
    cwd: process.cwd(),
    // Which env files are visible from the process working directory. A
    // standalone bundle uploaded without .env is the usual culprit.
    envFilesPresent: [".env", ".env.production", ".env.local"].filter((f) =>
      existsSync(join(process.cwd(), f)),
    ),
    hasDatabaseUrl: Boolean(raw),
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
  };

  if (raw) {
    try {
      const u = new URL(raw);
      report.connection = {
        protocol: u.protocol.replace(":", ""),
        host: u.hostname,
        port: u.port || "3306 (default)",
        user: decodeURIComponent(u.username),
        database: u.pathname.replace(/^\//, ""),
        passwordSet: u.password.length > 0,
      };
    } catch {
      report.connection = "DATABASE_URL is not a parseable URL";
    }
  }

  // Actually hit the database. This is the answer we cannot get any other way.
  try {
    const admins = await prisma.admin.count();
    report.database = { reachable: true, adminAccounts: admins };
  } catch (err) {
    const e = err as { message?: string; code?: string; errno?: number };
    report.database = {
      reachable: false,
      code: e.code ?? null,
      errno: e.errno ?? null,
      message: e.message ?? String(err),
    };
  }

  return NextResponse.json(report, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
