import type { Locale } from "@/lib/i18n";

export type L = { es: string; en: string };

export type MediaImage = {
  type: "image";
  src: string;
  width: number;
  height: number;
  alt: L;
};
export type MediaVideo = {
  type: "video";
  /** Ruta sin extensión: se sirven {src}.mp4 y {src}.webm, con póster {src}-poster.webp */
  src: string;
  width: number;
  height: number;
  alt: L;
};
export type Media = MediaImage | MediaVideo;

export type Project = {
  slug: string;
  /** Nombre corto en mayúsculas para el título en Doto */
  short: string;
  year: string;
  context: L;
  title: L;
  /** Título sin el prefijo del nombre corto: es el h1 de la página de detalle, debajo del nombre en Doto */
  name: L;
  /** Una frase para la lista y para la metadata */
  summary: L;
  /** Párrafos del detalle */
  body: L[];
  facts: { value: string; label: L }[];
  stack: string[];
  links: { label: L; href: string }[];
  /** Si hay diagrama animado, la página de detalle lo muestra en lugar de la portada (la portada es su captura estática) */
  diagram?: "semaforo";
  /** Media que aparece en la fila / vista previa */
  cover: Media;
  /** Resto de la galería del detalle */
  gallery: Media[];
};

const img = (src: string, width: number, height: number, es: string, en: string): MediaImage => ({
  type: "image",
  src: `/media/${src}`,
  width,
  height,
  alt: { es, en },
});
const vid = (src: string, width: number, height: number, es: string, en: string): MediaVideo => ({
  type: "video",
  src: `/media/${src}`,
  width,
  height,
  alt: { es, en },
});

export const tars: Project = {
  slug: "tars",
  short: "TARS",
  year: "2026",
  context: {
    es: "Challenge JAR 2026 · trabajo en equipo de 5 integrantes",
    en: "JAR Challenge 2026 · team of 5",
  },
  title: {
    es: "TARS: robot autónomo de búsqueda y rescate",
    en: "TARS: autonomous search-and-rescue robot",
  },
  name: { es: "Robot autónomo de búsqueda y rescate", en: "Autonomous search-and-rescue robot" },
  summary: {
    es: "Un robot que explora un laberinto que nunca vio, encuentra las cajas rojas, las reporta y vuelve a la base. Yo programé el módulo de misión.",
    en: "A robot that explores a maze it has never seen, finds the red boxes, reports them and drives back to base. I wrote the mission module.",
  },
  body: [
    {
      es: "El Challenge JAR 2026 (Jornada Argentina de Robótica, Rosario, del 3 al 6 de noviembre) lo organizó el AIR Club UdeSA. Cada equipo tenía 10 minutos, un ROSMASTER X3 y un mapa que recién llegaba cuando arrancaba el reloj. Fuimos un equipo de 5 integrantes y era el primer proyecto de ROS de todos.",
      en: "The JAR Challenge 2026 (Jornada Argentina de Robótica, Rosario, November 3 to 6) was organized by AIR Club UdeSA. Each team got 10 minutes, a ROSMASTER X3 and a map that only arrived when the clock started. We were a team of 5 and it was everyone's first ROS project.",
    },
    {
      es: "Mi parte fue el módulo de misión: la máquina de estados, la política de reportes, la vuelta a la base y la integración de los demás nodos.",
      en: "My part was the mission module: the state machine, the report policy, the trip back to base and the integration of the other nodes.",
    },
  ],
  facts: [
    { value: "3º", label: { es: "puesto en la final, con la mayor cantidad de víctimas encontradas", en: "place in the final, with the most victims found" } },
    { value: "3 / 12", label: { es: "equipos en la clasificación", en: "teams in qualification" } },
    { value: "3 en 147 s", label: { es: "víctimas reportadas a 2–10 cm del centro", en: "victims reported 2–10 cm from the center" } },
    { value: "600+", label: { es: "tests", en: "tests" } },
    { value: "3", label: { es: "semanas de trabajo", en: "weeks of work" } },
  ],
  stack: ["ROS 2 Humble", "Python", "Nav2", "OpenCV", "Gazebo", "pytest", "GitHub Actions"],
  links: [
    {
      label: { es: "Código en GitHub", en: "Code on GitHub" },
      href: "https://github.com/AlsinaBautista/jar-challenge-2026",
    },
  ],
  cover: vid("tars/run1-loop", 464, 832, "TARS sale de la base y explora el laberinto en la primera corrida de clasificación, visto desde arriba y acelerado 4×", "TARS leaves the base and explores the maze in the first qualification run, seen from above and sped up 4×"),
  gallery: [
    vid("tars/final-run", 320, 456, "El robot real recorriendo el laberinto de la final", "The real robot driving through the final's maze"),
    img("tars/start-circle.webp", 1200, 1600, "El robot en su círculo de salida, antes de arrancar", "The robot on its start circle, before the run"),
    img("tars/arena-qualification.webp", 640, 853, "La arena de clasificación vista desde arriba", "The qualification arena seen from above"),
    img("tars/sim-maze.webp", 810, 766, "Corrida en el simulador sobre el laberinto de práctica", "Simulator run on the practice maze"),
    img("tars/team.webp", 1400, 1050, "El equipo con los diplomas del 3er puesto", "The team with the 3rd place diplomas"),
  ],
};

