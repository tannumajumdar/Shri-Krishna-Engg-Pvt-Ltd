# Shri Krishna Engineering Pvt. Ltd. — Landing Page

Frontend-only marketing site for Shri Krishna Engineering Pvt. Ltd., BALCO.
Next.js App Router · TypeScript · Tailwind CSS · Framer Motion · Lucide React.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Adding your media

Nothing is hardcoded. Every image and video path lives in the `media`,
`products`, `industries` and `facilities` exports of [`lib/site.ts`](lib/site.ts),
and the files themselves go in [`public/media/`](public/media/) — see
[`public/media/README.md`](public/media/README.md) for the full file list,
aspect ratios and encoding guidance.

Until a file exists, `<MediaImage>` renders a blueprint placeholder that names
the missing path, so the layout holds its shape while you gather assets. Drop
the file in with the expected name and it appears — no code change.

Background videos autoplay muted, loop, play inline, pause while off screen,
and fall back **video → poster → placeholder**. Visitors who have asked for
reduced motion get the poster and never download the video.

## Editing copy

All text — headings, product names, industries, stats, contact details, nav
links — is in [`lib/site.ts`](lib/site.ts). The components read from it, so
changing a product name or a phone number is a one-line edit in one file.

## Structure

```
app/
├── layout.tsx            fonts, metadata, Organization JSON-LD
├── page.tsx              section order
└── globals.css           design tokens, base styles, utilities

components/
├── Navbar.tsx            transparent over hero, solid on scroll, mobile sheet
├── Hero.tsx              full-screen video hero, parallax, line-by-line reveal
├── About.tsx             split layout, clip-path reveal, parallax plate
├── Stats.tsx             animated counters (light and dark variants)
├── ProductShowcase.tsx   product cards on a marquee
├── ImageMarquee.tsx      reusable infinite marquee
├── VideoBackground.tsx   reusable background video
├── IndustrialShowcase.tsx full-bleed parallax band
├── Industries.tsx        expanding panels on desktop, cards below
├── Infrastructure.tsx    two opposing gallery marquees
├── WhyChooseUs.tsx       six feature cards
├── QualitySection.tsx    split screen, quality and sustainability
├── CTA.tsx               closing call to action and contact channels
├── Footer.tsx            links, contact, socials, oversized wordmark
└── ui/                   Button, MediaImage, Reveal, SectionHeading, Logo,
                          SocialIcon, ThemeToggle

lib/
├── site.ts               all copy and media paths
└── utils.ts              cn(), wrap()
```

## Light / dark mode

The toggle lives in the navbar (and in the mobile sheet, since the bar's own
sits behind the overlay). First visit follows the OS setting; after that an
explicit choice is remembered in `localStorage` under `ske-theme`.

Themed colour lives in **semantic tokens**, not in `dark:` variants scattered
across components:

| Token | Light | Dark |
| --- | --- | --- |
| `surface` | white | `navy-900` |
| `surface-2` | `alu-50` | `navy-950` |
| `ink` / `ink-muted` / `ink-faint` | navy → alu greys | white → navy tints |
| `hairline` | `alu-200` | `navy-700` |

They are CSS variables in `globals.css` mapped to Tailwind colours, so
retuning the dark theme means editing one `.dark {}` block. Use
`bg-surface`/`text-ink` on anything that should follow the theme.

Sections that are dark in **both** themes — hero, products, the industry band,
infrastructure, quality, CTA, footer — deliberately keep literal `navy-*`
values. The page is meant to alternate light and dark bands; in dark mode that
rhythm becomes `navy-900` against `navy-950` rather than flattening into one
slab. If you add a section, decide which of the two kinds it is before
reaching for a colour.

Two things keep it flash-free, and both matter:

- An inline script in `app/layout.tsx` sets the class on `<html>` during HTML
  parse, before first paint. It must stay dependency-free, and its
  `"ske-theme"` key is duplicated in `ThemeToggle.tsx` — keep them in step.
- `ThemeToggle` and `Logo` are **stateless about the theme**. The icons, the
  button's accessible name and the logo variant are all chosen by CSS `dark:`
  rules. A `useState` would start from the server default and correct itself
  after hydration, which on a solid dark navbar means a frame of blue logo on
  navy — exactly what the inline script exists to avoid.

## Design system

Defined in [`tailwind.config.ts`](tailwind.config.ts), derived from the SKE mark:

- **navy** — built around the royal blue of the logo, which sits at `navy-600`
  (`#1B3A8B`). `navy-950` grounds the full-bleed dark sections.
- **accent** — the lime of the K (`#8CC63F` at `accent-500`), used sparingly on
  rules, counters and hover states. `accent-400` is the version for dark
  grounds; `accent-600` is darkened so it still holds contrast on white — use
  that one on light backgrounds rather than lightening the type.
- **alu** — brushed aluminium greys for body copy and hairlines
- **Sora** for display type, **Inter** for body, via `next/font`
- `ease-brand` (`cubic-bezier(.22,1,.36,1)`) on essentially every transition

The logo itself is not drawn in code — `components/ui/Logo.tsx` loads the real
artwork from `/public/media` and falls back to a slatted SKE monogram in the
brand colours until those files are in place. See
[`public/media/README.md`](public/media/README.md).

## Notes on the animation work

A few behaviours are load-bearing and worth knowing before editing:

- **`ImageMarquee`** lays the item set down three times and measures one period
  from the live track, so translating by that period lands on pixel-identical
  content and the wrap is invisible. It pauses on hover, idles while off
  screen, scales speed down on smaller viewports, and falls back to a plain
  swipeable row under reduced motion.
- **In-view triggers must sit on unclipped elements.** An element clipped to
  zero by its own `clip-path` reports no intersection, so a `whileInView` on it
  would wait forever on a reveal only it could start. `About.tsx` observes from
  the parent and clips the child — keep that split if you add similar reveals.
- **`MediaImage` re-reads the image on mount.** Markup is server-rendered, so a
  file can load or 404 before React hydrates; without that check a tile would
  strand in its loading state.

## Scope

Frontend only — no backend, database, auth or admin. The enquiry buttons open
the visitor's mail and phone clients using the details in `lib/site.ts`.
