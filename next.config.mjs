/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use standalone output ONLY when NEXT_OUTPUT=standalone (e.g. for cPanel / Docker).
  // Netlify automatically handles Next.js serverless functions and requires standard output.
  // Setting output: "standalone" on Netlify causes oversized functions (>50MB) and HTTP 400 upload failures.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,

  serverExternalPackages: [
    "mysql2",
    "@prisma/adapter-mariadb",
    "@prisma/client",
  ],
};

export default nextConfig;
