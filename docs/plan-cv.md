# Plan: CV de Bautista Tomás Alsina

## Objetivo

Un CV de una página A4, en español y en inglés, para pasantías 2027.

- Sale de los mismos datos del portfolio, así no se desactualiza.
- Se ve en `/[locale]/cv` y se descarga como PDF desde el sitio.
- Sin experiencia laboral fuerte, el orden es: educación con números → proyectos con resultados → competencias → experiencia → skills.

## Contenido (borrador, ES)

**Bautista Tomás Alsina**
Estudiante de Ingeniería en Inteligencia Artificial · Buenos Aires, Argentina
hbato21@gmail.com · github.com/AlsinaBautista · linkedin.com/in/bautista-alsina · bautista-alsina.vercel.app

- No va teléfono.
- No va número de registro ni el PDF del certificado.

**Perfil** (2 líneas)

> Estudiante de 2º año de Ingeniería en IA en la UdeSA. Me interesa la robótica y la IA aplicada, y aprendo construyendo: este año programé el módulo de misión del robot que salió 3º en la JAR 2026. Abierto a pasantías para 2027.

**Educación**
- **Universidad de San Andrés**: Ingeniería en Inteligencia Artificial, 2025 – actualidad.
  - Beca Abanderados Argentinos.
  - Promedio 8,92 / 10, 6º de 87 en la carrera (a noviembre de 2026).
- **Colegio Nuestra Señora de Nueva Pompeya, Necochea**: secundario, egresado en 2024.
  - Primer escolta.
  - Promedio general 9,84.

**Proyectos**
- **TARS, robot autónomo de búsqueda y rescate**. Challenge JAR 2026, **3er puesto**, equipo de 5.
  - Diseñé e implementé el módulo de misión en ROS 2 / Python: la máquina de estados, la política de reportes por covarianza y la vuelta a la base por tramos sobre el costmap.
  - En la clasificación quedamos 3º de 12 equipos, con 3 víctimas reportadas en 147 s a 2–10 cm de su centro.
- **Académica**: app de escritorio (Tauri/Rust + React) con tablet Android (Kotlin). Tiene un tutor de voz con IA que mira la hoja, contesta en voz alta y dibuja sobre ella. La uso todos los días.
- **Sitio de la Parroquia Madre de los Emigrantes**: Next.js + Firebase, en producción en santuarioemigrantes.org. Tiene un panel de administración para el personal.
- **Motor para el juego Y**: MCTS con UCT + RAVE en Python. Quedó 6º de 45 en el ranking del curso.
- **Semáforo adaptativo**: YOLOv8 + RL multiagente (MAPPO), con una capa de seguridad en C++.

PCA y Bloons quedan solo en el sitio, para que el CV entre en una página.

**Competencias**
- **Olimpíada Matemática Ñandú**: instancia nacional en La Falda, Córdoba, en 2018 y 2019.
- **Olimpíada Matemática Argentina (OMA)** y torneos de geometría: participó durante el secundario.
- **Torneo Argentino de Programación (TAP)**, 2025: participante.

No se inventan medallas ni posiciones. Bautista recuerda que las dos nacionales fueron de Ñandú; si después confirma otra cosa, se corrige.

**Experiencia**
- **Alumno colaborador**, Biblioteca UdeSA, Procesos Técnicos, 2026. Apoyo general al área: etiquetado de libros, carga de registros en el sistema de la biblioteca y planillas de control en Excel.

**Skills**

| Grupo | Skills |
|---|---|
| Lenguajes | Python, C/C++, TypeScript, Rust, Kotlin |
| IA/ML | PyTorch, scikit-learn, XGBoost, NumPy |
| Robótica | ROS 2, Nav2, OpenCV, Gazebo |
| Herramientas | Git, GitHub Actions, Docker, Firebase, pytest |

**Idiomas:** español nativo; inglés intermedio-alto (B2, sin certificar).

**Intereses:** fútbol.

