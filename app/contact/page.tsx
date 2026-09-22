import type { Metadata } from "next";
import { Clock4, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import {
  company,
  contact as staticContact,
  whatsappLink,
} from "@/lib/site";
import { getContact, getSocialLinks } from "@/lib/content";

export const metadata: Metadata = {
  title: `Contact Us — ${company.legalName}`,
  description:
    "Reach Shree Krishna Engineering at Sector-5, BALCO Township, Korba, Chhattisgarh — for enquiries, quotations, plant visits and careers.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const [contact, socials] = await Promise.all([getContact(), getSocialLinks()]);

  return (
    <>
      <Navbar />
      <main id="main">
        <PageHero
          eyebrow="Contact Us"
          title="Tell us what the job"
          accent="needs."
          intro="Scope, site and timeline — send what you have and our team will come back within one working day. For a breakdown, call the number below; we run a 24×7 response desk."
          /* A true 1920px frame. The band runs full-bleed, so anything
             narrower gets upscaled across it — media.ctaPoster is 1280 and
             came out soft. */
          image="/media/hero/civil.jpg"
          focus="50% 52%"
          facts={[
            { label: "Response", value: "Within 1 working day" },
            { label: "Breakdown Desk", value: "24×7" },
            { label: "Base", value: "Korba, Chhattisgarh" },
          ]}
        />

        {/* ------------------------------ form + details ------------------- */}
        <section className="bg-surface-2 py-20 lg:py-28">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <Reveal>
                  <h2 className="font-display text-[26px] font-semibold uppercase leading-[1.1] tracking-tight text-ink">
                    Send an enquiry
                  </h2>
                  <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-ink-muted">
                    Fields marked with a star are required. Everything else helps us
                    route it to the right team faster.
                  </p>
                </Reveal>

                <Reveal delay={0.1} className="mt-8 block">
                  <ContactForm />
                </Reveal>
              </div>

              <div className="lg:col-span-5">
                <Reveal delay={0.06}>
                  <h2 className="font-display text-[26px] font-semibold uppercase leading-[1.1] tracking-tight text-ink">
                    Reach us directly
                  </h2>
                </Reveal>

                <Reveal delay={0.14}>
                  <dl className="mt-8 space-y-7">
                    <Detail icon={MapPin} label="Registered Office">
                      {contact.address.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </Detail>

                    <Detail icon={Phone} label="Phone">
                      <a href={contact.phoneHref} className="block hover:text-accent-600">
                        {contact.phone}
                      </a>
                      {staticContact.altPhones.map((p) => (
                        <a
                          key={p}
                          href={`tel:${p.replace(/\s/g, "")}`}
                          className="block hover:text-accent-600"
                        >
                          {p}
                        </a>
                      ))}
                    </Detail>

                    <Detail icon={Mail} label="Email">
                      <a href={contact.emailHref} className="block break-all hover:text-accent-600">
                        {contact.email}
                      </a>
                      <a
                        href={`mailto:${staticContact.altEmail}`}
                        className="block break-all hover:text-accent-600"
                      >
                        {staticContact.altEmail}
                      </a>
                    </Detail>

                    <Detail icon={Clock4} label="Office Hours">
                      <span className="block">{contact.hours}</span>
                      <span className="mt-1 block text-ink-faint">
                        Breakdown support runs round the clock.
                      </span>
                    </Detail>
                  </dl>
                </Reveal>

                <Reveal delay={0.2}>
                  <a
                    href={whatsappLink(
                      staticContact.whatsapp,
                      `Hello ${company.legalName}, I would like to discuss a requirement.`,
                    )}
                    className="mt-9 inline-flex items-center gap-2.5 rounded-md border border-hairline bg-surface px-5 py-3 text-[13px] font-semibold uppercase tracking-label text-ink transition-colors duration-300 ease-brand hover:border-accent-500 hover:text-accent-600"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    Chat on WhatsApp
                  </a>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------ careers -------------------------- */}
        {/* The navbar and footer have both pointed a "Careers" link at the
            contact anchor since launch, with nothing behind it. This is that
            destination — honest about what it is rather than a fake listings
            page. */}
        <section id="careers" className="scroll-mt-24 bg-surface py-20 lg:py-28">
          <div className="container">
            <SectionHeading
              eyebrow="Careers"
              title="Work on plant that runs."
              intro="We hire fitters, welders, riggers, supervisors and site engineers for the BALCO Rolled Product unit and our fabrication yard. There is no listings board — send your CV and the trade you work in, and we will call when something opens."
            />

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${contact.email}?subject=${encodeURIComponent("Job application")}`}
                  className="inline-flex items-center gap-2.5 rounded-md bg-accent-500 px-6 py-3 text-[13px] font-semibold uppercase tracking-label text-white transition-colors duration-500 ease-brand hover:bg-accent-600"
                >
                  <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  Email Your CV
                </a>
                <p className="text-[13px] text-ink-faint">
                  Mark the subject line with the trade you are applying for.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer contact={contact} socials={socials} />
      <WhatsAppFloat />
    </>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <Icon
        className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent-600"
        strokeWidth={1.6}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <dt className="text-[11px] font-semibold uppercase tracking-label text-ink-faint">
          {label}
        </dt>
        <dd className="mt-2 space-y-0.5 text-[14px] leading-relaxed text-ink-muted">
          {children}
        </dd>
      </div>
    </div>
  );
}
