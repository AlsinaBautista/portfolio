# Plan: portfolio de Bautista Tomás Alsina

## Objetivo

Un sitio de una página, más una página de detalle por proyecto. Tiene que convencer a quien busca pasantes para 2027 de que Bautista hace sistemas de IA que funcionan fuera de la pantalla. La acción principal es que le escriban por mail o vayan a su GitHub.

## Decisiones cerradas

- **Stack:** Next.js (App Router, última estable) + TypeScript + Tailwind v4, con deploy en Vercel en el dominio gratis `*.vercel.app`.
- **Estética:** 3D e interactiva.
- **Idioma:** bilingüe, con español por defecto e inglés.
- **Foto:** sin foto por ahora. Se deja el lugar preparado para agregarla.
- **Compañeros:** no se nombran. Se aclara siempre que fue trabajo en equipo de 5 integrantes.
- **Datos de contacto:** el mail público es `hbato21@gmail.com`, el GitHub es `AlsinaBautista` y el LinkedIn es `https://www.linkedin.com/in/bautista-alsina`.
- **Carrera:** empezó en 2025, así que en 2026 está en 2º año.
- **Parroquia:** la URL pública es `https://santuarioemigrantes.org/`.
- **Foto del equipo con diplomas:** aprobada.
- **FIA:** los TPs se muestran sin link al código. El TP1 (motor de Y) entra en v1. El TP2 (ciervos) entra después de la entrega del 22/11.
- **Semáforo adaptativo:** entra solo si sigue funcionando (ver paso 4b).
- **Repo:** `AlsinaBautista/portfolio` ya existe en GitHub, vacío y privado, y es el `origin` local. Se trabaja en la rama `feat/portfolio-v1`. El push, el cambio a público y el PR los hace el agente principal después de revisar el diff.
- **Vercel:** el token del CLI no es válido. El usuario tiene que correr `vercel login` o importar el repo desde el dashboard.
- **Secciones extra:** sobre mí, educación, experiencia (biblioteca) y skills. No hay formulario de contacto.
- **Animaciones:** se eligen de React Bits, Aceternity y Motion. Se toma la idea de cada una y se reescribe con nuestros tokens, sin pegarlas tal cual.

---

## Concepto: "la página es el mapa"

Bautista programó la máquina de estados de la misión de TARS, así que el sitio se recorre como una corrida de esa misión:

1. **Fondo: grilla de ocupación.**
   - El fondo imita un mapa de ROS: celdas grises (desconocidas) que se vuelven libres a medida que scrolleás.
   - Las celdas se descubren en un radio alrededor del viewport, como si un LiDAR barriera la página.
   - Se hace con un canvas 2D fijo y liviano.
2. **HUD de misión fijo.**
   - Va en la esquina inferior izquierda y usa la tipografía mono.
   - Muestra los estados reales de `mision.py`: `waiting_for_map → exploring → returning → checking → finished`.
   - Lleva un reloj `t = 02:31 / 10:00`, que es el presupuesto real de la competencia, atado al progreso del scroll.
   - Lleva un contador `reportes 3/8` que sube a medida que aparecen proyectos.
3. **Rojo solo para lo reportado.**
   - El rojo de las cajas víctima es el único acento de la página.
   - Se usa en los marcadores de proyecto "reportado", en el botón de contacto y en el foco del teclado. En nada más.

Este es el riesgo estético. Lo demás queda sobrio para que se luzca.

### Tokens de diseño

| Token | Hex | Uso |
|---|---|---|
| `libre` | `#F2F3F0` | Fondo (celda libre) |
| `desconocido` | `#CDCFCB` | Celdas sin explorar, bordes, skeletons |
| `pared` | `#141615` | Texto, líneas, celdas ocupadas |
| `tinta-2` | `#5E625F` | Texto secundario |
| `victima` | `#E1262D` | Acento: reportes, botón de contacto, foco |
| `traza` | `#2A5BD7` | Solo el camino del robot en el replay |

