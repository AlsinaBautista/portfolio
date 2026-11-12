import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { contact, site } from "@/content/site";
import { cvFile } from "@/content/cv";
import DecodeText from "@/components/ui/DecodeText";
import Chip from "@/components/ui/Chip";
import RobotStage from "./RobotStage";

/** Hero (waiting_for_map -> exploring): el texto va primero para no frenar el LCP. */
export default function Hero({ locale }: { locale: Locale }) {
  const t = site[locale].hero;
  const link =
    "label inline-flex items-center gap-2 border-b border-pared pb-0.5 text-pared transition-colors hover:border-tinta-2 hover:text-tinta-2";
  return (
    <section
      id="hero"
      data-section="hero"
      className="relative mx-auto grid min-h-dvh max-w-[1600px] grid-cols-1 content-center gap-x-10 gap-y-8 px-5 pb-24 pt-24 sm:px-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:pb-16"
    >
      <div className="min-w-0">
        <h1 className="font-display-dot text-hero">
          <DecodeText className="block whitespace-nowrap" text={t.first} delay={600} />
          <DecodeText className="block whitespace-nowrap" text={t.second} delay={760} />
          <DecodeText className="block whitespace-nowrap" text={t.third} delay={920} />
        </h1>
      </div>

      <div className="order-last lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <RobotStage alt={t.posterAlt} hint={t.drag} />
      </div>

      <div className="min-w-0 lg:col-start-1 lg:row-start-2">
        <p className="max-w-[28rem] text-[clamp(18px,1.6vw,20px)] leading-snug">{t.tagline}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Chip tone="solid">
            <span aria-hidden className="inline-block h-1.5 w-1.5 bg-libre" />
            {t.chip}
          </Chip>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          <Link href={contact.github} className={link} target="_blank" rel="noopener noreferrer">
            {t.github} <span aria-hidden>↗</span>
          </Link>
          <Link href={`mailto:${contact.email}`} className={link}>
            {t.mail} <span aria-hidden>→</span>
          </Link>
          <a href={cvFile(locale)} download className={link} data-testid="hero-cv">
            {site[locale].cv.short} <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
