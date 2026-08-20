/**
 * Brand glyphs, drawn inline.
 *
 * lucide-react dropped its brand icon set at v1, and these four marks are
 * trademark artwork rather than UI icons — so they live here as paths instead
 * of being approximated with generic shapes.
 */
export type SocialName = "linkedin" | "x" | "facebook" | "youtube";

const PATHS: Record<SocialName, string> = {
  linkedin:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.71h.05c.53-.95 1.83-1.96 3.76-1.96C21.6 8.75 22 11.06 22 14.06V21h-4v-6.15c0-1.47-.03-3.36-2.06-3.36-2.06 0-2.38 1.6-2.38 3.25V21h-4V9Z",
  x: "M17.53 3h3.03l-6.62 7.57L21.75 21h-6.09l-4.77-6.24L5.42 21H2.39l7.08-8.09L2.25 3h6.24l4.31 5.7L17.53 3Zm-1.06 16.15h1.68L7.6 4.75H5.8l10.67 14.4Z",
  facebook:
    "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z",
  youtube:
    "M21.58 7.19a2.51 2.51 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42a2.51 2.51 0 0 0-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81a2.51 2.51 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42a2.51 2.51 0 0 0 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81ZM10 15.02V8.98L15.2 12 10 15.02Z",
};

export function SocialIcon({
  name,
  className,
}: {
  name: SocialName;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
