import type { Locale } from "@/lib/i18n";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import Reveal from "@/components/ui/Reveal";
import ProjectList from "./ProjectList";
import type { ProjectItem } from "./types";

/** Sección de proyectos (estado: exploring; el contador de reportes sube con cada fila). */
export default function ProjectsSection({ locale }: { locale: Locale }) {
  const t = site[locale];
  const items: ProjectItem[] = projects.map((p) => ({
    slug: p.slug,
    short: p.short,
    title: p.title[locale],
    context: p.context[locale],
    summary: p.summary[locale],
    year: p.year,
    stack: p.stack,
    cover: p.cover,
    coverAlt: p.cover.alt[locale],
    href: `/${locale}/proyectos/${p.slug}`,
  }));
  return (
    <section
      id="proyectos"
      data-section="proyectos"
      aria-labelledby="proyectos-title"
      className="mx-auto max-w-[1600px] px-5 py-24 sm:px-10 lg:py-32"
    >
      <Reveal className="mb-12 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <h2 id="proyectos-title" className="title-section">
            {t.sections.projects}
          </h2>
        </div>
        <p className="max-w-md text-[17px] leading-snug text-tinta-2 lg:justify-self-end">{t.projects.intro}</p>
      </Reveal>
      <ProjectList items={items} reportedLabel={t.projects.reported} playLabel={t.detail.play} pauseLabel={t.detail.pause} />
    </section>
  );
}