**Tipografía** (todas de Google Fonts, cargadas con `next/font`):

| Rol | Fuente | Pesos | Uso |
|---|---|---|---|
| Display | **Doto** | 800–900 | Fuente de matriz de puntos: cada letra es una grilla, como un scan. Solo para el nombre del hero y los títulos de sección. |
| Texto | **Schibsted Grotesk** | 400 / 500 / 700 | Cuerpo |
| Datos | **Martian Mono** | 400 / 500 | HUD, chips de stack, etiquetas y números. Mayúsculas a 11–13 px. |

**Escala:** 13 / 16 / 20 / 28 / 44 / 72. El nombre del hero usa `clamp(64px, 12vw, 176px)`.

**Wireframe desktop:**

```
┌──────────────────────────────────────────────────────────┐
│ BTA                                  Proyectos  Sobre mí  ES/EN │
│                                                          │
│  BAUTISTA                     ╭───────────────╮  · · ·   │
│  TOMÁS                        │  robot 3D     │ ·  LiDAR │
│  ALSINA                       │  (arrastrable)│  · · ·   │
│                               ╰───────────────╯          │
│  Ingeniería en IA · UdeSA                                │
│  [● 3er puesto · Challenge JAR 2026]                     │
│ ░░░░▓▓░░ grilla de ocupación que se va revelando ░░░░░░  │
├──────────────────────────────────────────────────────────┤
│ TARS (destacado)                                         │
│  mapa real de la corrida 2  │ texto + métricas           │
│  (la traza avanza con scroll)│ video real                │
├──────────────────────────────────────────────────────────┤
│ Proyectos: lista editorial; al pasar el mouse aparece    │
│ la media                                                 │
├──────────────────────────────────────────────────────────┤
│ Sobre mí · Educación · Experiencia · Skills              │
├──────────────────────────────────────────────────────────┤
│ Contacto: "volver a la base" → /done                     │
└──────────────────────────────────────────────────────────┘
[HUD] exploring · t=02:31/10:00 · reportes 3/8
```

---

## Secciones

### 1. Hero (`waiting_for_map` → `exploring`)

**Carga:**
- Durante unos 600 ms el HUD muestra `waiting_for_map…`. Después pasa a `exploring`, la grilla empieza a revelarse alrededor del hero y el nombre se "decodifica" punto por punto (idea de DecryptedText de React Bits).

**Robot 3D:**
- Es el modelo real del ROSMASTER X3, renderizado con React Three Fiber.
- Material "arcilla" mate con aristas finas en `pared`, para que combine con la página. Probarlo contra los materiales originales y quedarse con el que lea mejor.
- Se puede arrastrar para rotarlo (`PresentationControls` con vuelta elástica) y tiene un leve parallax con el mouse.
- **Barrido de LiDAR:** un abanico de rayos sale del sensor y deja puntos rojos tenues sobre un pedacito de laberinto bajo alrededor del robot. Los puntos se acumulan y se desvanecen, como si estuviera mapeando. Se hace con InstancedMesh o Points.
- Al bajar del hero, la cámara sube a vista cenital y el robot se achica. Es la transición hacia el mapa de TARS.

**Copy:**
- Nombre en Doto.
- Bajada (ES): "Estudio Ingeniería en Inteligencia Artificial en la UdeSA."
- Chip: "3er puesto · Challenge JAR 2026".
- Links: GitHub y mail.

**Rendimiento:**
- El canvas se carga con `next/dynamic` y `ssr: false`.
- Hasta que carga se muestra un póster PNG del robot.
- `frameloop="demand"` cuando no está en pantalla, `dpr` limitado a 1.75 y menos puntos en mobile.

### 2. TARS, el caso destacado (`exploring`)

**Contenido:**
- Título: "TARS: robot autónomo de búsqueda y rescate".
- Contexto: Challenge JAR 2026 (Jornada Argentina de Robótica, Rosario, 3 al 6 de noviembre), organizado por AIR Club UdeSA. Trabajo en equipo de 5 integrantes y primer proyecto de ROS de todos.
- Qué hice: el **módulo de misión**, que es la máquina de estados, la política de reportes, la vuelta a la base y la integración.

