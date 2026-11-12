import type { Locale } from "@/lib/i18n";
import { contact, site } from "@/content/site";
import Reveal from "@/components/ui/Reveal";
import CopyEmail from "./CopyEmail";
import ReturnToBase from "./ReturnToBase";

/** Contacto: la vuelta a la base (returning -> checking -> finished). */
export default function Contact({ locale }: { locale: Locale }) {
  const c = site[locale].contact;
  const link =
    "label inline-flex items-center gap-2 border-b border-pared pb-0.5 hover:border-tinta-2 hover:text-tinta-2";
  return (
    <section
      id="contacto"
      data-section="contacto"
      aria-labelledby="contacto-title"
      className="mx-auto min-h-[85dvh] max-w-[1600px] px-5 pb-28 pt-24 sm:px-10 lg:pt-32"
    >
      <Reveal>
        <h2 id="contacto-title" className="title-section">
          {c.title}
        </h2>
        <p className="mt-6 max-w-lg text-[clamp(18px,1.7vw,20px)] leading-relaxed">{c.lead}</p>
        <div className="mt-10">
          <CopyEmail email={contact.email} label={c.copy} doneLabel={c.copied} />
        </div>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          <a href={contact.github} target="_blank" rel="noopener noreferrer" className={link}>
            {c.github} <span aria-hidden>↗</span>
          </a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={link}>
            {c.linkedin} <span aria-hidden>↗</span>
          </a>
        </div>
      </Reveal>
      <ReturnToBase labels={c} />
    </section>
  );
}
