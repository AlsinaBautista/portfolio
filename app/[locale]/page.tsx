import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/lib/i18n";
import { site } from "@/content/site";
import DecodeText from "@/components/ui/DecodeText";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = site[locale];
  return (
    <>
      <section id="hero" data-section="hero" className="relative flex min-h-dvh items-end px-5 pb-16 pt-28 sm:px-10">
        <div>
          <h1 className="font-display-dot text-hero">
            <DecodeText className="block whitespace-nowrap" text={t.hero.first} delay={600} />
            <DecodeText className="block whitespace-nowrap" text={t.hero.second} delay={750} />
            <DecodeText className="block whitespace-nowrap" text={t.hero.third} delay={900} />
          </h1>
          <p className="mt-6 max-w-md text-s20">{t.hero.tagline}</p>
        </div>
      </section>
      <section id="tars" data-section="tars" className="min-h-[60dvh] px-5 py-24 sm:px-10">
        <h2 className="title-section">{t.sections.tars}</h2>
      </section>
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