**Métricas:**
- 3er puesto en la final, con la mayor cantidad de víctimas encontradas en la final.
- 3º de 12 equipos en la clasificación.
- 3 víctimas en 147 s, reportadas a 2–10 cm del centro.
- 600+ tests.
- Hecho en 3 semanas.

**Replay de la corrida 2 de clasificación (animación central):**
- Se dibuja el mapa real de la arena, la traza del robot avanza con el scroll y aparecen los 3 reportes en t = 56.7 s, 119.2 s y 146.7 s.
- En cada reporte se ve una elipse de covarianza que se achica hasta σ ≤ 0.10 m y se marca en rojo.
- Se hace en SVG con `useScroll` + `useTransform` de Motion.

**Media:**
- Clip real del robot en la arena, en loop sin sonido.
- Foto cenital de la arena.

**Stack:** ROS 2 Humble, Python, Nav2, OpenCV, Gazebo, pytest, GitHub Actions.

**Links:** repo `AlsinaBautista/jar-challenge-2026` y página de detalle.

**Página de detalle `/proyectos/tars`:**
- Arquitectura en 6 nodos, en un diagrama SVG animado con los topics.
- Tres explicaciones animadas chicas:
  1. **Política de reportes:** ≥5 observaciones, σ peor caso ≤ 0.10 m y ≥0.40 m de cualquier reporte anterior.
  2. **Anillo de inspección:** 12 puntos a 0.8 m de la caja.
  3. **Vuelta por tramos:** BFS sobre el costmap en tramos de ≤5 m.
- La barra de presupuesto de 10 minutos.
- Video de la corrida completa acelerado.
- Lo que salió mal en la final: con la resolución más fina del mapa, la planificación tardó unos 3 minutos. Contarlo honestamente.

### 3. Proyectos (`exploring`, el contador de reportes sube)

**Formato:**
- Lista editorial, no bento.
- Cada fila lleva título, contexto (materia o personal), año, chips de stack y un marcador.
- En desktop, al pasar el mouse aparece una vista previa de la media que sigue al cursor (idea de React Bits/Aceternity) y el video arranca en hover.
- En mobile son tarjetas apiladas con la media visible.
- Click abre `/proyectos/[slug]` con transición de layout compartida.

| # | Proyecto | Contexto | Media | Link |
|---|---|---|---|---|
| 1 | **Académica**: app de facultad con tutor de voz | Personal, la uso todos los días | Promo de 2:00 (Remotion) recortada; figuras del tutor | Sin repo público |
| 2 | **Sitio de la Parroquia Madre de los Emigrantes** | Personal, en producción | Imágenes del sitio y captura del sitio en vivo | https://santuarioemigrantes.org/ |
| 3 | **Motor para el juego Y**: MCTS + RAVE | FIA TP1 | Tablero | Sin link (repo de la cátedra) |
| 4 | **PCA y Monte Carlo en PneumoniaMNIST** | Inferencia TP1 | `pca_scatter.png`, `accuracy_vs_k.png` | Repo público |
| 5 | **Bloons TD en Pygame** | Pensamiento Computacional 2025 (grupal) | Captura de gameplay o sprites | Repo público |
| 6 | **Semáforo adaptativo**: YOLOv8 + RL multiagente | Personal | Diagrama animado de la arquitectura (el video de salida usa imágenes de un dataset que no permite redistribuirlas) | Repo público. Solo si pasa el paso 4b. |

Se agregan después de v1, sin dejar placeholders visibles en el sitio:
- **Cadenas de Markov animadas (Manim):** después del 13/11.
- **"¿Quién anda ahí?" (FIA TP2):** después del 22/11. El contenido ya está escrito abajo.

Detalle de algunos proyectos:

