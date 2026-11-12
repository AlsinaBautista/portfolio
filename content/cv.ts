import type { Locale } from "@/lib/i18n";
import { contact, site } from "./site";

export type CvLink = { label: string; display: string; href: string };
export type CvEntry = {
  title: string;
  place?: string;
  period?: string;
  /** Marcador rojo chico (solo "3er puesto") */
  badge?: string;
  /** Una línea corta debajo del título */
  lead?: string;
  bullets: string[];
  href?: { display: string; url: string };
};
export type CvData = {
  name: string;
  headline: string;
  contacts: CvLink[];
  sections: { profile: string; education: string; projects: string; competitions: string; experience: string; skills: string; languages: string; interests: string };
  profile: string;
  education: CvEntry[];
  projects: CvEntry[];
  competitions: CvEntry[];
  experience: CvEntry[];
  skills: { group: string; items: string }[];
  languages: string;
  interests: string;
  /** Para el título del documento y el nombre del archivo */
  docTitle: string;
};

export const PORTFOLIO_HOST = "bautista-alsina.vercel.app";
export const cvFile = (locale: Locale) => `/cv/bautista-alsina-cv-${locale}.pdf`;

const links = (locale: Locale): CvLink[] => [
  { label: "email", display: contact.email, href: `mailto:${contact.email}` },
  { label: "GitHub", display: "github.com/AlsinaBautista", href: contact.github },
  { label: "LinkedIn", display: "linkedin.com/in/bautista-alsina", href: contact.linkedin },
  { label: "portfolio", display: PORTFOLIO_HOST, href: `https://${PORTFOLIO_HOST}/${locale}` },
];

const edu = (locale: Locale) => site[locale].about.education;

const es: CvData = {
  name: "Bautista Tomás Alsina",
  headline: "Estudiante de Ingeniería en Inteligencia Artificial · Buenos Aires, Argentina",
  contacts: links("es"),
  docTitle: "CV · Bautista Tomás Alsina",
  sections: {
    profile: "Perfil",
    education: "Educación",
    projects: "Proyectos",
    competitions: "Competencias",
    experience: "Experiencia",
    skills: "Skills",
    languages: "Idiomas",
    interests: "Intereses",
  },
  profile:
    "Estudiante de 2º año de Ingeniería en IA en la UdeSA. Me interesa la robótica y la IA aplicada, y aprendo construyendo: este año programé el módulo de misión del robot que salió 3º en la JAR 2026. Abierto a pasantías para 2027.",
  education: [
    {
      title: "Universidad de San Andrés",
      lead: "Ingeniería en Inteligencia Artificial",
      period: "2025 – actualidad",
      bullets: [...edu("es").facts.slice(0, 1), "Promedio 8,92 / 10, 6º de 87 en la carrera (a noviembre de 2026)"],
    },
    {
      title: "Colegio Nuestra Señora de Nueva Pompeya, Necochea",
      lead: "Secundario, egresado en 2024",
      bullets: ["Primer escolta", "Promedio general 9,84"],
    },
  ],
  projects: [
    {
      title: "TARS, robot autónomo de búsqueda y rescate",
      lead: "Challenge JAR 2026, equipo de 5",
      badge: "3er puesto",
      bullets: [
        "Diseñé e implementé el módulo de misión en ROS 2 / Python: la máquina de estados, la política de reportes por covarianza y la vuelta a la base por tramos sobre el costmap.",
        "En la clasificación quedamos 3º de 12 equipos, con 3 víctimas reportadas en 147 s a 2–10 cm de su centro.",
      ],
    },
    {
      title: "Académica",
      lead: "App de escritorio (Tauri/Rust + React) con tablet Android (Kotlin)",
      bullets: ["Tiene un tutor de voz con IA que mira la hoja, contesta en voz alta y dibuja sobre ella. La uso todos los días."],
    },
    {
      title: "Sitio de la Parroquia Madre de los Emigrantes",
      lead: "Next.js + Firebase, en producción",
      bullets: ["Tiene un panel de administración para que el personal lo edite."],
      href: { display: "santuarioemigrantes.org", url: "https://santuarioemigrantes.org/" },
    },
    {
      title: "Motor para el juego Y",
      lead: "MCTS con UCT + RAVE en Python",
      bullets: ["Quedó 6º de 45 en el ranking del curso."],
    },
    {
      title: "Semáforo adaptativo",
      lead: "YOLOv8 + RL multiagente (MAPPO)",
      bullets: ["Con una capa de seguridad en C++."],
    },
  ],
  competitions: [
    { title: "Olimpíada Matemática Ñandú", bullets: ["Instancia nacional en La Falda, Córdoba, en 2018 y 2019."] },
    { title: "Olimpíada Matemática Argentina (OMA) y torneos de geometría", bullets: ["Participé durante el secundario."] },
    { title: "Torneo Argentino de Programación (TAP)", period: "2025", bullets: ["Participante."] },
  ],
  experience: [
    {
      title: "Alumno colaborador",
      place: "Biblioteca UdeSA, Procesos Técnicos",
      period: "2026",
      bullets: ["Apoyo general al área: etiquetado de libros, carga de registros en el sistema de la biblioteca y planillas de control en Excel."],
    },
  ],
  skills: [
    { group: "Lenguajes", items: "Python, C/C++, TypeScript, Rust, Kotlin" },
    { group: "IA/ML", items: "PyTorch, scikit-learn, XGBoost, NumPy" },
    { group: "Robótica", items: "ROS 2, Nav2, OpenCV, Gazebo" },
    { group: "Herramientas", items: "Git, GitHub Actions, Docker, Firebase, pytest" },
  ],
  languages: "Español nativo · inglés intermedio-alto (B2, sin certificar)",
  interests: "Fútbol",
};

