import type { Media } from "@/content/projects";

/** Datos de un proyecto ya resueltos al idioma: es lo que viaja al cliente. */
export type ProjectItem = {
  slug: string;
  short: string;
  title: string;
  context: string;
  summary: string;
  year: string;
  stack: string[];
  cover: Media;
  coverAlt: string;
  href: string;
};