- **Académica:**
  - App de escritorio para macOS (Tauri + Rust + React) con una tablet Android de compañera (Kotlin/Compose).
  - El tutor de voz mira la hoja, contesta en voz alta y dibuja sobre la página, con un láser, subrayados y fórmulas escritas a mano.
  - Tiene servidor MCP local para que la IA lea notas y dibujos.
  - Medición propia: el tutor detectó errores sembrados en 6 de 10 páginas.
- **Parroquia:**
  - Next.js 15 + Firebase (Firestore, Auth, Storage, Functions) + SendGrid.
  - Panel de admin para que el personal edite sin desarrollador, con analíticas.
  - Traducciones en 4 idiomas.
- **Ciervos:**
  - Combina fotos, coordenadas GPS y notas de campo en varios idiomas. Usa EfficientNet-B0/DINOv2, XGBoost y TF-IDF.
  - Detectó dos fugas de datos: los logos de club en las fotos y los "gemelos" de GPS (97.4% → 93.0%).
  - 94.5% estimado en test.
  - Se entrega el 22/11, así que hay que actualizar los números después.
- **Motor Y:** 6º de 45 en el ranking provisional (TrueSkill). Unas 1.550 líneas: MCTS con UCT + RAVE, tabla de transposición y simetrías.

### 4. Sobre mí (`exploring` · búsqueda extra)

**Bio (borrador para corregir).**

ES:

> Soy Bautista. Estudio Ingeniería en Inteligencia Artificial en la Universidad de San Andrés. Me interesa la IA que funciona fuera de la pantalla: robots que navegan solos, modelos cuyos errores se pueden medir y herramientas que uso todos los días. En 2026 programé el módulo de misión de TARS, el robot de búsqueda y rescate con el que salimos terceros en el Challenge JAR. Estoy abierto a pasantías para 2027.

EN:

> I'm Bautista, an Artificial Intelligence Engineering student at Universidad de San Andrés. I like AI that works off the screen: robots that navigate on their own, models whose mistakes you can measure, and tools I use every day. In 2026 I wrote the mission module for TARS, the search-and-rescue robot that took our team to 3rd place at the JAR Challenge. I'm open to internships for 2027.

**Educación:** Ingeniería en Inteligencia Artificial, UdeSA, de 2025 al presente (2º año).

**Experiencia:** alumno colaborador en la Biblioteca UdeSA, área de Procesos Técnicos, 2026.

**Skills:** chips agrupados, sin barras de porcentaje.

| Grupo | Skills |
|---|---|
| IA/ML | Python, NumPy, scikit-learn, XGBoost, PyTorch, MCTS |
| Robótica | ROS 2, Nav2, OpenCV, Gazebo |
| Software | TypeScript, React, Next.js, C/C++, Rust (Tauri), Kotlin |
| Herramientas | Git, GitHub Actions, Docker, Firebase, pytest, agentes de IA (Claude Code, Codex) |

**Animación:** la línea de tiempo se dibuja con el scroll y los chips aparecen escalonados.

### 5. Contacto (`returning` → `checking` → `finished`)

- Es la vuelta a la base.
- Al entrar en la sección, una traza punteada vuelve al punto de inicio, el HUD pasa por `returning → checking → finished` y se "publica" `/done`.
- **Copy:** "¿Hablamos?", con un botón grande "Copiar mail" que cambia a "Mail copiado".
- Links a GitHub (`https://github.com/AlsinaBautista`) y a LinkedIn (`https://www.linkedin.com/in/bautista-alsina`).
- **Footer:** "Hecho con Next.js y React Three Fiber" y el año.

---

## Inventario de animaciones

