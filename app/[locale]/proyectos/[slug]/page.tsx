import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/lib/i18n";
import { getProject, projectSlugs } from "@/content/projects";
import ProjectDetail from "@/components/projects/ProjectDetail";
import TarsExtras from "@/components/tars/TarsExtras";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return locales.flatMap((locale) => projectSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(locale) || !project) return {};
  const title = project.title[locale];
  return {
    title,
    description: project.summary[locale],
    alternates: {
      canonical: `/${locale}/proyectos/${slug}`,
      languages: { es: `/es/proyectos/${slug}`, en: `/en/proyectos/${slug}`, "x-default": `/es/proyectos/${slug}` },
    },
    openGraph: { title, description: project.summary[locale], type: "article", url: `/${locale}/proyectos/${slug}` },
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(locale) || !project) notFound();
  return (
    <ProjectDetail
      project={project}
      locale={locale}
      extras={slug === "tars" ? <TarsExtras locale={locale} /> : undefined}
    />
  );
}
