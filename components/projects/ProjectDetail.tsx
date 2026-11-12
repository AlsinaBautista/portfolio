import { ViewTransition } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { site } from "@/content/site";
import { allProjects, type Project } from "@/content/projects";
import Chip from "@/components/ui/Chip";
import Reveal from "@/components/ui/Reveal";
import ReportMarker from "@/components/ui/ReportMarker";
import MediaView from "./MediaView";
import SemaforoDiagram from "./SemaforoDiagram";

/** Página de detalle genérica; `extras` va después de los números (lo usa /proyectos/tars). */
export default function ProjectDetail({
  project,
  locale,
  extras,
}: {
  project: Project;
  locale: Locale;
  extras?: React.ReactNode;
}) {
  const t = site[locale];
  const idx = allProjects.findIndex((p) => p.slug === project.slug);
  const next = allProjects[(idx + 1) % allProjects.length];
  const linkCls =
    "label inline-flex items-center gap-2 border-b border-pared pb-0.5 hover:border-tinta-2 hover:text-tinta-2";

  return (
    <article className="mx-auto max-w-[1200px] px-5 pb-24 pt-28 sm:px-10">
      <Link href={`/${locale}#proyectos`} className="label inline-flex items-center gap-2 text-tinta-2 hover:text-pared">
        <span aria-hidden>←</span> {t.detail.back}
      </Link>

      <header className="mt-10">
        <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-tinta-2">
          <ReportMarker /> {t.projects.reported} · {project.context[locale]} · {project.year}
        </p>
        <h1 className="mt-5">
          <span aria-hidden className="title-section block" data-title-short={project.slug}>
            {project.short}
          </span>
          <span className="mt-4 block max-w-3xl text-[clamp(24px,3.4vw,36px)] font-bold leading-tight">
            {project.name[locale]}
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-[20px] leading-snug text-tinta-2">{project.summary[locale]}</p>
      </header>

      <ViewTransition name={`cover-${project.slug}`} share="morph">
      <div className="mt-10" data-cover={project.slug}>
        {project.diagram === "semaforo" ? (
          <SemaforoDiagram t={t.semaforo} />
        ) : (
          <MediaView
            media={project.cover}
            locale={locale}
            priority
            sizes="(min-width: 1200px) 1100px, 100vw"
            playLabel={t.detail.play}
            pauseLabel={t.detail.pause}
            className={project.cover.height > project.cover.width ? "mx-auto max-w-md" : ""}
          />
        )}
      </div>
      </ViewTransition>

      <div className="mt-14 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="max-w-2xl space-y-5 text-[17px] leading-relaxed">
          {project.body.map((p, i) => (
            <Reveal as="p" key={i} delay={0.05 * i}>
              {p[locale]}
            </Reveal>
          ))}
        </div>

        <aside className="space-y-8">
          {project.facts.length > 0 && (
            <div>
              <h2 className="label text-tinta-2">{t.detail.metrics}</h2>
              <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-pared pt-5">
                {project.facts.map((f) => (
                  <li key={f.value}>
                    <p className="font-mono text-[28px] font-medium leading-none tabular-nums">{f.value}</p>
                    <p className="mt-2 text-[13px] leading-snug text-tinta-2">{f.label[locale]}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h2 className="label text-tinta-2">{t.detail.stack}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li key={s}>
                  <Chip>{s}</Chip>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="label text-tinta-2">{t.detail.links}</h2>
            {project.links.length > 0 ? (
              <ul className="mt-3 flex flex-col items-start gap-3">
                {project.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                      {l.label[locale]} <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[15px] text-tinta-2">{t.detail.noRepo}</p>
            )}
          </div>
        </aside>
      </div>

      {extras}

      {project.gallery.length > 0 && (
        <section className="mt-20 border-t border-pared pt-8">
          <h2 className="text-[clamp(22px,2.6vw,28px)] font-bold leading-tight">{t.detail.gallery}</h2>
          <ul className="mt-8 grid grid-cols-2 items-start gap-4 md:grid-cols-3">
            {project.gallery.map((m, i) => (
              <Reveal as="li" key={m.src} delay={0.04 * i} className={m.type === "image" && m.width > m.height * 1.3 && project.gallery.length < 5 ? "col-span-2" : ""}>
                <figure className="m-0">
                  <MediaView
                    media={m}
                    locale={locale}
                    sizes="(min-width: 768px) 33vw, 50vw"
                    mode="controls"
                    playLabel={t.detail.play}
                    pauseLabel={t.detail.pause}
                  />
                  <figcaption className="mt-2 text-[13px] leading-snug text-tinta-2">{m.alt[locale]}</figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      <nav aria-label={t.detail.next} className="mt-24 border-t border-pared pt-8">
        <p className="label text-tinta-2">{t.detail.next}</p>
        <Link
          href={`/${locale}/proyectos/${next.slug}`}
          className="title-section mt-3 inline-block hover:text-tinta-2"
        >
          {next.short}
        </Link>
      </nav>
    </article>
  );
}