| Dónde | Qué | Herramienta | Con `prefers-reduced-motion` |
|---|---|---|---|
| Global | Scroll suave | Lenis | Desactivado |
| Global | Grilla de ocupación que se revela | Canvas 2D | Grilla ya revelada, estática |
| Global | HUD con estado, reloj y reportes | Motion | Cambia sin transición |
| Hero | Nombre que se decodifica | Hook propio | Texto final directo |
| Hero | Robot 3D, arrastre y barrido de LiDAR | R3F + drei | Póster PNG, sin canvas |
| Hero → TARS | La cámara sube a vista cenital | R3F + scroll | No se hace |
| TARS | Replay de la corrida con elipses | SVG + `useScroll` | Estado final dibujado |
| Proyectos | Vista previa que sigue al cursor | Motion | Media fija en la fila |
| Proyectos | Transición de layout al detalle | Motion `layoutId` | Corte directo |
| Detalle TARS | 3 explicaciones animadas | SVG + Motion | Cuadro final |
| Secciones | Revelado escalonado al entrar | Motion `whileInView` | Visible directo |
| Contacto | Traza de vuelta y `/done` | SVG | Estado final |

Todo lo que dependa de animar tiene que verse bien en su cuadro final.

---

## Arquitectura y archivos

```
app/
  [locale]/
    layout.tsx               fuentes, <html lang>, metadata por idioma y hreflang
    page.tsx                 home de una página
    proyectos/[slug]/page.tsx  detalle (generateStaticParams: idioma × slug)
    not-found.tsx
  opengraph-image.tsx        imagen OG generada (nombre en Doto + grilla)
  sitemap.ts, robots.ts, icon.svg
middleware.ts                redirige "/" a /es o /en según Accept-Language
components/
  layout/Nav.tsx, LocaleToggle.tsx, Footer.tsx, SmoothScroll.tsx
  map/OccupancyBackdrop.tsx  canvas de la grilla
  hud/MissionHud.tsx, hud/useMissionState.ts  estado según la sección visible
  hero/Hero.tsx, hero/RobotCanvas.tsx (dinámico), hero/RobotModel.tsx, hero/LidarSweep.tsx
  ui/DecodeText.tsx, Chip.tsx, Video.tsx (lazy, con póster), CopyEmail.tsx
  tars/TarsFeature.tsx, tars/RunReplay.tsx, tars/explainers/*.tsx
  projects/ProjectList.tsx, ProjectRow.tsx, HoverPreview.tsx, ProjectDetail.tsx
  about/About.tsx, Timeline.tsx, Skills.tsx
  contact/ReturnToBase.tsx
content/
  site.ts                    textos de la UI tipados { es, en }
  projects.ts                datos de cada proyecto (slug, título/cuerpo en es y en, stack, links, media, año)
lib/i18n.ts, lib/useReducedMotion.ts
public/
  models/rosmaster.glb       optimizado
  img/robot-poster.png
  data/run2.json, data/run2-map.png
  media/{tars,academica,parroquia,fia,inferencia,bloons}/...
scripts/
  optimize-model.sh          gltf-transform
  process-media.sh           ffmpeg y sharp
  build-run-data.py          logs → run2.json + mapa
tests/
  smoke.spec.ts              Playwright
```

**i18n:**
- Segmento `[locale]` con `generateStaticParams`, con los valores `es` y `en`. Diccionarios TS tipados, sin librería extra.
- El toggle conserva la ruta. Por ejemplo, `/es/proyectos/tars` lleva a `/en/proyectos/tars`.

**Dependencias:** `motion`, `three`, `@react-three/fiber`, `@react-three/drei`, `lenis`, `@playwright/test`, `sharp`.

---

## Pipeline de assets

Todos los scripts se pueden volver a correr. Los originales no se tocan: se copian a `public/`.

### 1. Modelo 3D

Origen: `/Users/bautista/Documents/Projects/yahboom_rosmaster/yahboom_rosmaster_description/cad/rosmaster_unified.glb`. Pesa 7.4 MB, tiene unos 421k triángulos y está en milímetros.

Pasos con `npx @gltf-transform/cli`:
1. Escalar de milímetros a metros.
2. Simplificar fuerte el LiDAR, que solo él tiene 155k triángulos.
3. `optimize` con meshopt y texturas en WebP.

**Meta: ≤ 1.5 MB.** El póster del robot se saca con una captura de Playwright de la escena ya armada.

