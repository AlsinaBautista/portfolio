import type { Locale } from "@/lib/i18n";
import { site } from "@/content/site";

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-desconocido px-5 py-8 pb-28 sm:px-10">
      <p className="label flex flex-wrap justify-between gap-2 text-tinta-2">
        <span>{site[locale].footer.built}</span>
        <span>© {new Date().getFullYear()}</span>
      </p>
    </footer>
  );
}
