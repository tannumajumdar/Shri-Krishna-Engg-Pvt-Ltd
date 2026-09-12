/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use standalone output ONLY when NEXT_OUTPUT=standalone (e.g. for cPanel / Docker).
  // Netlify automatically handles Next.js serverless functions and requires standard output.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,

  // The Next static handler sends max-age=0 for files under public/, so every
  // page view re-validates the background footage before it can start playing.
  async headers() {
    return [
      {
        source: "/media/:file(.*\\.mp4)",
        headers: [
          // A week, not a year: the filenames are stable, so an editor who
          // replaces a clip in place should not be fighting a permanent cache.
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
    ];
  },

  serverExternalPackages: [
    "mysql2",
    "mariadb",
    "@prisma/adapter-mariadb",
  ],
};

export default nextConfig;
