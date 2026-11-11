import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fontVars } from "@/lib/fonts";
import { hasLocale, locales, siteUrl } from "@/lib/i18n";
import { site } from "@/content/site";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import OccupancyBackdrop from "@/components/map/OccupancyBackdrop";
import MissionHud from "@/components/hud/MissionHud";
import { allProjects } from "@/content/projects";
import "../globals.css";

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = site[locale].meta;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.title, template: "%s · Bautista Tomás Alsina" },
    description: t.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { es: "/es", en: "/en", "x-default": "/es" },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      type: "website",
      locale: locale === "es" ? "es_AR" : "en_US",
      url: `/${locale}`,
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.description },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = site[locale];
  return (
    <html lang={locale} className={fontVars}>
      <body className="min-h-dvh">
        <a
          href="#contenido"
          className="label fixed left-4 top-4 z-[100] -translate-y-24 bg-pared px-3 py-2 text-libre focus:translate-y-0"
        >
          {t.skip}
        </a>
        <SmoothScroll />
        <OccupancyBackdrop />
        <Nav locale={locale} />
        <main id="contenido">{children}</main>
        <Footer locale={locale} />
        <MissionHud labels={t.hud} total={allProjects.length} />
      </body>
    </html>
  );
}