/** Contenido propio de /proyectos/tars */
export const tarsDetail = {
  arch: {
    title: { es: "Seis nodos y Nav2", en: "Six nodes plus Nav2" },
    intro: {
      es: "Los nodos se hablan solo por los topics oficiales y por topics propios bajo /jar/. La lógica de cuentas vive en módulos de Python puros, probados con pytest sin ROS.",
      en: "The nodes talk only through the official topics and our own /jar/ topics. The math lives in plain Python modules tested with pytest, no ROS needed.",
    },
    nodes: [
      { id: "loc", name: { es: "Localización", en: "Localization" }, role: { es: "¿dónde estoy?", en: "where am I?" } },
      { id: "det", name: { es: "Detección", en: "Detection" }, role: { es: "caja roja a punto del mapa", en: "red box to map point" } },
      { id: "fus", name: { es: "Fusión", en: "Fusion" }, role: { es: "observaciones a candidatas", en: "observations to candidates" } },
      { id: "cob", name: { es: "Cobertura", en: "Coverage" }, role: { es: "desde dónde mirar", en: "where to look from" } },
      { id: "mis", name: { es: "Misión", en: "Mission" }, role: { es: "¿qué sigue? ¿reporto?", en: "what now? report?" } },
      { id: "nav", name: { es: "Navegación", en: "Navigation" }, role: { es: "Nav2: MPPI y Smac 2D", en: "Nav2: MPPI and Smac 2D" } },
    ],
  },
  explainers: {
    title: { es: "Tres decisiones de la misión", en: "Three mission decisions" },
    policy: {
      title: { es: "Política de reportes", en: "Report policy" },
      body: {
        es: "Un candidato se reporta solo si cumple las tres condiciones. Un reporte equivocado cuesta una víctima y el bono de velocidad.",
        en: "A candidate is reported only if it meets all three conditions. A wrong report costs a victim and the speed bonus.",
      },
      rules: [
        { es: "al menos 5 observaciones", en: "at least 5 observations" },
        { es: "σ en el peor caso de 0.10 m o menos", en: "worst-case σ of 0.10 m or less" },
        { es: "a 0.40 m o más de cualquier reporte anterior", en: "0.40 m or more from any earlier report" },
      ],
    },
    ring: {
      title: { es: "Anillo de inspección", en: "Inspection ring" },
      body: {
        es: "Cuando un candidato no está claro, el robot lo mira desde 12 puntos a 0.8 m de la caja y suma observaciones desde mejores lugares.",
        en: "When a candidate is unclear, the robot looks at it from 12 points 0.8 m from the box and adds observations from better spots.",
      },
    },
    legs: {
      title: { es: "Vuelta por tramos", en: "Return in legs" },
      body: {
        es: "Para volver, la misión hace una búsqueda BFS sobre el costmap y parte el camino en tramos de hasta 5 m. Si un tramo falla, el siguiente sale desde donde quedó el robot.",
        en: "To return, the mission runs a BFS over the costmap and splits the path into legs of up to 5 m. If one leg fails, the next one starts from where the robot stopped.",
      },
    },
  },
  budget: {
    title: { es: "Los 10 minutos de la corrida 2", en: "The 10 minutes of run 2" },
    body: {
      es: "Los tres reportes salieron antes de los 2:30. A los 7:29 la misión pasó a returning y empezó la vuelta por tramos. Al final el robot quedó frenado contra una pared y no llegó a la base.",
      en: "All three reports were out before 2:30. At 7:29 the mission switched to returning and started the trip back in legs. At the end the robot got stuck against a wall and did not reach the base.",
    },
  },
  video: {
    title: { es: "La corrida completa, a 16×", en: "The full run, at 16×" },
    caption: {
      es: "La primera corrida de clasificación (4/11), seis minutos y medio acelerados: sale de la base, recorre el laberinto y vuelve.",
      en: "The first qualification run (Nov 4), six and a half minutes sped up: it leaves the base, covers the maze and comes back.",
    },
  },
  lesson: {
    title: { es: "Lo que salió mal en la final", en: "What went wrong in the final" },
    body: [
      {
        es: "El mapa de la final venía con una resolución más fina que el de práctica y el de clasificación. Nuestro tiempo de planificación crece con la cantidad de celdas y no lo habíamos previsto: el robot pasó unos 3 minutos planificando, exploró sin ver ninguna víctima y después se quedó quieto 60 s mientras volvía a planificar, que es lo que termina una corrida.",
        en: "The final's map came with a finer resolution than the practice and qualification maps. Our planning time grows with the number of cells and we had not planned for that: the robot spent about 3 minutes planning, explored without seeing a victim, and then stood still for 60 s while it planned again, which ends a run.",
      },
      {
        es: "En la segunda corrida, por el tercer puesto, el mapa tuvo la resolución de siempre. El robot arrancó enseguida, reportó 2 víctimas y volvió a la base. Terminamos terceros y con más víctimas encontradas que cualquier otro equipo de la final.",
        en: "In the second run, for third place, the map had the usual resolution. The robot started at once, reported 2 victims and drove back to base. We finished third, with more victims found than any other team in the final.",
      },
      {
        es: "Lo que me llevo: el tiempo de planificación necesita un tope duro que no dependa de la resolución del mapa, por ejemplo planificando en una grilla más gruesa, y el robot nunca puede quedarse quieto mientras piensa.",
        en: "What I take from it: planning time needs a hard limit that does not depend on the map's resolution, for example planning on a coarser grid, and the robot must never stand still while it thinks.",
      },
    ],
  },
};

