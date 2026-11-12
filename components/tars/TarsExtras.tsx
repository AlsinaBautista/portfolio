import type { Locale } from "@/lib/i18n";
import { site } from "@/content/site";
import { tarsDetail } from "@/content/projects";
import { getRunData } from "@/lib/runData";
import Reveal from "@/components/ui/Reveal";
import Video from "@/components/ui/Video";
import ArchDiagram from "./ArchDiagram";
import BudgetBar from "./BudgetBar";
import PolicyExplainer from "./explainers/PolicyExplainer";
import RingExplainer from "./explainers/RingExplainer";
import LegsExplainer from "./explainers/LegsExplainer";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-20 border-t border-pared pt-8">
      <Reveal>
        <h2 className="text-[clamp(22px,2.6vw,28px)] font-bold leading-tight">{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

/** Contenido propio de /proyectos/tars: arquitectura, tres decisiones, presupuesto, video y lo que salió mal. */
export default function TarsExtras({ locale }: { locale: Locale }) {
  const t = site[locale];
  const d = tarsDetail;
  const td = t.tarsDetail;
  const run = getRunData();
  const returnAt = run.estados.find((e) => e.a === "returning")?.t ?? 448.6;

  const cards = [
    {
      key: "policy",
      title: d.explainers.policy.title[locale],
      body: d.explainers.policy.body[locale],
      extra: (
        <ul className="mt-3 space-y-1 font-mono text-[12px] leading-snug">
          {d.explainers.policy.rules.map((r) => (
            <li key={r.en} className="flex gap-2">
              <span aria-hidden>·</span>
              {r[locale]}
            </li>
          ))}
        </ul>
      ),
      viz: <PolicyExplainer labels={td.policy} />,
    },
    {
      key: "ring",
      title: d.explainers.ring.title[locale],
      body: d.explainers.ring.body[locale],
      extra: null,
      viz: <RingExplainer labels={td.ring} />,
    },
    {
      key: "legs",
      title: d.explainers.legs.title[locale],
      body: d.explainers.legs.body[locale],
      extra: null,
      viz: <LegsExplainer labels={td.legs} />,
    },
  ];

  return (
    <>
      <Block title={d.arch.title[locale]}>
        <Reveal>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed">{d.arch.intro[locale]}</p>
        </Reveal>
        <div className="mt-8">
          <ArchDiagram
            nodes={d.arch.nodes.map((n) => ({ id: n.id, name: n.name[locale], role: n.role[locale] }))}
            topics={td.archTopics}
            mine={td.mine}
            label={td.archLabel}
            extra={{ map: td.map, sensors: td.sensors, camera: td.camera, verdicts: td.verdicts, cmd: td.cmd }}
          />
        </div>
      </Block>

      <Block title={d.explainers.title[locale]}>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal as="li" key={c.key} delay={0.08 * i} className="flex flex-col border border-desconocido bg-libre/70 p-5">
              <h3 className="text-[18px] font-bold leading-tight">{c.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed">{c.body}</p>
              {c.extra}
              <div className="mt-auto pt-5">{c.viz}</div>
            </Reveal>
          ))}
        </ul>
      </Block>

      <Block title={d.budget.title[locale]}>
        <Reveal>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed">{d.budget.body[locale]}</p>
        </Reveal>
        <BudgetBar duration={run.duracion} reports={run.reportes} returnAt={returnAt} labels={td.budget} />
      </Block>

      <Block title={d.video.title[locale]}>
        <div className="mt-6 grid items-start gap-6 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
          <Video
            src="/media/tars/run1-x16"
            width={464}
            height={832}
            label={d.video.title[locale]}
            mode="loop"
            playLabel={t.detail.play}
            pauseLabel={t.detail.pause}
            className="max-w-[280px]"
          />
          <p className="max-w-md text-[15px] leading-relaxed text-tinta-2">{d.video.caption[locale]}</p>
        </div>
      </Block>

      <Block title={d.lesson.title[locale]}>
        <div className="mt-5 max-w-2xl space-y-4 text-[16px] leading-relaxed">
          {d.lesson.body.map((p, i) => (
            <Reveal as="p" key={i} delay={0.05 * i}>
              {p[locale]}
            </Reveal>
          ))}
        </div>
      </Block>
    </>
  );
}
