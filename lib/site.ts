/* ---------------------------------------------------------------------------
 * Single source of truth for every piece of copy and every media path.
 * Drop your files into /public/media using these names and the page picks
 * them up — no component edits required.
 * ------------------------------------------------------------------------ */

export const company = {
  name: "Shree Krishna Engineering",
  legalName: "Shree Krishna Engineering Balco",
  short: "SKE",
  unit: "BALCO",
  tagline: "Engineering Excellence Since 2006 — Mechanical · Fabrication · Erection · Civil · Transportation.",
  established: 2006,
} as const;

export const contact = {
  address: [
    "Shree Krishna Engineering Balco",
    "Near 1 MVA Sub Station, Sector-5",
    "PO Balco Township, Korba, Chhattisgarh 495684",
  ],
  phone: "+91 98263 62831",
  phoneHref: "tel:+919826362831",
  /** Extra numbers from the letterhead, shown in the footer/contact list. */
  altPhones: ["+91 73891 50849", "+91 73892 95122"],
  email: "shreekrishna1.engg@gmail.com",
  emailHref: "mailto:shreekrishna1.engg@gmail.com",
  altEmail: "shreekrishna1.engg@rediffmail.com",
  /** Digits only, with country code — used to build wa.me enquiry links. */
  whatsapp: "919826362831",
  hours: "Mon – Sat · 09:00 – 18:00 IST",
} as const;

/** Build a WhatsApp click-to-chat link with a pre-filled message. */
export function whatsappLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * The enquiry message a customer sends when they tap "Enquire" on a service.
 * Carries the service details (no price — pricing happens over chat) and leaves
 * blank fields for the customer to fill before sending.
 */
export function productEnquiryMessage(p: {
  name: string;
  category?: string;
  spec?: string;
}): string {
  const lines = [
    "Hello Shree Krishna Engineering Balco,",
    "",
    "I would like to enquire about this service:",
    "",
    `• Service: ${p.name}`,
  ];
  if (p.category) lines.push(`• Category: ${p.category}`);
  if (p.spec) lines.push(`• Scope: ${p.spec}`);
  lines.push(
    "",
    "Please share details and a quotation.",
    "",
    "My details —",
    "Name: ",
    "Company: ",
    "Requirement: ",
  );
  return lines.join("\n");
}

export const socials = [
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "X", href: "#", icon: "x" },
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "YouTube", href: "#", icon: "youtube" },
] as const;

/**
 * Primary navigation.
 *
 * A link with `groups` opens a menu. One group renders as a plain list; two or
 * more render as a mega panel with a heading per column. `href` on the parent
 * is still where it goes when clicked or followed without JavaScript, so every
 * menu has a landing place of its own and nothing depends on the dropdown.
 *
 * Industries deliberately has no menu: the six sectors are one row on the
 * landing page, not six pages, so a menu listing them would be six links to
 * the same anchor.
 */
export type NavGroup = {
  /** Column heading in a mega panel; omitted when there is only one group. */
  heading?: string;
  items: { label: string; href: string }[];
};

export type NavLink = {
  label: string;
  href: string;
  groups?: NavGroup[];
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about",
    groups: [
      {
        heading: "Company Profile",
        items: [
          { label: "Who We Are", href: "/about" },
          { label: "Execution Process", href: "/about#process" },
          { label: "Why Shree Krishna", href: "/about#why" },
        ],
      },
      {
        heading: "Our Work",
        items: [
          { label: "Featured Projects", href: "/projects" },
          { label: "Infrastructure", href: "/projects#infrastructure" },
        ],
      },
      {
        heading: "Reach Us",
        items: [
          { label: "Contact", href: "/contact" },
          { label: "Careers", href: "/contact#careers" },
        ],
      },
    ],
  },
  {
    label: "Capabilities",
    href: "/services",
    groups: [
      {
        items: [
          { label: "Mechanical Works", href: "/services#mechanical" },
          { label: "Fabrication", href: "/services#fabrication" },
          { label: "Erection & Commissioning", href: "/services#erection" },
          { label: "Civil Works", href: "/services#civil" },
          { label: "Transportation & Logistics", href: "/services#transportation" },
          { label: "Plant Operations & Maintenance", href: "/services#om" },
          { label: "All Services", href: "/services" },
        ],
      },
    ],
  },
  { label: "Industries", href: "/industries" },
  { label: "Projects", href: "/projects" },
  {
    label: "Media",
    href: "/gallery",
    groups: [
      {
        items: [
          { label: "Gallery", href: "/gallery" },
          { label: "Infrastructure", href: "/projects#infrastructure" },
        ],
      },
    ],
  },
  { label: "Contact", href: "/contact" },
];