### 2. Datos de la corrida 2

Todo sale de `/Users/bautista/Documents/Projects/JAR_TARS/jar_challenge`, en la rama `origin/development`, leído con `git show`:

| Dato | Origen |
|---|---|
| Traza | `docs/team/ajuste/runs/run2_odom_2hz.csv`. Mejor usar las poses de AMCL de `run2_log.txt`, que están en el frame del mapa. |
| Eventos | `docs/team/corridas/2026-11-04/TARS/corrida_c2/eventos.jsonl` |
| Mapa | Se reconstruye con `scripts/decode_map_from_log.py`: 174×383 celdas de 0.02 m. |

- **Salida:** `public/data/run2.json` con `{ resolución, origen, pose[], reportes[], estados[] }` y el mapa en PNG.
- **Si el mapa no se puede reconstruir o alinear:** dibujar solo la traza y los reportes sobre la grilla del fondo, y avisar.

### 3. Videos

ffmpeg, sin audio, en H.264 + WebM, con póster:

| Uso | Origen (en `~/Downloads`) | Salida |
|---|---|---|
| Loop de TARS | `WhatsApp Video 2026-11-06 at 21.42.42.mp4` (1280×720, 1:16) | Loop de 12–20 s, ≤ 4 MB |
| Detalle de TARS | `WhatsApp Video 2026-11-06 at 21.45.05.mp4` (vertical, 5:42, corrida completa) | Acelerado ×16, unos 21 s |

- **Académica:** origen `/Users/bautista/Documents/Projects/notes-promo/promo/out/academica-promo-1080.mp4`. Salida a 720p, ≤ 8 MB, con `preload="none"`.
- **Markov:** `/Users/bautista/Documents/Udesa/inferencia/TP3/manim/exports/preview_actos_1_2_v02.mp4`, cuando entre.
- **Elegir tramos:** antes de elegir, sacar miniaturas con ffmpeg para ver qué muestra cada video.

### 4. Imágenes

Se procesan con sharp a WebP/AVIF y se muestran con `next/image`.

| Proyecto | Origen |
|---|---|
| TARS | `docs/media/*.gif` y `*.jpg` del repo (`origin/development`): `arena_qualification.jpg`, `real_final_run.gif`, `real_run_replay.gif`, `sim_maze_3_6x6.png`. También `~/Downloads/WhatsApp Image 2026-11-04 at 16.15.11.jpeg` (vista cenital), `21.39.34.jpeg` (robot en el círculo de salida) y `21.45.46 (2).jpeg` (equipo con los diplomas del 3er puesto, aprobada). Revisar las otras ~18 fotos de esa tanda por si alguna es mejor. Los GIFs se convierten a video. |
| Académica | Fotogramas de `notes-promo/promo/out/*.png` y una selección de `/Users/bautista/Documents/Projects/tutor-dibujos-medicion/galeria/` |
| Parroquia | `/Users/bautista/repo_parroquia/Parroquia/web_parroquia/public/images/` y una captura del sitio en vivo con Playwright, si se confirma la URL |
| FIA TP2 | `/Users/bautista/Documents/Udesa/FIA/TP2/informe/figuras/` |
| PCA | `/Users/bautista/Documents/Udesa/inferencia/TP1/pca-montecarlo-pneumonia/figures/` |
| Bloons | Correr el juego y capturar gameplay. Si no corre, armar la imagen con los sprites de `imgs/`. |

---

## Pasos de implementación

Cada paso termina en un commit.

1. **Setup.**
   - `create-next-app` con TypeScript, Tailwind, ESLint y App Router.
   - Instalar las dependencias.
   - Tokens en `@theme` de Tailwind v4.
   - Fuentes con `next/font`.
   - `.gitignore`.
2. **i18n y esqueleto.**
   - `[locale]`, middleware, `content/site.ts`, `Nav` y `LocaleToggle`.
   - Las 5 secciones vacías con sus ids.
   - `Footer`.
