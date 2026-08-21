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

function makeAdapter() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set — see .env.example");
  }

  // The adapter wants discrete fields, not a URL string. An empty password
  // (local root) is legitimate, so treat "" as a real value.
  const parsed = new URL(url);
  return new PrismaMariaDb({
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
    connectionLimit: 5,
    allowPublicKeyRetrieval: true,
  });
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
