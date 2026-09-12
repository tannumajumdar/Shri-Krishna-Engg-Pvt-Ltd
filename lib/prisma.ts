import { existsSync } from "node:fs";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * Prisma 7 client, wired to MySQL through the MariaDB driver adapter.
 *
 * The client is created LAZILY, on first query — not at import time. This
 * matters for `next build`: Next imports every route module to collect page
 * data, and if the client (and its DATABASE_URL check) ran at import, the build
 * would crash on any host where DATABASE_URL is not present at build time
 * (Netlify, Vercel, CI). Deferring construction to the first request means the
 * env var is only needed at runtime, where it always exists.
 *
 * A single instance is cached on `globalThis` so Next's dev hot-reload does not
 * open a new connection pool on every edit.
 */

const warned = new Set<string>();

/** connectionConfig() runs per pool creation; do not repeat ourselves. */
function warnOnce(message: string) {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(message);
}

/**
 * Turn DATABASE_URL into the discrete fields the adapter wants. An empty
 * password (local root) is legitimate, so treat "" as a real value.
 *
 * Shared hosts (cPanel/CloudLinux) often expose MySQL only over a unix socket,
 * with TCP on 127.0.0.1:3306 unreachable — which surfaces as a connection-pool
 * timeout rather than a refusal, since nothing ever answers. Passing
 * `?socket=/path/to/mysql.sock` in DATABASE_URL (or setting MYSQL_SOCKET_PATH)
 * switches the driver to that socket; host/port are then irrelevant.
 *
 * That socket path is host-specific, and the same DATABASE_URL gets used on a
 * developer's Windows machine where `/var/lib/mysql/mysql.sock` cannot exist.
 * A missing socket does not fail fast — the pool just retries until it times
 * out, so every single query costs the full acquire timeout. So the path is
 * only honoured if it is actually there; otherwise we fall back to host/port,
 * which the server also accepts.
 */
export function connectionConfig() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set — see .env.example");
  }

  const parsed = new URL(url);
  const configuredSocket =
    parsed.searchParams.get("socket") ??
    parsed.searchParams.get("socketPath") ??
    process.env.MYSQL_SOCKET_PATH ??
    null;

  const socketPath = configuredSocket && existsSync(configuredSocket) ? configuredSocket : null;
  if (configuredSocket && !socketPath) {
    warnOnce(
      `[prisma] socket ${configuredSocket} does not exist on this host — ` +
        `connecting over ${parsed.hostname}:${parsed.port || 3306} instead.`,
    );
  }

  const common = {
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
    // Shared cPanel accounts cap concurrent connections per MySQL user
    // (max_user_connections, often 5-10). A pool of 5 leaves no headroom and
    // the account starts erroring with ER_TOO_MANY_USER_CONNECTIONS; 2 is
    // ample for this site's traffic. Override with DB_POOL_LIMIT if needed.
    connectionLimit: Number(process.env.DB_POOL_LIMIT ?? 2),
    // Do not sit on idle connections that count against the same cap.
    idleTimeout: 30,
    // A page render issues a dozen or so queries. With an unreachable database
    // the default 10s acquire timeout turns that into a half-minute page, so
    // give up quickly in development; production keeps the headroom because a
    // pool of 2 legitimately makes callers queue.
    acquireTimeout: Number(
      process.env.DB_ACQUIRE_TIMEOUT_MS ??
        (process.env.NODE_ENV === "production" ? 10_000 : 3_000),
    ),
    connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT_MS ?? 5_000),
    allowPublicKeyRetrieval: true,
  };

  return socketPath
    ? { ...common, socketPath }
    : {
        ...common,
        host: parsed.hostname,
        port: parsed.port ? Number(parsed.port) : 3306,
      };
}

function makeAdapter() {
  return new PrismaMariaDb(connectionConfig());
}

function createClient() {
  return new PrismaClient({
    adapter: makeAdapter(),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

/** Build the client once, on first use, and cache it. */
function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}

/**
 * Exported as a Proxy so that merely importing `prisma` constructs nothing —
 * the real client is built on the first property access (a query), i.e. at
 * request time. `next build` can import route modules without a database.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