export const projects: Project[] = [
  {
    slug: "academica",
    short: "ACADÉMICA",
    year: "2026",
    context: { es: "Personal · la uso todos los días", en: "Personal · I use it every day" },
    title: { es: "Académica: app de facultad con tutor de voz", en: "Académica: a college app with a voice tutor" },
    name: { es: "App de facultad con tutor de voz", en: "A college app with a voice tutor" },
    summary: {
      es: "App de escritorio que ordena la cursada y tiene un tutor que mira la hoja, contesta en voz alta y dibuja sobre la página.",
      en: "A desktop app that organizes my courses, with a tutor that looks at the page, answers out loud and draws on it.",
    },
    body: [
      {
        es: "Es una app de escritorio para macOS hecha con Tauri, Rust y React. Junta la cursada: qué tengo hoy, cuándo es cada parcial, cuánto me falta para aprobar.",
        en: "A desktop app for macOS built with Tauri, Rust and React. It brings the semester together: what I have today, when each exam is, how far I am from passing.",
      },
      {
        es: "El tutor de voz mira la hoja, contesta en voz alta y dibuja sobre la página con un láser, subrayados y fórmulas escritas a mano. También se puede escribir a mano en una tablet Android (Kotlin y Compose) y el trazo aparece en la compu.",
        en: "The voice tutor looks at the page, answers out loud and draws on it with a laser pointer, underlines and handwritten formulas. You can also write by hand on an Android tablet (Kotlin and Compose) and the strokes show up on the computer.",
      },
      {
        es: "Tiene un servidor MCP local para que la IA pueda leer mis notas y dibujos. Medí al tutor con errores sembrados a propósito: detectó errores en 6 de 10 páginas.",
        en: "It has a local MCP server so the AI can read my notes and drawings. I measured the tutor with errors planted on purpose: it caught errors in 6 of 10 pages.",
      },
    ],
    facts: [
      { value: "6 / 10", label: { es: "páginas con errores sembrados detectados", en: "pages with planted errors caught" } },
    ],
    stack: ["Tauri", "Rust", "React", "TypeScript", "Kotlin", "Jetpack Compose", "MCP"],
    links: [],
    cover: vid("academica/promo", 1280, 720, "Promo de Académica: calendario, tutor de voz y escritura a mano", "Académica promo: calendar, voice tutor and handwriting"),
    gallery: [
      img("academica/still-tutor.webp", 1400, 788, "El tutor corrigiendo una derivada con un resaltado", "The tutor correcting a derivative with a highlight"),
      img("academica/still-tablet.webp", 1400, 788, "Escritura a mano en la tablet que aparece en la compu", "Handwriting on the tablet showing up on the computer"),
      img("academica/still-hoy.webp", 1400, 788, "La pantalla de hoy con las clases del día", "The today screen with the day's classes"),
      img("academica/fig-histograma.webp", 736, 480, "Histograma dibujado a mano por el tutor", "Histogram hand-drawn by the tutor"),
      img("academica/fig-red.webp", 736, 492, "Red neuronal dibujada a mano por el tutor", "Neural network hand-drawn by the tutor"),
    ],
  },
  {
    slug: "parroquia",
    short: "PARROQUIA",
    year: "2025",
    context: { es: "Personal · en producción", en: "Personal · in production" },
    title: { es: "Sitio de la Parroquia Madre de los Emigrantes", en: "Website for the Parroquia Madre de los Emigrantes" },
    name: { es: "Sitio de la Parroquia Madre de los Emigrantes", en: "Website for the Parroquia Madre de los Emigrantes" },
    summary: {
      es: "El sitio de una parroquia de Buenos Aires, con un panel para que el personal lo edite sin necesitar un desarrollador.",
      en: "The website of a parish in Buenos Aires, with an admin panel so the staff can edit it without a developer.",
    },
    body: [
      {
        es: "Es el sitio público de la parroquia y está en producción. Lo armé con Next.js 15 y Firebase (Firestore, Auth, Storage y Functions), y los mails salen por SendGrid.",
        en: "It is the parish's public website and it is in production. I built it with Next.js 15 and Firebase (Firestore, Auth, Storage and Functions), and emails go out through SendGrid.",
      },
      {
        es: "Tiene un panel de administración para que el personal edite contenido sin un desarrollador, con analíticas, y está traducido a 4 idiomas.",
        en: "It has an admin panel so the staff can edit content without a developer, with analytics, and it is translated into 4 languages.",
      },
    ],
    facts: [{ value: "4", label: { es: "idiomas", en: "languages" } }],
    stack: ["Next.js 15", "TypeScript", "Firebase", "Firestore", "SendGrid"],
    links: [{ label: { es: "Ver el sitio", en: "Visit the site" }, href: "https://santuarioemigrantes.org/" }],
    cover: img("parroquia/sitio.webp", 1400, 875, "Página de servicios del sitio de la parroquia", "Services page of the parish website"),
    gallery: [
      img("parroquia/fachada.webp", 960, 540, "Fachada del santuario con banderas", "Front of the sanctuary with flags"),
      img("parroquia/iglesia.webp", 640, 542, "La iglesia vista desde la calle", "The church seen from the street"),
    ],
  },
  {
    slug: "motor-y",
    short: "MOTOR Y",
    year: "2026",
    context: { es: "Fundamentos de la IA · TP1", en: "Foundations of AI · TP1" },
    title: { es: "Motor para el juego Y: MCTS + RAVE", en: "An engine for the game Y: MCTS + RAVE" },
    name: { es: "Motor de MCTS + RAVE para el juego Y", en: "An MCTS + RAVE engine for the game Y" },
    summary: {
      es: "Un agente que juega al Y con búsqueda de árbol Monte Carlo. Quedó 6º de 45 en el ranking provisional.",
      en: "An agent that plays the game Y using Monte Carlo tree search. It ranked 6th of 45 in the provisional ranking.",
    },
    body: [
      {
        es: "Para el TP1 de Fundamentos de la Inteligencia Artificial escribí un agente para el juego Y, de unas 1.550 líneas. Usa MCTS con UCT y RAVE, una tabla de transposición y simetrías del tablero.",
        en: "For the first assignment of Foundations of Artificial Intelligence I wrote an agent for the game Y, about 1,550 lines. It uses MCTS with UCT and RAVE, a transposition table and board symmetries.",
      },
      {
        es: "En el ranking provisional de la cátedra, calculado con TrueSkill, quedó 6º entre 45. El torneo final es aparte, así que ese número puede cambiar.",
        en: "In the course's provisional ranking, computed with TrueSkill, it placed 6th out of 45. The final tournament is separate, so that number may change.",
      },
    ],
    facts: [
      { value: "6º / 45", label: { es: "ranking provisional (TrueSkill)", en: "provisional ranking (TrueSkill)" } },
      { value: "~1.550", label: { es: "líneas de Python", en: "lines of Python" } },
    ],
    stack: ["Python", "MCTS", "UCT", "RAVE", "TrueSkill"],
    links: [],
    cover: img("fia/tablero.webp", 482, 472, "Tablero triangular del juego Y a mitad de partida", "Triangular board of the game Y mid-game"),
    gallery: [],
  },
  {
    slug: "pca-montecarlo",
    short: "PCA",
    year: "2026",
    context: { es: "Inferencia y Estimación · TP1", en: "Inference and Estimation · TP1" },
    title: { es: "PCA y Monte Carlo en PneumoniaMNIST", en: "PCA and Monte Carlo on PneumoniaMNIST" },
    name: { es: "PCA y Monte Carlo en PneumoniaMNIST", en: "PCA and Monte Carlo on PneumoniaMNIST" },
    summary: {
      es: "Comprimo radiografías de tórax con PCA y mido cuánto aguanta un clasificador cuando las imágenes se rotan al azar.",
      en: "I compress chest X-rays with PCA and measure how well a classifier holds up when the images are randomly rotated.",
    },
    body: [
      {
        es: "Comprimo radiografías de tórax con PCA y entreno una regresión logística sobre las componentes. Después la pongo a prueba con una simulación de Monte Carlo: roto las imágenes al azar y miro cuánta exactitud pierde.",
        en: "I compress chest X-rays with PCA and train a logistic regression on the components. Then I stress-test it with a Monte Carlo simulation: I rotate the images at random and see how much accuracy it loses.",
      },
      {
        es: "El repo incluye los gráficos de exactitud contra la cantidad de componentes, la proyección en las dos primeras componentes y la convergencia de la simulación.",
        en: "The repo includes the plots of accuracy against the number of components, the projection on the first two components and the convergence of the simulation.",
      },
    ],
    facts: [],
    stack: ["Python", "NumPy", "scikit-learn", "PCA", "Monte Carlo"],
    links: [
      {
        label: { es: "Código en GitHub", en: "Code on GitHub" },
        href: "https://github.com/AlsinaBautista/pca-montecarlo-pneumonia",
      },
    ],
    cover: img("inferencia/pca-scatter.webp", 1000, 748, "Radiografías proyectadas en las dos primeras componentes principales", "X-rays projected on the first two principal components"),
    gallery: [img("inferencia/accuracy-vs-k.webp", 1000, 658, "Exactitud contra la cantidad de componentes", "Accuracy against the number of components")],
  },
  {
    slug: "bloons-td",
    short: "BLOONS TD",
    year: "2025",
    context: { es: "Pensamiento Computacional 2025 · grupal", en: "Computational Thinking 2025 · group project" },
    title: { es: "Bloons TD en Pygame", en: "Bloons TD in Pygame" },
    name: { es: "Juego de defensa de torres en Pygame", en: "A tower defense game in Pygame" },
    summary: {
      es: "Un juego de defensa de torres hecho desde cero, con 50 rondas, 4 tipos de torre y mejoras.",
      en: "A tower defense game built from scratch, with 50 rounds, 4 tower types and upgrades.",
    },
    body: [
      {
        es: "Fue el trabajo final de Pensamiento Computacional, en grupo. Empezamos la materia casi sin saber programar y lo terminamos con un juego completo en Python.",
        en: "It was the final project of Computational Thinking, done as a group. We started the course knowing almost no programming and finished it with a complete game in Python.",
      },
      {
        es: "No usamos motor de juego: escribimos el bucle principal, los enemigos, las torres, los proyectiles, las rondas, la economía y la tienda con arrastrar y soltar. Hay 4 tipos de torre con mejoras de hasta 3 niveles y 50 rondas.",
        en: "We did not use a game engine: we wrote the main loop, enemies, towers, projectiles, rounds, economy and a drag-and-drop shop. There are 4 tower types with up to 3 upgrade levels and 50 rounds.",
      },
    ],
    facts: [
      { value: "50", label: { es: "rondas", en: "rounds" } },
      { value: "4", label: { es: "tipos de torre", en: "tower types" } },
    ],
    stack: ["Python", "Pygame"],
    links: [
      {
        label: { es: "Código en GitHub", en: "Code on GitHub" },
        href: "https://github.com/AlsinaBautista/Bloons-TD-game-with-pygame",
      },
    ],
    cover: img("bloons/gameplay.webp", 992, 532, "Primera ronda del juego con dos torres y globos en el camino", "First round of the game with two towers and balloons on the path"),
    gallery: [],
  },
  {
    slug: "semaforo",
    short: "SEMÁFORO",
    year: "2026",
    context: { es: "Personal", en: "Personal" },
    title: { es: "Semáforo adaptativo: YOLOv8 + RL multiagente", en: "Adaptive traffic light: YOLOv8 + multi-agent RL" },
    name: { es: "Tráfico adaptativo con YOLOv8 y RL multiagente", en: "Adaptive traffic control with YOLOv8 and multi-agent RL" },
    summary: {
      es: "Control de tráfico con visión en el borde y aprendizaje por refuerzo, donde una capa determinista en C++ tiene la última palabra.",
      en: "Traffic control with edge vision and reinforcement learning, where a deterministic C++ layer has the final say.",
    },
    body: [
      {
        es: "Un semáforo es un sistema donde un fallo de software puede lastimar a alguien, así que el diseño gira alrededor de una regla: la IA nunca maneja las luces. El agente solo pide una fase y una máquina de estados determinista en C++ decide qué se muestra.",
        en: "A traffic light is a system where a software failure can hurt someone, so the design is built around one rule: the AI never drives the lights. The agent only requests a phase and a deterministic C++ state machine decides what is shown.",
      },
      {
        es: "El borde detecta y cuenta vehículos con YOLOv8 sobre ONNX Runtime. El agente es MAPPO sobre Ray RLlib, entrenado en SUMO, y un coordinador sincroniza ondas verdes entre intersecciones por MQTT. Si el modelo, el broker o la cámara fallan, la intersección vuelve a un ciclo fijo seguro. Las invariantes de la capa de seguridad se prueban con tests de propiedades.",
        en: "The edge detects and counts vehicles with YOLOv8 on ONNX Runtime. The agent is MAPPO on Ray RLlib, trained in SUMO, and a coordinator syncs green waves between intersections over MQTT. If the model, the broker or the camera fails, the intersection falls back to a safe fixed cycle. The safety layer's invariants are checked with property tests.",
      },
    ],
    facts: [],
    stack: ["C++17", "Python", "YOLOv8", "ONNX Runtime", "MAPPO", "Ray RLlib", "SUMO", "MQTT", "Flutter"],
    links: [
      {
        label: { es: "Código en GitHub", en: "Code on GitHub" },
        href: "https://github.com/AlsinaBautista/semaforo",
      },
    ],
    cover: img("semaforo/arquitectura.webp", 1600, 560, "Diagrama de la arquitectura: cámara, YOLOv8, agente MAPPO, capa de seguridad en C++ y luces", "Architecture diagram: camera, YOLOv8, MAPPO agent, C++ safety layer and lights"),
    diagram: "semaforo",
    gallery: [],
  },
];

export const allProjects: Project[] = [tars, ...projects];

export function getProject(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}

export const projectSlugs = allProjects.map((p) => p.slug);

export function t(l: L, locale: Locale): string {
  return l[locale];
}
