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
  hud: {
    label: "Estado de la misión",
    time: "t",
    reports: "reportes",
    waiting: "esperando el mapa",
  },
  tars: {
    eyebrow: "Caso destacado",
    openDetail: "Ver el caso completo",
    stackLabel: "Stack",
    replayTitle: "Corrida 2 de clasificación",
    replayCaption:
      "La traza es la pose que estimó la localización del robot durante la corrida, sobre el mapa que publicó el juez. Los cuadrados rojos son los reportes.",
    replayHint: "Scrolleá para avanzar la corrida",
    replayReport: "reporte",
    replayStart: "inicio",
    replayArena: "arena de 3.5 × 7.7 m",
    videoLabel: "El robot real en la arena",
  },
  projects: {
    eyebrow: "Proyectos",
    intro: "Lo que construí en la facultad y por mi cuenta. Cada fila es un reporte.",
    reported: "reportado",
    open: "Ver proyecto",
    year: "Año",
  },
  detail: {
    back: "Volver a proyectos",
    context: "Contexto",
    stack: "Stack",
    links: "Enlaces",
    noRepo: "Sin repositorio público",
    gallery: "Galería",
    next: "Siguiente proyecto",
    play: "Reproducir",
    pause: "Pausar",
    metrics: "Números",
    tarsArch: "Arquitectura",
    topics: "topics",
    tarsReplay: "Replay de la corrida 2",
  },
  about: {
    eyebrow: "Sobre mí",
    bio: "Soy Bautista. Estudio Ingeniería en Inteligencia Artificial en la Universidad de San Andrés. Me interesa la IA que funciona fuera de la pantalla: robots que navegan solos, modelos cuyos errores se pueden medir y herramientas que uso todos los días. En 2026 programé el módulo de misión de TARS, el robot de búsqueda y rescate con el que salimos terceros en el Challenge JAR. Estoy abierto a pasantías para 2027.",
    timelineTitle: "Trayectoria",
    education: {
      title: "Educación",
      degree: "Ingeniería en Inteligencia Artificial",
      place: "Universidad de San Andrés",
      period: "2025 – actualidad",
      note: "2º año",
    },
    experience: {
      title: "Experiencia",
      role: "Alumno colaborador",
      place: "Biblioteca UdeSA · Procesos Técnicos",
      period: "2026",
    },
    skillsTitle: "Skills",
    skills: [
      { group: "IA / ML", items: ["Python", "NumPy", "scikit-learn", "XGBoost", "PyTorch", "MCTS"] },
      { group: "Robótica", items: ["ROS 2", "Nav2", "OpenCV", "Gazebo"] },
      { group: "Software", items: ["TypeScript", "React", "Next.js", "C/C++", "Rust (Tauri)", "Kotlin"] },
      {
        group: "Herramientas",
        items: ["Git", "GitHub Actions", "Docker", "Firebase", "pytest", "Agentes de IA (Claude Code, Codex)"],
      },
    ],
  },
  contact: {
    eyebrow: "Contacto",
    title: "¿Hablamos?",
    lead: "Busco una pasantía para 2027. Escribime o mirá el código en GitHub.",
    copy: "Copiar mail",
    copied: "Mail copiado",
    copyHint: "hbato21@gmail.com",
    github: "GitHub",
    linkedin: "LinkedIn",
    returning: "volviendo a la base",
    checking: "verificando",
    done: "/done publicado",
    trailLabel: "Traza de vuelta al punto de inicio",
  },
  tarsDetail: {
    archTopics: "topics oficiales y /jar/ propios",
    mine: "mi parte",
    map: "/map",
    sensors: "LiDAR · IMU",
    camera: "cámara · LiDAR",
    verdicts: "/victimas · /done",
    cmd: "/cmd_vel",
    archLabel: "Diagrama de la arquitectura de TARS: seis nodos y Nav2 con sus topics",
    policy: { obs: "observaciones", sigma: "σ peor caso", dist: "distancia al reporte anterior", reported: "reportado", prev: "reporte anterior · 0.40 m" },
    ring: { box: "caja", points: "12 puntos de inspección", radius: "radio 0.8 m" },
    legs: { leg: "tramo", base: "base", max: "tramos de hasta 5 m", far: "robot" },
    budget: { used: "Presupuesto usado", returning: "returning", end: "fin de la corrida", report: "reporte", unused: "sin usar" },
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
  hud: {
    label: "Mission state",
    time: "t",
    reports: "reports",
    waiting: "waiting for the map",
  },
  tars: {
    eyebrow: "Featured case",
    openDetail: "Read the full case",
    stackLabel: "Stack",
    replayTitle: "Qualification run 2",
    replayCaption:
      "The trail is the pose the robot's localization estimated during the run, drawn on the map the judge published. The red squares are the reports.",
    replayHint: "Scroll to advance the run",
    replayReport: "report",
    replayStart: "start",
    replayArena: "3.5 × 7.7 m arena",
    videoLabel: "The real robot in the arena",
  },
  projects: {
    eyebrow: "Projects",
    intro: "What I built for college and on my own. Each row is a report.",
    reported: "reported",
    open: "View project",
    year: "Year",
  },
  detail: {
    back: "Back to projects",
    context: "Context",
    stack: "Stack",
    links: "Links",
    noRepo: "No public repository",
    gallery: "Gallery",
    next: "Next project",
    play: "Play",
    pause: "Pause",
    metrics: "Numbers",
    tarsArch: "Architecture",
    topics: "topics",
    tarsReplay: "Run 2 replay",
  },
  about: {
    eyebrow: "About",
    bio: "I'm Bautista, an Artificial Intelligence Engineering student at Universidad de San Andrés. I like AI that works off the screen: robots that navigate on their own, models whose mistakes you can measure, and tools I use every day. In 2026 I wrote the mission module for TARS, the search-and-rescue robot that took our team to 3rd place at the JAR Challenge. I'm open to internships for 2027.",
    timelineTitle: "Timeline",
    education: {
      title: "Education",
      degree: "Artificial Intelligence Engineering",
      place: "Universidad de San Andrés",
      period: "2025 – present",
      note: "2nd year",
    },
    experience: {
      title: "Experience",
      role: "Student assistant",
      place: "UdeSA Library · Technical Processes",
      period: "2026",
    },
    skillsTitle: "Skills",
    skills: [
      { group: "AI / ML", items: ["Python", "NumPy", "scikit-learn", "XGBoost", "PyTorch", "MCTS"] },
      { group: "Robotics", items: ["ROS 2", "Nav2", "OpenCV", "Gazebo"] },
      { group: "Software", items: ["TypeScript", "React", "Next.js", "C/C++", "Rust (Tauri)", "Kotlin"] },
      {
        group: "Tools",
        items: ["Git", "GitHub Actions", "Docker", "Firebase", "pytest", "AI agents (Claude Code, Codex)"],
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Shall we talk?",
    lead: "I'm looking for an internship for 2027. Write to me or have a look at the code on GitHub.",
    copy: "Copy email",
    copied: "Email copied",
    copyHint: "hbato21@gmail.com",
    github: "GitHub",
    linkedin: "LinkedIn",
    returning: "returning to base",
    checking: "checking",
    done: "/done published",
    trailLabel: "Trail back to the start point",
  },
  tarsDetail: {
    archTopics: "official and own /jar/ topics",
    mine: "my part",
    map: "/map",
    sensors: "LiDAR · IMU",
    camera: "camera · LiDAR",
    verdicts: "/victimas · /done",
    cmd: "/cmd_vel",
    archLabel: "Diagram of TARS's architecture: six nodes plus Nav2 and their topics",
    policy: { obs: "observations", sigma: "worst-case σ", dist: "distance to previous report", reported: "reported", prev: "previous report · 0.40 m" },
    ring: { box: "box", points: "12 inspection points", radius: "radius 0.8 m" },
    legs: { leg: "leg", base: "base", max: "legs of up to 5 m", far: "robot" },
    budget: { used: "Budget used", returning: "returning", end: "end of run", report: "report", unused: "unused" },
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
