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
  productsVideo: "/media/products-video.mp4",
  productsPoster: "/media/products-poster.jpg",
  industryVideo: "/media/industry-video.mp4",
  industryPoster: "/media/industry-poster.jpg",
  qualityVideo: "/media/quality-video.mp4",
  qualityPoster: "/media/quality-poster.jpg",
  ctaVideo: "/media/cta-video.mp4",
  ctaPoster: "/media/cta.jpg",
} as const;

/* ------------------------------ products -------------------------------- */

export type Product = {
  name: string;
  description: string;
  image: string;
  /** Short technical tag shown on the card corner. */
  spec: string;
};

export type ProductCategory = {
  /** Used for the anchor and as the marquee key. */
  id: string;
  name: string;
  blurb: string;
  products: Product[];
};

/**
 * The catalogue, grouped by process — the same five stages the rest of the
 * site describes the plant with. Each category becomes its own marquee row,
 * so keep at least four products in each: a shorter row makes the loop period
 * narrower than the viewport on very wide screens.
 */
export const productCategories: ProductCategory[] = [
  {
    id: "extruded",
    name: "Extruded Products",
    blurb:
      "Profiles drawn through our own dies, from mill-finish stock lengths to anodised architectural systems.",
    products: [
      {
        name: "Mill-Finish Profiles",
        description: "Standard 6000-series profiles, cut to your stock lengths.",
        image: "/media/products/extruded-01.jpg",
        spec: "6060 · 6063",
      },
      {
        name: "Anodised Profiles",
        description: "Natural and colour anodised finishes in 10–25 micron.",
        image: "/media/products/extruded-02.jpg",
        spec: "10–25 µm",
      },
      {
        name: "Structural Sections",
        description: "Load-rated angles, channels and I-sections for framing.",
        image: "/media/products/extruded-03.jpg",
        spec: "Load-rated",
      },
      {
        name: "Architectural Systems",
        description: "Façade, glazing and curtain-wall profiles to project spec.",
        image: "/media/products/extruded-04.jpg",
        spec: "Bespoke die",
      },
      {
        name: "Heat Sink Profiles",
        description: "High fin-ratio extrusions for power electronics cooling.",
        image: "/media/products/extruded-05.jpg",
        spec: "High fin",
      },
      {
        name: "Custom Die Profiles",
        description: "Your drawing, our die shop — prototype through production.",
        image: "/media/products/extruded-06.jpg",
        spec: "Drawing-led",
      },
    ],
  },
  {
    id: "cast",
    name: "Cast & Machined",
    blurb:
      "Metal poured, solidified and cut to drawing, with dimensional checks between every operation.",
    products: [
      {
        name: "Gravity Die Castings",
        description: "Permanent-mould castings with repeatable wall sections.",
        image: "/media/products/cast-01.jpg",
        spec: "LM6 · LM25",
      },
      {
        name: "Pressure Die Castings",
        description: "High-pressure casting for thin-wall, high-volume parts.",
        image: "/media/products/cast-02.jpg",
        spec: "High volume",
      },
      {
        name: "CNC-Turned Components",
        description: "Turned parts for rotating and hydraulic assemblies.",
        image: "/media/products/cast-03.jpg",
        spec: "±0.05 mm",
      },
      {
        name: "5-Axis Milled Parts",
        description: "Complex geometry finished in a single set-up.",
        image: "/media/products/cast-04.jpg",
        spec: "5-axis",
      },
      {
        name: "Precision Housings",
        description: "Machined housings, bushes and bearing carriers.",
        image: "/media/products/cast-05.jpg",
        spec: "H7 bores",
      },
    ],
  },
  {
    id: "sheet",
    name: "Sheet & Coil",
    blurb:
      "Rolled product in engineered tempers, slit and cut to the sizes your line actually runs.",
    products: [
      {
        name: "Cold-Rolled Sheet",
        description: "Flat sheet from 0.2 to 6 mm in mill or bright finish.",
        image: "/media/products/sheet-01.jpg",
        spec: "0.2 – 6 mm",
      },
      {
        name: "Aluminium Coil",
        description: "Slit coil wound to your mandrel and weight limits.",
        image: "/media/products/sheet-02.jpg",
        spec: "Slit to width",
      },
      {
        name: "Treadplate",
        description: "Five-bar and diamond patterns for flooring and steps.",
        image: "/media/products/sheet-03.jpg",
        spec: "Anti-slip",
      },
      {
        name: "Roofing & Cladding",
        description: "Profiled and plain sheet for industrial envelopes.",
        image: "/media/products/sheet-04.jpg",
        spec: "Coil-coated",
      },
    ],
  },
  {
    id: "fabricated",
    name: "Fabricated Assemblies",
    blurb:
      "Cut, welded, bolted and inspected in-house — delivered as a working unit, not a kit of parts.",
    products: [
      {
        name: "Welded Assemblies",
        description: "MIG and TIG assemblies built from validated jigs.",
        image: "/media/products/fabricated-01.jpg",
        spec: "MIG · TIG",
      },
      {
        name: "Bolted Frames",
        description: "Site-assembled structures shipped flat and match-marked.",
        image: "/media/products/fabricated-02.jpg",
        spec: "Flat-packed",
      },
      {
        name: "Enclosures & Cabinets",
        description: "Sheet-metal enclosures built to IP rating and layout.",
        image: "/media/products/fabricated-03.jpg",
        spec: "IP-rated",
      },
      {
        name: "Jigs & Fixtures",
        description: "Production tooling built around your component.",
        image: "/media/products/fabricated-04.jpg",
        spec: "One-off",
      },
      {
        name: "Ladders & Walkways",
        description: "Access structures made to plant safety standards.",
        image: "/media/products/fabricated-05.jpg",
        spec: "To standard",
      },
    ],
  },
  {
    id: "electrical",
    name: "Electrical & Conductors",
    blurb:
      "EC-grade aluminium for current-carrying duty, machined and finished for substation and smelter work.",
    products: [
      {
        name: "Busbars",
        description: "Flat and shaped busbars in EC-grade aluminium.",
        image: "/media/products/electrical-01.jpg",
        spec: "EC-grade",
      },
      {
        name: "Conductor Sections",
        description: "Extruded conductors for transmission hardware.",
        image: "/media/products/electrical-02.jpg",
        spec: "High conductivity",
      },
      {
        name: "Switchgear Components",
        description: "Machined parts and mounts for switchgear builds.",
        image: "/media/products/electrical-03.jpg",
        spec: "Panel-ready",
      },
      {
        name: "Earthing & Bonding",
        description: "Bonding bars, lugs and earthing connections.",
        image: "/media/products/electrical-04.jpg",
        spec: "Certified",
      },
    ],
  },
];

/** Flat view of the catalogue — used by the footer link list. */
export const products: Product[] = productCategories.flatMap((c) => c.products);

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
