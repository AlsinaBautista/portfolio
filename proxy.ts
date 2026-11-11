import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasLocale, pickLocale } from "@/lib/i18n";

// En Next 16 el middleware se llama proxy.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (hasLocale(first)) return NextResponse.next();

  const locale = pickLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Se saltea _next, api y cualquier archivo con extensión (icon.svg, sitemap.xml, etc.)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
