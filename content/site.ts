import type { Locale } from "@/lib/i18n";

const es = {
  meta: {
    title: "Bautista Tomás Alsina · Ingeniería en IA",
    description:
      "Portfolio de Bautista Tomás Alsina, estudiante de Ingeniería en Inteligencia Artificial en la UdeSA. Robots autónomos, modelos medibles y herramientas de uso diario.",
  },
  skip: "Saltar al contenido",
  nav: {
    projects: "Proyectos",
    about: "Sobre mí",
    contact: "Contacto",
    label: "Navegación principal",
    langLabel: "Idioma",
  },
  hero: {
    first: "BAUTISTA",
    second: "TOMÁS",
    third: "ALSINA",
    tagline: "Estudio Ingeniería en Inteligencia Artificial en la UdeSA.",
    chip: "3er puesto · Challenge JAR 2026",
    github: "GitHub",
    mail: "Mail",
    posterAlt: "El robot ROSMASTER X3 de TARS, visto en 3D",
    drag: "Arrastrá para rotar",
  },
  sections: {
    tars: "TARS",
    projects: "Proyectos",
    about: "Sobre mí",
    contact: "Contacto",
  },
  notFound: {
    title: "Esta zona no está en el mapa",
    body: "La página que buscás no existe o se movió.",
    back: "Volver al inicio",
  },
  footer: {
    built: "Hecho con Next.js y React Three Fiber",
  },
};

export type Site = DeepStr<typeof es>;
type DeepStr<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepStr<U>[]
    : { [K in keyof T]: DeepStr<T[K]> };

const en: Site = {
  meta: {
    title: "Bautista Tomás Alsina · AI Engineering",
    description:
      "Portfolio of Bautista Tomás Alsina, an Artificial Intelligence Engineering student at UdeSA. Autonomous robots, measurable models and everyday tools.",
  },
  skip: "Skip to content",
  nav: {
    projects: "Projects",
    about: "About",
    contact: "Contact",
    label: "Main navigation",
    langLabel: "Language",
  },
  hero: {
    first: "BAUTISTA",
    second: "TOMÁS",
    third: "ALSINA",
    tagline: "I study Artificial Intelligence Engineering at UdeSA.",
    chip: "3rd place · JAR Challenge 2026",
    github: "GitHub",
    mail: "Email",
    posterAlt: "The ROSMASTER X3 robot from TARS, shown in 3D",
    drag: "Drag to rotate",
  },
  sections: {
    tars: "TARS",
    projects: "Projects",
    about: "About",
    contact: "Contact",
  },
  notFound: {
    title: "This area is not on the map",
    body: "The page you are looking for does not exist or has moved.",
    back: "Back to start",
  },
  footer: {
    built: "Built with Next.js and React Three Fiber",
  },
};

export const site: Record<Locale, Site> = { es, en };

export const contact = {
  email: "hbato21@gmail.com",
  github: "https://github.com/AlsinaBautista",
  linkedin: "https://www.linkedin.com/in/bautista-alsina",
};

export const sectionIds = ["hero", "tars", "proyectos", "sobre-mi", "contacto"] as const;
export type SectionId = (typeof sectionIds)[number];
