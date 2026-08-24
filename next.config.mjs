/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Self-contained server build for cPanel "Setup Node.js App" (Passenger),
  // VPS/PM2, Docker, etc. Produces .next/standalone/server.js with only the
  // dependencies actually used, so the server folder is small and portable.
  output: "standalone",
  // The MySQL driver and Prisma adapter are loaded through dynamic requires that
  // webpack cannot follow. Marking them external makes Next's file-tracer copy
  // the full packages (and their deps) into .next/standalone/node_modules, so
  // the standalone bundle actually connects to the database on its own.
  serverExternalPackages: [
    "mysql2",
    "@prisma/adapter-mariadb",
    "@prisma/client",
  ],
};

export default nextConfig;