/**
 * Hero copy, one slide per capability.
 *
 * The hero now runs through the six things the company does, so each slide
 * needs a line of its own. Keyed by the category id so it survives the
 * categories being reordered or renamed in the admin; anything without an
 * entry falls back to the category name, which always reads sensibly.
 *
 * `accent` is the closing phrase, set in the brand green.
 */
/**
 * Hero background per capability.
 *
 * Kept apart from the capability's own product photograph on purpose: the
 * service cards and the products pages keep the company's real site
 * photography, which is what a buyer should see there. These are only the
 * full-bleed backdrops, where the in-house frames were too small to hold up.
 *
 * Sourced from Pexels, whose licence allows commercial use without
 * attribution. Swap any of these for a real photograph the moment a
 * high-resolution one exists — it will always read better.
 */
export const capabilityHeroImages: Record<string, string> = {
  mechanical: "/media/hero/mechanical.jpg",
  fabrication: "/media/hero/fabrication.jpg",
  erection: "/media/hero/erection.jpg",
  civil: "/media/hero/civil.jpg",
  transportation: "/media/hero/transportation.jpg",
  om: "/media/hero/om.jpg",
};

export const capabilityHeadlines: Record<string, { lead: string; accent: string }> = {
  mechanical: { lead: "Precision that keeps", accent: "plant running." },
  fabrication: { lead: "Built to drawing,", accent: "ready to erect." },
  erection: { lead: "From foundation", accent: "to first run." },
  civil: { lead: "Groundwork the plant", accent: "stands on." },
  transportation: { lead: "Heavy loads,", accent: "moved safely." },
  om: { lead: "Your plant, running", accent: "round the clock." },
};

/* ------------------------------- media ---------------------------------- */

