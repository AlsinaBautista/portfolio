import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/lib/i18n";
import Hero from "@/components/hero/Hero";
import TarsFeature from "@/components/tars/TarsFeature";
import ProjectsSection from "@/components/projects/ProjectsSection";
import About from "@/components/about/About";
import Contact from "@/components/contact/Contact";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return (
    <>
      <Hero locale={locale} />
      <TarsFeature locale={locale} />
      <ProjectsSection locale={locale} />
      <About locale={locale} />
      <Contact locale={locale} />
    </>
  );
}
