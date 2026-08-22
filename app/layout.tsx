import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { company, contact } from "@/lib/site";
import "./globals.css";

const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const display = Sora({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: `${company.legalName} — Mechanical, Fabrication & Erection`,
    template: `%s | ${company.name}`,
  },
  description:
    "Shri Krishna Engineering, BALCO Korba — mechanical works, fabrication, erection, civil works, transportation and round-the-clock plant operations & maintenance for heavy industry.",
  keywords: [
    "mechanical works",
    "industrial fabrication",
    "erection and commissioning",
    "civil works",
    "plant maintenance",
    "BALCO",
    "Korba",
    "Shri Krishna Engineering",
  ],
  openGraph: {
    title: `${company.legalName} — Mechanical, Fabrication & Erection`,
    description: company.tagline,
    type: "website",
    locale: "en_IN",
    siteName: company.name,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#070F22" },
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * Resolves the theme before the browser paints, so a dark-mode visitor never
 * sees a white flash. It runs as the first thing in <body> — synchronously
 * during HTML parse, ahead of any rendered content — and must stay dependency
 * free. THEME_KEY is duplicated in components/ui/ThemeToggle.tsx; keep them
 * in step.
 */
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("ske-theme");
    var dark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    var root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName,
    description: company.tagline,
    email: contact.email,
    telephone: contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address[1],
      addressLocality: "Korba",
      addressRegion: "Chhattisgarh",
      postalCode: "495684",
      addressCountry: "IN",
    },
    foundingDate: String(company.established),
  };

  return (
    /* suppressHydrationWarning: themeScript mutates <html> before React
       hydrates, so the class and colorScheme legitimately differ from SSR. */
    <html
      lang="en"
      className={`${body.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-surface">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy-900 focus:px-5 focus:py-3 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
