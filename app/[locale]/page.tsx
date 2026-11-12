import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/lib/i18n";
import { site } from "@/content/site";
import Hero from "@/components/hero/Hero";
import TarsFeature from "@/components/tars/TarsFeature";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = site[locale];
  return (
    <>
      <Hero locale={locale} />
      <TarsFeature locale={locale} />
      <section id="proyectos" data-section="proyectos" className="min-h-[60dvh] px-5 py-24 sm:px-10">
        <h2 className="title-section">{t.sections.projects}</h2>
      </section>
      <section id="sobre-mi" data-section="sobre-mi" className="min-h-[60dvh] px-5 py-24 sm:px-10">
        <h2 className="title-section">{t.sections.about}</h2>
      </section>
      <section id="contacto" data-section="contacto" className="min-h-[60dvh] px-5 py-24 sm:px-10">
        <h2 className="title-section">{t.sections.contact}</h2>
      </section>
    </>
  );
}
