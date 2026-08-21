import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * Prisma 7 client, wired to MySQL through the MariaDB driver adapter.
 *
 * A single instance is cached on `globalThis` so Next's dev hot-reload does
 * not open a new connection pool on every edit — the classic "too many
 * connections" leak. In production the module is evaluated once anyway.
 */

function makeAdapter() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set — see .env.example");
  }

  // The adapter wants discrete fields, not a URL string. Parse the standard
  // mysql:// connection string into what it expects. An empty password
  // (local root) is legitimate, so treat "" as a real value.
  const parsed = new URL(url);
  return new PrismaMariaDb({
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
    // Pool sized for a content site with light admin write traffic.
    connectionLimit: 5,
    allowPublicKeyRetrieval: true,
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: makeAdapter(),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