export const media = {
  /* Full SKE lockup. `logoLight` is the white knockout used wherever the bar
     sits over dark imagery — the blue letterforms disappear there. SVG is
     preferred; point these at .png files if that is what you have. */
  logo: "/media/logo.png",
  logoLight: "/media/logo-light.png",

  heroVideo: "/media/hero-video.mp4",
  heroPoster: "/media/hero-poster.jpg",
  /* The hero runs as a three-slide still carousel. Order is the slide order. */
  heroSlides: [
    "/media/hero-poster.jpg",
    "/media/industry-poster.jpg",
    "/media/products-poster.jpg",
  ],
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
 * Our services, grouped by trade — the six things Shree Krishna Engineering
 * actually does. The data model is still called `productCategories` so the API
 * and admin stay unchanged; the site labels it "Services". Each group becomes
 * its own marquee row, so keep at least four items in each.
 */
export const productCategories: ProductCategory[] = [
  {
    id: "mechanical",
    name: "Mechanical Works",
    blurb:
      "Erection, alignment, overhauling and maintenance of rotating and static plant equipment.",
    products: [
      { name: "Equipment Erection & Alignment", description: "Precision installation and laser alignment of drives, pumps and gearboxes.", image: "/media/services/mechanical-01.jpg", spec: "On-site" },
      { name: "Rotary Equipment Maintenance", description: "Bearings, couplings and shafts serviced to OEM tolerances.", image: "/media/services/mechanical-02.jpg", spec: "PM · CBM" },
      { name: "Pump & Gearbox Overhaul", description: "In-house repair and rebuild of hydraulic and gear assemblies.", image: "/media/services/mechanical-03.jpg", spec: "Rebuild" },
      { name: "Preventive Maintenance", description: "Planned PM schedules that keep critical lines available.", image: "/media/services/mechanical-04.jpg", spec: "Scheduled" },
      { name: "Breakdown Support", description: "Rapid-response teams for unplanned stoppages, round the clock.", image: "/media/services/mechanical-05.jpg", spec: "24x7" },
    ],
  },
  {
    id: "fabrication",
    name: "Fabrication",
    blurb:
      "Structural, plate and pipe fabrication built in-house to drawing, then delivered ready to erect.",
    products: [
      { name: "Structural Fabrication", description: "Beams, columns and trusses fabricated from certified sections.", image: "/media/services/fabrication-01.jpg", spec: "MIG · TIG" },
      { name: "Plate & Pipe Work", description: "Chutes, hoppers, ducting and pipe spools made to spec.", image: "/media/services/fabrication-02.jpg", spec: "To drawing" },
      { name: "Tanks & Enclosures", description: "Storage tanks, vessels and sheet-metal enclosures.", image: "/media/services/fabrication-03.jpg", spec: "Sealed" },
      { name: "Platforms & Walkways", description: "Access structures, ladders and handrails to plant safety norms.", image: "/media/services/fabrication-04.jpg", spec: "To standard" },
      { name: "On-site Welding", description: "Qualified welders for site fabrication and modification.", image: "/media/services/fabrication-05.jpg", spec: "Certified" },
    ],
  },
  {
    id: "erection",
    name: "Erection & Commissioning",
    blurb:
      "Heavy equipment and structural erection — aligned, tested and handed over ready to run.",
    products: [
      { name: "Heavy Equipment Erection", description: "Mills, furnaces and drives set, aligned and grouted.", image: "/media/services/erection-01.jpg", spec: "Heavy lift" },
      { name: "Structural Erection", description: "Steel structures raised and bolted to GA drawings.", image: "/media/services/erection-02.jpg", spec: "Bolted" },
      { name: "Crane & EOT Installation", description: "EOT and gantry cranes installed and load-tested.", image: "/media/services/erection-03.jpg", spec: "Load-tested" },
      { name: "Alignment & Commissioning", description: "Cold and hot commissioning with full alignment records.", image: "/media/services/erection-04.jpg", spec: "Commissioned" },
    ],
  },
  {
    id: "civil",
    name: "Civil Works",
    blurb:
      "Foundations, RCC, flooring and site development that carry heavy plant and stand up to it.",
    products: [
      { name: "Foundations & Grouting", description: "Machine foundations, anchor bolts and epoxy grouting.", image: "/media/services/civil-01.jpg", spec: "Load-bearing" },
      { name: "RCC & Concrete Work", description: "Reinforced concrete for structures, pits and pedestals.", image: "/media/services/civil-02.jpg", spec: "M20 – M40" },
      { name: "Rebar & Reinforcement", description: "Cutting, bending and tying of reinforcement to BBS.", image: "/media/services/civil-03.jpg", spec: "Per BBS" },
      { name: "Industrial Flooring", description: "Heavy-duty and trimix floors for shop-floor traffic.", image: "/media/services/civil-04.jpg", spec: "Trimix" },
      { name: "Site Development", description: "Grading, drains and hardstands for plant areas.", image: "/media/services/civil-05.jpg", spec: "Turnkey" },
    ],
  },
  {
    id: "transportation",
    name: "Transportation & Logistics",
    blurb:
      "Heavy haulage, crane hire and in-plant material movement — the right equipment, on time.",
    products: [
      { name: "Heavy Haulage", description: "Trailers and low-beds for oversized plant equipment.", image: "/media/services/transport-01.jpg", spec: "Over-dimension" },
      { name: "Trailer Transport", description: "Scheduled movement of materials and finished goods.", image: "/media/services/transport-02.jpg", spec: "Fleet" },
      { name: "Crane & Hydra Hire", description: "Mobile cranes and hydras for lifting and shifting.", image: "/media/services/transport-03.jpg", spec: "On hire" },
      { name: "In-plant Logistics", description: "Material shifting and yard handling inside the works.", image: "/media/services/transport-04.jpg", spec: "In-plant" },
    ],
  },
  {
    id: "om",
    name: "Plant Operations & Maintenance",
    blurb:
      "Round-the-clock O&M of foundry, rolling mill and material-handling equipment at BALCO Rolled Product.",
    products: [
      { name: "Furnace & Foundry O&M", description: "Melting, casting and furnace operations and upkeep.", image: "/media/services/om-01.jpg", spec: "Foundry" },
      { name: "Rolling Mill Maintenance", description: "HRM and CRM mechanical and hydraulic maintenance.", image: "/media/services/om-02.jpg", spec: "HRM · CRM" },
      { name: "Furnace Relining & Repair", description: "Refractory, burners and furnace shutdown work.", image: "/media/services/om-03.jpg", spec: "Shutdown" },
      { name: "Material Handling O&M", description: "Coil cars, conveyors and forklifts kept running.", image: "/media/services/om-04.jpg", spec: "Availability" },
      { name: "Crane & EOT Maintenance", description: "Preventive and breakdown maintenance of plant cranes.", image: "/media/services/om-05.jpg", spec: "PM & repair" },
    ],
  },
];

export const products: Product[] = productCategories.flatMap((c) => c.products);

/** Generate a URL-friendly slug from a product/category name. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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
    description: "Mechanical, structural and civil works for generation and transmission plants.",
    image: "/media/industries/power.jpg",
    icon: "power",
  },
  {
    name: "Infrastructure",
    description: "Fabrication and heavy erection for large public-works projects.",
    image: "/media/industries/infrastructure.jpg",
    icon: "infrastructure",
  },
  {
    name: "Construction",
    description: "Civil works, structural steel and site development, turnkey.",
    image: "/media/industries/construction.jpg",
    icon: "construction",
  },
  {
    name: "Manufacturing",
    description: "Plant maintenance and equipment erection that keep production lines running.",
    image: "/media/industries/manufacturing.jpg",
    icon: "manufacturing",
  },
  {
    name: "Automotive",
    description: "Fabrication, machining and maintenance support for process plants.",
    image: "/media/industries/automotive.jpg",
    icon: "automotive",
  },
  {
    name: "Electrical",
    description: "Electrical erection and panel work, executed to standard.",
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
  { src: "/media/infrastructure/facility-01.jpg", caption: "Rolled Product Team, BALCO", ratio: "wide" },
  { src: "/media/infrastructure/facility-02.jpg", caption: "Machine Shop", ratio: "portrait" },
  { src: "/media/infrastructure/facility-03.jpg", caption: "Foundry Operations", ratio: "landscape" },
  { src: "/media/infrastructure/facility-04.jpg", caption: "Fabrication Yard", ratio: "square" },
  { src: "/media/infrastructure/facility-05.jpg", caption: "Downstream Shop Floor", ratio: "landscape" },
  { src: "/media/infrastructure/facility-06.jpg", caption: "Measurement & QC", ratio: "portrait" },
  { src: "/media/infrastructure/facility-07.jpg", caption: "Machining Cell", ratio: "square" },
  { src: "/media/infrastructure/facility-08.jpg", caption: "Material Handling", ratio: "wide" },
  { src: "/media/infrastructure/facility-09.jpg", caption: "Furnace Area", ratio: "landscape" },
  { src: "/media/infrastructure/facility-10.jpg", caption: "Finishing Line", ratio: "portrait" },
];

/* --------------------------------- stats -------------------------------- */

/* Values are strings, not numbers: the bar carries "24x7" next to "250", and
   nothing here is ever used in arithmetic. */
export const stats = [
  { value: "19", suffix: "+", label: "Years Experience", detail: "Established in 2006" },
  { value: "250", suffix: "+", label: "Skilled Workforce", detail: "Trades & operators" },
  { value: "24×7", suffix: "", label: "Plant Support", detail: "Round-the-clock response" },
  { value: "28", suffix: "", label: "Service Capabilities", detail: "Across six verticals" },
] as const;

/* ------------------------------- features ------------------------------- */

export type Feature = {
  title: string;
  description: string;
  icon: "expertise" | "infrastructure" | "quality" | "precision" | "delivery" | "custom";
};

export const features: Feature[] = [
  {
    title: "Established Experience Since 2006",
    description:
      "Nearly two decades of hands-on engineering at BALCO — delivering mechanical, fabrication, erection, civil and transportation services with proven reliability.",
    icon: "expertise",
  },
  {
    title: "Consistent Product Quality",
    description:
      "Every job follows documented quality plans with stage-wise inspections, material traceability and certified test reports retained for full accountability.",
    icon: "quality",
  },
  {
    title: "Reliable Engineering Solutions",
    description:
      "From concept to commissioning, our engineering team plans each project meticulously — ensuring solutions that perform under the most demanding industrial conditions.",
    icon: "precision",
  },
  {
    title: "In-house Manufacturing",
    description:
      "Our own fabrication yard, welding bays, machines and tooling mean critical work never leaves our control — faster turnaround, tighter quality.",
    icon: "infrastructure",
  },
  {
    title: "Customer-Focused Service",
    description:
      "We work as an extension of our clients' teams — understanding their processes, anticipating needs and adapting our approach to their schedules and priorities.",
    icon: "custom",
  },
  {
    title: "Timely Project Delivery",
    description:
      "Committed schedules backed by manpower planning, our own transport fleet and single-point project management that keeps every milestone on track.",
    icon: "delivery",
  },
];

/* -------------------------------- quality ------------------------------- */

export const qualityPoints = [
  {
    title: "Certified Processes",
    description: "Work planned and executed to ISO-aligned quality and safety systems, with documented procedures for every trade.",
  },
  {
    title: "Full Traceability",
    description: "Inspection records, material test certificates and job completion reports retained for every project, ensuring complete accountability.",
  },
  {
    title: "Safety-First Culture",
    description: "Trained crews, mandatory PPE compliance, daily toolbox talks and regular safety audits on every shift and every site.",
  },
  {
    title: "Skilled Manpower",
    description: "Certified welders, qualified riggers, experienced fitters and trained crane operators — all on our own rolls, not sub-contracted.",
  },
] as const;
