import type { MetadataRoute } from "next";
import { locales, siteUrl } from "@/lib/i18n";
import { projectSlugs } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...projectSlugs.map((s) => `/proyectos/${s}`)];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
      },
    })),
  );
}