const en: CvData = {
  name: "Bautista Tomás Alsina",
  headline: "Artificial Intelligence Engineering student · Buenos Aires, Argentina",
  contacts: links("en"),
  docTitle: "Resume · Bautista Tomás Alsina",
  sections: {
    profile: "Profile",
    education: "Education",
    projects: "Projects",
    competitions: "Competitions",
    experience: "Experience",
    skills: "Skills",
    languages: "Languages",
    interests: "Interests",
  },
  profile:
    "2nd-year Artificial Intelligence Engineering student at UdeSA. I'm interested in robotics and applied AI, and I learn by building: this year I wrote the mission module of the robot that placed 3rd at JAR 2026. Open to internships for 2027.",
  education: [
    {
      title: "Universidad de San Andrés",
      lead: "Artificial Intelligence Engineering",
      period: "2025 – present",
      bullets: [...edu("en").facts.slice(0, 1), "GPA 8.92 / 10, ranked 6th of 87 in the program (as of November 2026)"],
    },
    {
      title: "Colegio Nuestra Señora de Nueva Pompeya, Necochea",
      lead: "High school, graduated 2024",
      bullets: ["Primer escolta (flag-escort honor for top grades)", "Overall GPA 9.84"],
    },
  ],
  projects: [
    {
      title: "TARS, autonomous search-and-rescue robot",
      lead: "Challenge JAR 2026, team of 5",
      badge: "3rd place",
      bullets: [
        "Designed and implemented the mission module in ROS 2 / Python: the state machine, the covariance-based report policy and the trip back to base in legs over the costmap.",
        "In qualification we placed 3rd of 12 teams, with 3 victims reported in 147 s, 2–10 cm from their center.",
      ],
    },
    {
      title: "Académica",
      lead: "Desktop app (Tauri/Rust + React) with an Android tablet app (Kotlin)",
      bullets: ["It has an AI voice tutor that looks at the page, answers out loud and draws on it. I use it every day."],
    },
    {
      title: "Website for the Parroquia Madre de los Emigrantes",
      lead: "Next.js + Firebase, in production",
      bullets: ["It has an admin panel so the staff can edit it."],
      href: { display: "santuarioemigrantes.org", url: "https://santuarioemigrantes.org/" },
    },
    {
      title: "Engine for the game Y",
      lead: "MCTS with UCT + RAVE in Python",
      bullets: ["Ranked 6th of 45 in the course ranking."],
    },
    {
      title: "Adaptive traffic light",
      lead: "YOLOv8 + multi-agent RL (MAPPO)",
      bullets: ["With a C++ safety layer."],
    },
  ],
  competitions: [
    { title: "Olimpíada Matemática Ñandú (math olympiad)", bullets: ["National round in La Falda, Córdoba, in 2018 and 2019."] },
    {
      title: "Olimpíada Matemática Argentina (OMA) (national math olympiad) and geometry tournaments",
      bullets: ["Took part during high school."],
    },
    { title: "Torneo Argentino de Programación (TAP) (national programming contest)", period: "2025", bullets: ["Participant."] },
  ],
  experience: [
    {
      title: "Student assistant",
      place: "UdeSA Library, Technical Processes",
      period: "2026",
      bullets: ["General support to the area: labeling books, entering records into the library system and Excel control sheets."],
    },
  ],
  skills: [
    { group: "Languages", items: "Python, C/C++, TypeScript, Rust, Kotlin" },
    { group: "AI/ML", items: "PyTorch, scikit-learn, XGBoost, NumPy" },
    { group: "Robotics", items: "ROS 2, Nav2, OpenCV, Gazebo" },
    { group: "Tools", items: "Git, GitHub Actions, Docker, Firebase, pytest" },
  ],
  languages: "Spanish (native) · English upper-intermediate (B2, not certified)",
  interests: "Football",
};

export const cv: Record<Locale, CvData> = { es, en };
