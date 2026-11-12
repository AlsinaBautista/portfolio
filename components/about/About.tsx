import type { Locale } from "@/lib/i18n";
import { site } from "@/content/site";
import Reveal from "@/components/ui/Reveal";
import Timeline from "./Timeline";
import Skills from "./Skills";

/** Sobre mí (estado: exploring). Bio, educación, experiencia y skills. */
export default function About({ locale }: { locale: Locale }) {
  const a = site[locale].about;
  return (
    <section
      id="sobre-mi"
      data-section="sobre-mi"
      aria-labelledby="sobre-title"
      className="mx-auto max-w-[1600px] px-5 py-24 sm:px-10 lg:py-32"
    >
      <div className="grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <Reveal>
          <p className="label text-tinta-2">{a.eyebrow}</p>
          <h2 id="sobre-title" className="title-section mt-4">
            {site[locale].sections.about}
          </h2>
          <p className="mt-8 max-w-xl text-[clamp(18px,1.7vw,20px)] leading-relaxed">{a.bio}</p>
        </Reveal>
        <div className="space-y-14">
          <Timeline
            heading={a.timelineTitle}
            entries={[
              { kind: a.education.title, title: a.education.degree, place: a.education.place, period: a.education.period, note: a.education.note },
              { kind: a.experience.title, title: a.experience.role, place: a.experience.place, period: a.experience.period },
            ]}
          />
          <Skills title={a.skillsTitle} groups={a.skills} />
        </div>
      </div>
    </section>
  );
}
