import { NextResponse } from "next/server";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
import { prisma, connectionConfig } from "@/lib/prisma";

/**
 * GET /api/deploy-check — TEMPORARY deployment diagnostic.
 *
 * Every DB-backed endpoint returns a generic "Internal server error" by design
 * (lib/api.ts hides the detail from the client), which makes a broken
 * production connection impossible to diagnose from outside. This route
 * reports what the running process actually sees.
 *
 * The current failure is a connection-pool timeout with `active=0 idle=0`,
 * i.e. the driver never reached MySQL at all — not bad credentials (those come
 * back as ER_ACCESS_DENIED_ERROR immediately) and not a missing schema. On a
 * cPanel host that usually means MySQL listens on a unix socket rather than
 * TCP, so we probe each candidate directly with the mariadb driver and report
 * which one answers. Whatever succeeds is what DATABASE_URL should point at.
 *
 * The password is never echoed. DELETE THIS FILE once the deployment is fixed.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

const require = createRequire(import.meta.url);

/** Sockets cPanel/CloudLinux hosts commonly place MySQL on. */
const SOCKET_PATHS = [
  "/var/lib/mysql/mysql.sock",
  "/tmp/mysql.sock",
  "/var/run/mysqld/mysqld.sock",
  "/var/lib/mysql/mysql.sock.lock",
];

type Target = { label: string; opts: Record<string, unknown> };

/**
 * Open one real connection, run `SELECT 1`, close it. A short connectTimeout
 * keeps the whole probe responsive — a dead TCP target otherwise hangs for the
 * driver's full default.
 */
async function probe(target: Target, creds: Record<string, unknown>) {
  const started = Date.now();
  let conn: { query: (q: string) => Promise<unknown>; end: () => Promise<void> } | undefined;
  try {
    const mariadb = require("mariadb");
    conn = await mariadb.createConnection({
      ...creds,
      ...target.opts,
      connectTimeout: 4000,
      acquireTimeout: 4000,
    });
    await conn!.query("SELECT 1");
    return { target: target.label, ok: true, ms: Date.now() - started };
  } catch (err) {
    const e = err as { code?: string; errno?: number; message?: string };
    return {
      target: target.label,
      ok: false,
      ms: Date.now() - started,
      code: e.code ?? null,
      // Trimmed: the driver appends a long config dump to every message.
      error: (e.message ?? String(err)).split("\n")[0].slice(0, 200),
    };
  } finally {
    try {
      await conn?.end();
    } catch {
      /* already closed */
    }
  }
}

export async function GET() {
  const raw = process.env.DATABASE_URL;

  const report: Record<string, unknown> = {
    checkedAt: new Date().toISOString(),
    node: process.version,
    nodeEnv: process.env.NODE_ENV ?? null,
    cwd: process.cwd(),
    envFilesPresent: [".env", ".env.production", ".env.local"].filter((f) =>
      existsSync(join(process.cwd(), f)),
    ),
    hasDatabaseUrl: Boolean(raw),
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
    // Which of the well-known socket files actually exist on this host.
    socketsOnDisk: SOCKET_PATHS.filter((p) => existsSync(p)),
  };

  if (!raw) {
    return NextResponse.json(report, { headers: { "Cache-Control": "no-store" } });
  }

  let cfg: Record<string, unknown>;
  try {
    cfg = connectionConfig() as Record<string, unknown>;
  } catch (err) {
    report.connection = `DATABASE_URL unusable: ${String(err)}`;
    return NextResponse.json(report, { headers: { "Cache-Control": "no-store" } });
  }

  report.connection = {
    user: cfg.user,
    database: cfg.database,
    passwordSet: String(cfg.password ?? "").length > 0,
    via: cfg.socketPath ? `socket ${cfg.socketPath}` : `tcp ${cfg.host}:${cfg.port}`,
  };

  const creds = {
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    allowPublicKeyRetrieval: true,
  };

  // Try every plausible route to the server at once, so one call settles it.
  const targets: Target[] = [
    ...SOCKET_PATHS.map((p) => ({ label: `socket ${p}`, opts: { socketPath: p } })),
    { label: "tcp 127.0.0.1:3306", opts: { host: "127.0.0.1", port: 3306 } },
    { label: "tcp localhost:3306", opts: { host: "localhost", port: 3306 } },
  ];
  const probes = await Promise.all(targets.map((t) => probe(t, creds)));
  report.probes = probes;
  report.working = probes.filter((p) => p.ok).map((p) => p.target);

  // And the app's own configured path, through Prisma exactly as the site uses it.
  try {
    report.prisma = { reachable: true, adminAccounts: await prisma.admin.count() };
  } catch (err) {
    const e = err as { message?: string; code?: string };
    report.prisma = {
      reachable: false,
      code: e.code ?? null,
      message: (e.message ?? String(err)).split("\n").filter(Boolean).slice(-2).join(" "),
    };
  }

  return NextResponse.json(report, { headers: { "Cache-Control": "no-store" } });
}
