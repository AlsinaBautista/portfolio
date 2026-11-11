import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { site } from "@/content/site";
import LocaleToggle from "./LocaleToggle";

export default function Nav({ locale }: { locale: Locale }) {
  const t = site[locale].nav;
  const link =
    "label text-tinta-2 transition-colors hover:text-pared";
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-desconocido/70 bg-libre/80 backdrop-blur-md">
      <nav
        aria-label={t.label}
        className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-10"
      >
        <Link href={`/${locale}`} className="label font-medium text-pared" aria-label="Bautista Tomás Alsina">
          BTA
        </Link>
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href={`/${locale}#proyectos`} className={link}>
            {t.projects}
          </Link>
          <Link href={`/${locale}#sobre-mi`} className={`${link} hidden min-[420px]:inline`}>
            {t.about}
          </Link>
          <LocaleToggle locale={locale} label={t.langLabel} />
        </div>
      </nav>
    </header>
  );
}
