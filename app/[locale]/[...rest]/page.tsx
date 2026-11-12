import { notFound } from "next/navigation";

// Cualquier ruta desconocida bajo /es o /en cae en el not-found del idioma.
export default function CatchAll() {
  notFound();
}
