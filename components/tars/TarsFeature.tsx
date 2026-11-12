import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { getRunData } from "@/lib/runData";
import { site } from "@/content/site";
import { tars } from "@/content/projects";
import Chip from "@/components/ui/Chip";
import Reveal from "@/components/ui/Reveal";
import Video from "@/components/ui/Video";
import ReportMarker from "@/components/ui/ReportMarker";
import ReportOnView from "@/components/hud/ReportOnView";
import RunReplay from "./RunReplay";

/** Caso destacado (estado: exploring). Mapa con replay a la izquierda, texto y métricas a la derecha. */
export default function TarsFeature({ locale }: { locale: Locale }) {
  const t = site[locale];
  const data = getRunData();
  const labels = {
    title: t.tars.replayTitle,
    hint: t.tars.replayHint,
    report: t.tars.replayReport,
    start: t.tars.replayStart,
    arena: t.tars.replayArena,
    caption: t.tars.replayCaption,
    reports: t.hud.reports,
    run: t.tars.replayRun,
    summary:
      locale === "es"
        ? `Mapa de la arena (${t.tars.replayArena}) con la traza del robot en la corrida 2 de clasificación. Hay 3 reportes, a los ${data.reportes.map((r) => r.t.toFixed(1)).join(", ")} segundos, cada uno a menos de 10 cm del centro de la caja.`
        : `Map of the arena (${t.tars.replayArena}) with the robot's trail in qualification run 2. There are 3 reports, at ${data.reportes.map((r) => r.t.toFixed(1)).join(", ")} seconds, each less than 10 cm from the box's center.`,
  };
  const cover = tars.cover.type === "video" ? tars.cover : null;
  const photo = tars.gallery.find((m) => m.type === "image" && m.src.includes("start-circle"));

  return (
    <section
      id="tars"
      data-section="tars"
      aria-labelledby="tars-title"
      className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-x-12 gap-y-10 px-5 py-24 sm:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:py-32"
    >
      <div className="lg:col-start-2 lg:row-start-1">
        <Reveal>
          <p className="label flex items-center gap-2 text-tinta-2">
            <ReportMarker /> <ReportOnView id="tars" /> {t.tars.eyebrow} · 2026
          </p>
          <h2 id="tars-title" className="title-section mt-4">
            {t.sections.tars}
          </h2>
          <h3 className="mt-5 max-w-xl text-[clamp(22px,2.6vw,28px)] font-bold leading-tight">{tars.title[locale]}</h3>
          <p className="label mt-3 text-tinta-2">{tars.context[locale]}</p>
        </Reveal>
        <div className="mt-6 max-w-xl space-y-4 text-[16px] leading-relaxed">
          {tars.body.map((p, i) => (
            <Reveal key={i} as="p" delay={0.05 * i}>
              {p[locale]}
            </Reveal>
          ))}
        </div>
      </div>

      <RunReplayWrapper data={data} labels={labels} />

      <div className="lg:col-start-2 lg:row-start-2">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-7 border-t border-pared pt-6 sm:grid-cols-3">
          {tars.facts.map((f, i) => (
            <Reveal as="li" key={f.value} delay={0.05 * i} className={i === 0 ? "col-span-2 sm:col-span-3" : ""}>
              <p className="font-mono text-[clamp(20px,6vw,28px)] font-medium leading-none tracking-tight tabular-nums whitespace-nowrap">{f.value}</p>
              <p className="label mt-2 max-w-[18rem] text-[11px] normal-case leading-snug tracking-normal text-tinta-2">
                {f.label[locale]}
              </p>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-10 grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-4">
          {cover && (
            <figure className="m-0">
              <Video
                src={cover.src}
                width={cover.width}
                height={cover.height}
                label={cover.alt[locale]}
                mode="loop"
                playLabel={t.detail.play}
                pauseLabel={t.detail.pause}
              />
              <figcaption className="label mt-2 text-[11px] text-tinta-2">{t.tars.videoLabel}</figcaption>
            </figure>
          )}
          {photo && photo.type === "image" && (
            <figure className="relative m-0 overflow-hidden bg-desconocido">
              <Image
                src={photo.src}
                alt={photo.alt[locale]}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1024px) 22vw, 50vw"
                className="h-full w-full object-cover"
              />
            </figure>
          )}
        </Reveal>

        <Reveal className="mt-8">
          <p className="label text-tinta-2">{t.tars.stackLabel}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {tars.stack.map((s) => (
              <li key={s}>
                <Chip>{s}</Chip>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href={`/${locale}/proyectos/tars`}
              className="label inline-flex items-center gap-2 border-b border-pared pb-0.5 hover:border-tinta-2 hover:text-tinta-2"
            >
              {t.tars.openDetail} <span aria-hidden>→</span>
            </Link>
            {tars.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="label inline-flex items-center gap-2 border-b border-pared pb-0.5 hover:border-tinta-2 hover:text-tinta-2"
              >
                {l.label[locale]} <span aria-hidden>↗</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function RunReplayWrapper({ data, labels }: { data: ReturnType<typeof getRunData>; labels: React.ComponentProps<typeof RunReplay>["labels"] }) {
  return (
    <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:flex lg:flex-col">
      <RunReplay data={data} labels={labels} />
    </div>
  );
}
