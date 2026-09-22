/* ---------------------------------------------------------------------------
 * Gallery photography.
 *
 * Extracted from the Sahbhagita Milap event decks the Rolled Product team runs
 * at BALCO. Each shot keeps the event it belongs to, so the page can group and
 * filter by date rather than presenting one undifferentiated wall of images.
 * ------------------------------------------------------------------------ */

export type GalleryEvent = {
  /** Slug used by the filter control. */
  id: string;
  label: string;
  /** Long form, shown on the tile caption. */
  date: string;
};

export const galleryEvents: GalleryEvent[] = [
  { id: "jul-2026", label: "03 Jul 2026", date: "Sahbhagita Milap · 3 July 2026" },
  { id: "may-2026", label: "26 May 2026", date: "Sahbhagita Milap · 26 May 2026" },
  { id: "apr-2026", label: "07 Apr 2026", date: "Sahbhagita Milap · 7 April 2026" },
];

export type GalleryPhoto = {
  src: string;
  alt: string;
  event: string;
};

/** The hero band behind the page title. */
export const galleryHero = "/media/gallery/gallery-hero.jpg";

export const galleryPhotos: GalleryPhoto[] = [
  { src: "/media/gallery/g-01.jpg", alt: "The Rolled Product team gathered on the shop floor", event: "apr-2026" },
  { src: "/media/gallery/g-02.jpg", alt: "Crew seated for the Sahbhagita Milap address", event: "jul-2026" },
  { src: "/media/gallery/g-03.jpg", alt: "Shop floor manpower gathering", event: "jul-2026" },
  { src: "/media/gallery/g-04.jpg", alt: "Team member addressing the gathering", event: "jul-2026" },
  { src: "/media/gallery/g-05.jpg", alt: "Sharing the shift's achievements with the floor", event: "jul-2026" },
  { src: "/media/gallery/g-06.jpg", alt: "Speaking to the assembled crew", event: "jul-2026" },
  { src: "/media/gallery/g-07.jpg", alt: "Reward and recognition handover", event: "jul-2026" },
  { src: "/media/gallery/g-08.jpg", alt: "Recognising a best-shift achievement", event: "jul-2026" },
  { src: "/media/gallery/g-09.jpg", alt: "Award presented for an LLF observation closure", event: "jul-2026" },
  { src: "/media/gallery/g-10.jpg", alt: "Recognition for preventive maintenance performance", event: "jul-2026" },
  { src: "/media/gallery/g-11.jpg", alt: "Team members receiving their awards", event: "jul-2026" },
  { src: "/media/gallery/g-12.jpg", alt: "Award handover on the shop floor", event: "jul-2026" },
  { src: "/media/gallery/g-13.jpg", alt: "Crew seated for the May gathering", event: "may-2026" },
  { src: "/media/gallery/g-14.jpg", alt: "Recognition at the Rolled Product panel area", event: "may-2026" },
  { src: "/media/gallery/g-15.jpg", alt: "Award presented to the downstream team", event: "may-2026" },
  { src: "/media/gallery/g-16.jpg", alt: "Recognising the operations crew", event: "may-2026" },
  { src: "/media/gallery/g-17.jpg", alt: "Electrical team receiving recognition", event: "may-2026" },
  { src: "/media/gallery/g-18.jpg", alt: "Mechanical team award handover", event: "may-2026" },
  { src: "/media/gallery/g-19.jpg", alt: "Recognition for innovation on the line", event: "may-2026" },
  { src: "/media/gallery/g-20.jpg", alt: "Awards presented to the maintenance crew", event: "may-2026" },
  { src: "/media/gallery/g-21.jpg", alt: "Team recognised for shift performance", event: "may-2026" },
  { src: "/media/gallery/g-22.jpg", alt: "Award handover during the April event", event: "apr-2026" },
  { src: "/media/gallery/g-23.jpg", alt: "Foundry team receiving recognition", event: "apr-2026" },
  { src: "/media/gallery/g-24.jpg", alt: "Recognising the downstream operations team", event: "apr-2026" },
];