La versión en inglés tiene el mismo contenido, traducido con naturalidad. Los nombres propios de los colegios y las competencias van en español, con una aclaración corta donde haga falta, por ejemplo "Olimpíada Matemática Argentina (national math olympiad)".

## Diseño

- **Papel:** A4, una sola página, márgenes de 14–16 mm.
- **Estructura:** una columna, legible por sistemas ATS. El texto es real (nada de imágenes de texto) y los encabezados de sección van en el orden de lectura.
- **Tokens del sitio:**
  - el nombre en **Doto**, como único guiño de identidad;
  - el cuerpo en Schibsted Grotesk;
  - etiquetas y fechas en Martian Mono;
  - texto en `pared` (`#141615`) sobre blanco.
  - El rojo `#E1262D` va solo en un detalle mínimo, por ejemplo el marcador de "3er puesto". El PDF se puede imprimir en blanco y negro sin perder nada.
- **Links:** los del PDF se pueden clickear (mail, GitHub, LinkedIn, portfolio, sitio de la parroquia).
- **En pantalla:** `/cv` muestra la hoja centrada con sombra y un botón "Descargar PDF".

## Implementación

**Archivos**
```
content/cv.ts                 datos del CV { es, en }; reutiliza bio, educación y skills de content/site.ts y content/projects.ts donde se pueda
app/[locale]/cv/page.tsx      hoja del CV (server component), metadata por idioma, noindex no
components/cv/CvSheet.tsx     maquetación compartida pantalla e impresión
app/[locale]/cv/cv.css        @page A4, estilos de impresión (o en globals con @media print)
scripts/build-cv-pdf.mjs      levanta `next start`, abre /es/cv y /en/cv con Playwright y guarda page.pdf
public/cv/bautista-alsina-cv-es.pdf
public/cv/bautista-alsina-cv-en.pdf
```

**Integración con el sitio**
- Agregar "CV ↓" a los links del hero, junto a GitHub y Mail.
- Agregar "Descargar CV" en contacto.
- Los dos apuntan al PDF del idioma actual.

**PDF**
- Se genera **localmente** con `npm run cv` y se commitea.
- No se genera en el build de Vercel, para no depender de Chromium en el servidor.
- Un test verifica que el PDF commiteado coincide con el contenido actual: se guarda un hash de `content/cv.ts` en los metadatos del PDF o en un `.json` al lado.

**También en el portfolio**, en la sección Trayectoria:
- el **secundario** (escolta y promedio 9,84);
- una entrada de **Competencias**: Challenge JAR 2026 (3er puesto), Ñandú nacional 2018 y 2019, y TAP 2025.

**Pasos**, cada uno con su commit:
1. `content/cv.ts` y las entradas nuevas de Trayectoria.
2. `CvSheet` y la ruta `/cv`, con los estilos de impresión.
3. `scripts/build-cv-pdf.mjs`, el script `npm run cv` y los PDFs generados.
4. Botones en hero y contacto.
5. Tests y verificación.

## Criterios de prueba

- Lint, `tsc` y build limpios.
- **Playwright:**
  - `/es/cv` y `/en/cv` responden 200, tienen el nombre en un `h1` y las secciones Educación, Proyectos, Competencias, Experiencia y Skills (o sus equivalentes en EN).
  - Los PDFs existen, tienen **exactamente 1 página**, pesan menos de 300 KB y su texto extraíble incluye "Bautista Tomás Alsina", "8,92" y "TARS".
  - El PDF no contiene ningún número de teléfono ni "370833".
  - El hash del contenido coincide, es decir, el PDF no está desactualizado.
  - El botón del hero y el de contacto apuntan al PDF del idioma correcto.
  - Sin scroll horizontal a 375 px en `/cv`.
- **Revisión visual:** capturas del PDF renderizado y de `/cv` a 1440 y 390 px, revisadas antes de cerrar.

## Preguntas abiertas

Todas resueltas el 11/11. Las respuestas ya están en el contenido de arriba.