3. **Pipeline de assets.**
   - `optimize-model.sh`, `process-media.sh` y `build-run-data.py`.
   - Dejar todo en `public/`.
   - Reportar pesos finales.
4. **Contenido.** `content/projects.ts` con los proyectos de v1 en ES y EN, y la bio, la educación, la experiencia y las skills.

   4b. **Verificar el semáforo.** Revisar `/Users/bautista/Documents/Projects/semaforo` como máximo unos 20 minutos. Solo lectura: no modificar ese repo.
   - Leer el README y el Makefile.
   - Correr los tests o una demo liviana, sin levantar toda la infraestructura de Docker si es pesada.
   - **Si funciona:** agregarlo con un diagrama animado de la arquitectura y el link al repo público. No usar imágenes del dataset.
   - **Si no funciona:** dejarlo afuera y explicar por qué en el reporte.
5. **Sistema global.**
   - `SmoothScroll` (Lenis), `OccupancyBackdrop`, `MissionHud` + `useMissionState` (IntersectionObserver por sección), `useReducedMotion` y `DecodeText`.
6. **Hero.**
   - Texto primero, para no frenar el LCP.
   - `RobotCanvas` dinámico con póster, `LidarSweep`, controles y transición de cámara al scrollear.
7. **TARS.**
   - `TarsFeature` + `RunReplay`.
   - Página de detalle con los 3 explicativos y el diagrama de nodos.
8. **Proyectos.** `ProjectList`, `ProjectRow`, `HoverPreview` y la página de detalle genérica.
9. **Sobre mí y contacto.** `Timeline`, `Skills`, `ReturnToBase` y `CopyEmail`.
10. **Pulido.**
    - Reduced motion en todo.
    - Foco visible.
    - Mobile a 375 px.
    - Metadata y OG por idioma, sitemap y robots.
11. **Tests y medición:** ver criterios abajo.
12. **Deploy.** Lo hace el agente principal, no el implementador.
    - Revisar el diff.
    - Hacer push de la rama, cambiar el repo a público y abrir el PR.
    - El usuario conecta Vercel.
    - Verificar en el preview.

## Criterios de prueba

- `npm run lint`, `npx tsc --noEmit` y `npm run build` sin errores ni warnings de hidratación.
- **Playwright (`tests/smoke.spec.ts`):**
  - `/` redirige a `/es`, y a `/en` con `Accept-Language: en`.
  - `/es` y `/en` tienen un `h1` que contiene "Bautista".
  - El toggle cambia de idioma y conserva la ruta.
  - Cada `/[locale]/proyectos/[slug]` responde 200 y tiene título.
  - No hay errores en la consola.
  - En un viewport de 375×812, `scrollWidth ≤ 375` (sin scroll horizontal).
  - Con `reducedMotion: 'reduce'` no se monta ningún `<canvas>` WebGL, se ve el póster y el replay muestra el estado final.
  - El HUD muestra `exploring` en Proyectos y `finished` al final de Contacto.
- **Pesos:**
  - GLB ≤ 1.5 MB.
  - Ningún video > 8 MB, y todos tienen póster y carga diferida.
  - three.js no está en el JS inicial de la home.
- **Lighthouse mobile sobre el build de producción:** Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95.
- **Revisión visual:** capturas de cada sección a 1440 px y a 390 px, revisadas antes de dar por terminado.
- **Teclado:** se puede recorrer todo con Tab y el foco se ve. El canvas 3D no atrapa el scroll en mobile (`touch-action: pan-y`).

## Fuera de alcance en v1

- Modo oscuro.
- Foto.
- CV. Va en la fase 2: una página `/cv` imprimible a PDF y un botón "Descargar CV".
- Formulario de contacto.
- Dominio propio.
- Blog.
- Mejorar el README de `jar-challenge-2026`. Recomendado, pero en otro repo.

## Preguntas abiertas

Todas resueltas el 11/11. Las respuestas están en "Decisiones cerradas".
