/* ---------------------------------------------------------------------------
 * Single source of truth for every piece of copy and every media path.
 * Drop your files into /public/media using these names and the page picks
 * them up — no component edits required.
 * ------------------------------------------------------------------------ */

export const company = {
  name: "Shri Krishna Engineering",
  legalName: "Shri Krishna Engineering Pvt. Ltd.",
  short: "SKE",
  unit: "BALCO",
  tagline: "Precision engineering. Advanced manufacturing. Built for performance.",
  established: 1999,
} as const;

export const contact = {
  address: [
    "Shri Krishna Engineering Pvt. Ltd.",
    "BALCO Industrial Area, Balco Nagar",
    "Korba, Chhattisgarh 495684, India",
  ],
  phone: "+91 00000 00000",
  phoneHref: "tel:+910000000000",
  email: "info@shrikrishnaengineering.in",
  emailHref: "mailto:info@shrikrishnaengineering.in",
  hours: "Mon – Sat · 09:00 – 18:00 IST",
} as const;

export const socials = [
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "X", href: "#", icon: "x" },
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "YouTube", href: "#", icon: "youtube" },
] as const;

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Industries", href: "#industries" },
  { label: "Infrastructure", href: "#infrastructure" },
  { label: "Quality", href: "#quality" },
  { label: "Contact", href: "#contact" },
] as const;

/* ------------------------------- media ---------------------------------- */

export const media = {
  /* Full SKE lockup. `logoLight` is the white knockout used wherever the bar
     sits over dark imagery — the blue letterforms disappear there. SVG is
     preferred; point these at .png files if that is what you have. */
  logo: "/media/logo.svg",
  logoLight: "/media/logo-light.svg",

  heroVideo: "/media/hero-video.mp4",
  heroPoster: "/media/hero-poster.jpg",
  about: "/media/about.jpg",
  aboutSecondary: "/media/about-secondary.jpg",
  industryVideo: "/media/industry-video.mp4",
  industryPoster: "/media/industry-poster.jpg",
  qualityVideo: "/media/quality-video.mp4",
  qualityPoster: "/media/quality-poster.jpg",
  ctaImage: "/media/cta.jpg",
} as const;

/* ------------------------------ products -------------------------------- */

export type Product = {
  name: string;
  description: string;
  image: string;
  spec: string;
};

export const products: Product[] = [
  {
    name: "Aluminium Extrusions",
    description: "Mill-finish and anodised profiles drawn to tight dimensional tolerance.",
    image: "/media/products/product-01.jpg",
    spec: "6000-series",
  },
  {
    name: "Busbar Systems",
    description: "High-conductivity busbars for smelter and switchgear duty.",
    image: "/media/products/product-02.jpg",
    spec: "EC-grade",
  },
  {
    name: "Structural Sections",
    description: "Load-rated sections for industrial framing and platform builds.",
    image: "/media/products/product-03.jpg",
    spec: "Certified",
  },
  {
    name: "Precision Castings",
    description: "Gravity and pressure die castings finished to drawing.",
    image: "/media/products/product-04.jpg",
    spec: "±0.05 mm",
  },
  {
    name: "Fabricated Assemblies",
    description: "Welded and bolted assemblies built from validated jigs.",
    image: "/media/products/product-05.jpg",
    spec: "In-house QA",
  },
  {
    name: "Rolled Sheets & Coils",
    description: "Cold-rolled sheet and coil supplied in engineered tempers.",
    image: "/media/products/product-06.jpg",
    spec: "0.2 – 6 mm",
  },
  {
    name: "Machined Components",
    description: "CNC-turned and milled parts for critical rotating equipment.",
    image: "/media/products/product-07.jpg",
    spec: "5-axis",
  },
  {
    name: "Custom Engineering",
    description: "Drawing-to-despatch builds developed with your design team.",
    image: "/media/products/product-08.jpg",
    spec: "Bespoke",
  },
];

/* ------------------------------ industries ------------------------------ */

export type Industry = {
  name: string;
  description: string;
  image: string;
  icon: "power" | "infrastructure" | "construction" | "manufacturing" | "automotive" | "electrical";
};

