/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use standalone output ONLY when NEXT_OUTPUT=standalone (e.g. for cPanel / Docker).
  // Netlify automatically handles Next.js serverless functions and requires standard output.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,

  serverExternalPackages: [
    "mysql2",
    "mariadb",
    "@prisma/adapter-mariadb",
  ],
};

export default nextConfig;
