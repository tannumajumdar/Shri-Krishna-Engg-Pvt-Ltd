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

/**
 * Turn DATABASE_URL into the discrete fields the adapter wants. An empty
 * password (local root) is legitimate, so treat "" as a real value.
 *
 * Shared hosts (cPanel/CloudLinux) often expose MySQL only over a unix socket,
 * with TCP on 127.0.0.1:3306 unreachable — which surfaces as a connection-pool
 * timeout rather than a refusal, since nothing ever answers. Passing
 * `?socket=/path/to/mysql.sock` in DATABASE_URL (or setting MYSQL_SOCKET_PATH)
 * switches the driver to that socket; host/port are then irrelevant.
 */
export function connectionConfig() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set — see .env.example");
  }

  const parsed = new URL(url);
  const socketPath =
    parsed.searchParams.get("socket") ??
    parsed.searchParams.get("socketPath") ??
    process.env.MYSQL_SOCKET_PATH ??
    null;

  const common = {
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
    connectionLimit: 5,
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
