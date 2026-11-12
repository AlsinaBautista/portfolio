"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, switchLocalePath, type Locale } from "@/lib/i18n";

export default function LocaleToggle({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  return (
    <div role="group" aria-label={label} className="label flex items-center gap-1">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className="text-desconocido">/</span>}
          <Link
            href={switchLocalePath(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? "true" : undefined}
            className={
              l === locale
                ? "px-1 text-pared underline decoration-2 underline-offset-4"
                : "px-1 text-tinta-2 hover:text-pared"
            }
            scroll={false}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
