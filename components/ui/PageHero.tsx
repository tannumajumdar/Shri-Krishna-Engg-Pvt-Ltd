import { MediaImage } from "@/components/ui/MediaImage";

export type PageHeroFact = { label: string; value: string };

/**
 * The banner every page below the landing page opens with.
 *
 * Before this existed each inner page invented its own opening — the services
 * page had no band at all and started on a bare `pt-32`, the gallery carried a
 * hand-built one. A visitor moving between them had no way to tell they were
 * still on the same site. One component now fixes the height, the overlay, the
 * type scale and the optional fact strip, so every page arrives the same way.
 *
 * The contrast stack is the hero's, scaled down: the navy of the mark carries
 * the weight on the left behind the type, the lime of the K glows in off the
 * right shoulder, and the photograph is toned rather than buried under a slab.
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  intro,
  image,
  facts,
  focus = "50% 45%",
}: {
  eyebrow: string;
  /** Leading half of the heading, set in white. */
  title: string;
  /** Trailing half, set in the logo green. Omit for a single-tone heading. */
  accent?: string;
  intro?: string;
  image: string;
  /** Up to three figures along the foot. Omitted entirely when not passed. */
  facts?: readonly PageHeroFact[];
  /**
   * object-position for the frame. The band is around 3:1 on a wide screen
   * while the photographs run 1.3–1.8:1, so barely half of one is ever on
   * show — which half is a per-photograph decision, not something one default
   * can get right.
   */
  focus?: string;
}) {
  return (
    <section className="on-dark relative overflow-hidden bg-navy-950">
      {/* MediaImage hardcodes `relative` on its own wrapper and cn() is a plain
          join, not a class merger — passing `absolute` in leaves both on the
          element and the wrong one wins. The positioning goes on a wrapper. */}
      <div className="absolute inset-0" aria-hidden="true">
        <MediaImage
          src={image}
          alt=""
          className="h-full w-full"
          imgClassName="object-cover brightness-[0.86] contrast-[1.04]"
          imgStyle={{ objectPosition: focus }}
          sizes="100vw"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-navy-950/30" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/55 to-navy-950/45 lg:bg-gradient-to-r lg:from-navy-950/95 lg:via-navy-950/70 lg:to-navy-950/20"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(38%_55%_at_92%_50%,rgba(140,198,63,0.10),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-grid-fine opacity-[0.16]" aria-hidden="true" />
      <div
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950 to-transparent"
        aria-hidden="true"
      />

      <div className="container relative flex min-h-[26rem] flex-col justify-center pb-20 pt-[calc(var(--nav-h)+4.5rem)] lg:min-h-[30rem] lg:pb-24 lg:pt-[calc(var(--nav-h)+6rem)] xl:min-h-[34rem]">
        <p className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-accent-400 [text-shadow:0_1px_10px_rgba(7,15,34,0.9)]">
          <span className="h-px w-10 bg-accent-400" aria-hidden="true" />
          {eyebrow}
        </p>

        <h1 className="max-w-3xl font-display text-display-sm font-semibold uppercase leading-[1.05] tracking-tight text-white [text-shadow:0_2px_18px_rgba(7,15,34,0.75)]">
          {title}
          {accent && <span className="text-accent-400"> {accent}</span>}
        </h1>

        {intro && (
          /* The rule to the left of the standfirst, as the landing page sets it. */
          <div className="mt-7 flex max-w-xl gap-4">
            <span className="mt-1 w-[3px] shrink-0 self-stretch bg-accent-400" aria-hidden="true" />
            <p className="text-pretty text-[14.5px] leading-relaxed text-white/80 [text-shadow:0_1px_12px_rgba(7,15,34,0.85)]">{intro}</p>
          </div>
        )}

        {facts && facts.length > 0 && (
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[10px] uppercase tracking-label text-white/60 [text-shadow:0_1px_10px_rgba(7,15,34,0.9)]">
                  {fact.label}
                </dt>
                <dd className="mt-1 font-display text-[19px] font-semibold text-white [text-shadow:0_1px_12px_rgba(7,15,34,0.85)]">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