export const industries: Industry[] = [
  {
    name: "Power",
    description: "Busbars, conductors and structural hardware for generation and transmission.",
    image: "/media/industries/power.jpg",
    icon: "power",
  },
  {
    name: "Infrastructure",
    description: "Long-span sections and cladding systems for public works at scale.",
    image: "/media/industries/infrastructure.jpg",
    icon: "infrastructure",
  },
  {
    name: "Construction",
    description: "Façade, glazing and formwork profiles engineered to project spec.",
    image: "/media/industries/construction.jpg",
    icon: "construction",
  },
  {
    name: "Manufacturing",
    description: "Jigs, frames and machined parts that keep production lines running.",
    image: "/media/industries/manufacturing.jpg",
    icon: "manufacturing",
  },
  {
    name: "Automotive",
    description: "Lightweight structural components for mobility and heavy vehicles.",
    image: "/media/industries/automotive.jpg",
    icon: "automotive",
  },
  {
    name: "Electrical",
    description: "Enclosures, conductors and switchgear components built to standard.",
    image: "/media/industries/electrical.jpg",
    icon: "electrical",
  },
];

/* --------------------------- infrastructure ----------------------------- */

export type Facility = {
  src: string;
  caption: string;
  /** Controls the tile aspect ratio inside the gallery marquee. */
  ratio: "portrait" | "square" | "landscape" | "wide";
};

export const facilities: Facility[] = [
  { src: "/media/infrastructure/facility-01.jpg", caption: "Extrusion Press Line", ratio: "wide" },
  { src: "/media/infrastructure/facility-02.jpg", caption: "CNC Machining Bay", ratio: "portrait" },
  { src: "/media/infrastructure/facility-03.jpg", caption: "Melting & Casting", ratio: "landscape" },
  { src: "/media/infrastructure/facility-04.jpg", caption: "Anodising Plant", ratio: "square" },
  { src: "/media/infrastructure/facility-05.jpg", caption: "Fabrication Shop", ratio: "landscape" },
  { src: "/media/infrastructure/facility-06.jpg", caption: "Metrology Lab", ratio: "portrait" },
  { src: "/media/infrastructure/facility-07.jpg", caption: "Die Correction Cell", ratio: "square" },
  { src: "/media/infrastructure/facility-08.jpg", caption: "Despatch & Logistics", ratio: "wide" },
  { src: "/media/infrastructure/facility-09.jpg", caption: "Ageing Ovens", ratio: "landscape" },
  { src: "/media/infrastructure/facility-10.jpg", caption: "Powder Coating Line", ratio: "portrait" },
];

/* --------------------------------- stats -------------------------------- */

export const stats = [
  { value: 25, suffix: "+", label: "Years of Engineering", detail: "Operating since 1999" },
  { value: 100, suffix: "+", label: "Products Manufactured", detail: "Standard & bespoke" },
  { value: 500, suffix: "+", label: "Projects Delivered", detail: "Across six sectors" },
  { value: 50, suffix: "+", label: "Long-term Clients", detail: "India & export" },
] as const;

/* ------------------------------- features ------------------------------- */

export type Feature = {
  title: string;
  description: string;
  icon: "expertise" | "infrastructure" | "quality" | "precision" | "delivery" | "custom";
};

export const features: Feature[] = [
  {
    title: "Engineering Expertise",
    description:
      "A resident team of design and process engineers who read your drawings before quoting, not after.",
    icon: "expertise",
  },
  {
    title: "Advanced Infrastructure",
    description:
      "Presses, CNC cells, casting and finishing lines under one roof — nothing critical is sub-contracted.",
    icon: "infrastructure",
  },
  {
    title: "Quality Assurance",
    description:
      "Documented inspection at every stage, with full material traceability from billet to despatch.",
    icon: "quality",
  },
  {
    title: "Precision Manufacturing",
    description:
      "Tolerances held to ±0.05 mm and verified on calibrated metrology equipment before release.",
    icon: "precision",
  },
  {
    title: "Reliable Delivery",
    description:
      "Committed schedules backed by capacity planning, buffer stock and our own despatch fleet.",
    icon: "delivery",
  },
  {
    title: "Custom Solutions",
    description:
      "Die development, prototyping and short-run production for requirements no catalogue covers.",
    icon: "custom",
  },
];

/* -------------------------------- quality ------------------------------- */

export const qualityPoints = [
  {
    title: "Certified Processes",
    description: "Quality management aligned to ISO 9001 discipline across every production cell.",
  },
  {
    title: "Full Traceability",
    description: "Heat numbers, test certificates and inspection records retained for every batch.",
  },
  {
    title: "Responsible Aluminium",
    description: "Closed-loop scrap recovery returns process metal to the furnace, not to landfill.",
  },
  {
    title: "Energy Stewardship",
    description: "Recovered furnace heat and metered load management cut energy drawn per tonne.",
  },
] as const;
