import { Doto, Martian_Mono, Schibsted_Grotesk } from "next/font/google";

export const doto = Doto({
  subsets: ["latin", "latin-ext"],
  weight: ["800", "900"],
  variable: "--font-doto",
  display: "swap",
});

export const grotesk = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const martian = Martian_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-martian",
  display: "swap",
});

export const fontVars = `${doto.variable} ${grotesk.variable} ${martian.variable}`;
