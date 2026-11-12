import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/lib/i18n";
import { site } from "@/content/site";
import { cv, cvFile } from "@/content/cv";
import CvSheet from "@/components/cv/CvSheet";
import ScaleToFit from "@/components/cv/ScaleToFit";
import "./cv.css";

type Params = Promise<{ locale: string }>;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  return {
    title: cv[locale].docTitle,
    description: site[locale].cv.meta,
    alternates: { canonical: `/${locale}/cv`, languages: { es: "/es/cv", en: "/en/cv", "x-default": "/es/cv" } },
  };
}

export default async function CvPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = site[locale];
  return (
    <div className="cv-screen">
      <div className="cv-bar">
        <Link href={`/${locale}`} className="label text-tinta-2 hover:text-pared">
          ← {t.cv.back}
        </Link>
        <a
          href={cvFile(locale)}
          download
          className="label inline-flex items-center gap-2 border border-pared bg-libre px-3 py-2 text-pared hover:bg-pared hover:text-libre"
        >
          {t.cv.downloadPdf} <span aria-hidden>↓</span>
        </a>
      </div>
      <ScaleToFit>
        <CvSheet locale={locale} />
      </ScaleToFit>
    </div>
  );
}
