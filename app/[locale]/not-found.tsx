import Link from "next/link";
import { site } from "@/content/site";

// El not-found no recibe params; se muestra en ambos idiomas.
export default function NotFound() {
  return (
    <section className="flex min-h-dvh flex-col justify-center px-5 sm:px-10">
      <p className="label text-tinta-2">404</p>
      {(["es", "en"] as const).map((l) => (
        <div key={l} lang={l} className="mt-6">
          <h1 className="font-display-dot text-s28 sm:text-s44">{site[l].notFound.title}</h1>
          <p className="mt-3 max-w-md text-s16 text-tinta-2">{site[l].notFound.body}</p>
          <Link href={`/${l}`} className="label mt-3 inline-block underline underline-offset-4">
            {site[l].notFound.back}
          </Link>
        </div>
      ))}
    </section>
  );
}
