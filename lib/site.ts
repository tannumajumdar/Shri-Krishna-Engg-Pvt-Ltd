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
  tagline: "Mechanical · Fabrication · Erection · Civil · Transportation.",
  established: 1999,
} as const;

export const contact = {
  address: [
    "Shri Krishna Engineering",
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
    "Hello Shri Krishna Engineering,",
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

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#products" },
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
  logo: "/media/logo.png",
  logoLight: "/media/logo-light.png",

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
 * Our services, grouped by trade — the six things Shri Krishna Engineering
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

export const stats = [
  { value: 25, suffix: "+", label: "Years in Engineering", detail: "Since 1999" },
  { value: 250, suffix: "+", label: "Skilled Workforce", detail: "Trades & operators" },
  { value: 500, suffix: "+", label: "Jobs Delivered", detail: "Mechanical to civil" },
  { value: 6, suffix: "", label: "Service Verticals", detail: "Under one roof" },
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
      "Site and design engineers who plan the job before mobilising, not after.",
    icon: "expertise",
  },
  {
    title: "In-house Fabrication",
    description:
      "Our own fabrication yard, machines and tools — critical work is never sub-let.",
    icon: "infrastructure",
  },
  {
    title: "Quality Assurance",
    description:
      "Documented checks at every stage, with inspection records kept for every job.",
    icon: "quality",
  },
  {
    title: "Safety First",
    description:
      "Safety and quality is our first priority — the standard we hold on every site.",
    icon: "precision",
  },
  {
    title: "Reliable Delivery",
    description:
      "Committed schedules backed by planning, manpower and our own transport fleet.",
    icon: "delivery",
  },
  {
    title: "Turnkey Execution",
    description:
      "Single-point responsibility from foundation to erection and commissioning.",
    icon: "custom",
  },
];

/* -------------------------------- quality ------------------------------- */

export const qualityPoints = [
  {
    title: "Certified Processes",
    description: "Work planned and executed to ISO-aligned quality and safety systems.",
  },
  {
    title: "Full Traceability",
    description: "Inspection records, test certificates and job reports retained for every job.",
  },
  {
    title: "Safety-First Culture",
    description: "Trained crews, PPE discipline and toolbox talks on every shift.",
  },
  {
    title: "Skilled Manpower",
    description: "Certified welders, riggers, fitters and operators on our own rolls.",
  },
] as const;
