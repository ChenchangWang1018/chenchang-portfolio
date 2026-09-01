import type { Locale } from "../content/types";

export const LOCALE_ROUTES = {
  en: {
    contentLocale: "en",
    htmlLang: "en",
    label: "EN",
    path: "/en",
  },
  zh: {
    contentLocale: "zh-CN",
    htmlLang: "zh-CN",
    label: "中文",
    path: "/zh",
  },
} as const satisfies Record<
  string,
  {
    readonly contentLocale: Locale;
    readonly htmlLang: string;
    readonly label: string;
    readonly path: `/${string}`;
  }
>;

export type RouteLocale = keyof typeof LOCALE_ROUTES;

export const ROUTE_LOCALES = Object.keys(LOCALE_ROUTES) as RouteLocale[];

export function isRouteLocale(value: string): value is RouteLocale {
  return value in LOCALE_ROUTES;
}

export function getAlternateRouteLocale(locale: RouteLocale): RouteLocale {
  return locale === "en" ? "zh" : "en";
}
