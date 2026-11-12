import { ImageResponse } from "next/og";
import { hasLocale, locales } from "@/lib/i18n";
import { site } from "@/content/site";

export const alt = "Bautista Tomás Alsina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Fuente de matriz de puntos 5x7 (como Doto) para las letras del nombre
const GLYPHS: Record<string, string[]> = {
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  I: ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  N: ["10001", "11001", "10101", "10101", "10011", "10001", "10001"],
};

const CELL = 12;
const GAP = 3;

function Word({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", gap: CELL * 2 }}>
      {[...text].map((ch, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
          {GLYPHS[ch].map((row, r) => (
            <div key={r} style={{ display: "flex", gap: GAP }}>
              {[...row].map((c, k) => (
                <div key={k} style={{ width: CELL, height: CELL, background: c === "1" ? "#141615" : "transparent" }} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = hasLocale(locale) ? locale : "es";
  // celdas "desconocidas" de la grilla de ocupación, determinísticas
  const cells = Array.from({ length: 12 * 22 }, (_, i) => ((i * 7919) % 13 < 3 ? 1 : 0));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f2f3f0", position: "relative", padding: 72 }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexWrap: "wrap" }}>
          {cells.map((c, i) => (
            <div key={i} style={{ width: 1200 / 22, height: 630 / 12, display: "flex", padding: 2 }}>
              <div style={{ flex: 1, background: c ? "#cdcfcb" : "transparent", opacity: 0.55 }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <Word text="BAUTISTA" />
            <Word text="ALSINA" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, color: "#141615", fontSize: 30 }}>
            <span>{site[l].hero.tagline}</span>
            <span style={{ color: "#5e625f", fontSize: 24 }}>{site[l].hero.chip}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
