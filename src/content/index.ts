import { enContent } from "./locales/en";
import { zhCNContent } from "./locales/zh-CN";
import type { Locale, PortfolioContent } from "./types";

export const CONTENT_BY_LOCALE = {
  en: enContent,
  "zh-CN": zhCNContent,
} as const satisfies Record<Locale, PortfolioContent>;

function mergeWithFallback(localized: unknown, fallback: unknown): unknown {
  if (localized === null || localized === undefined) return fallback;

  if (Array.isArray(localized)) {
    return localized.length > 0 ? localized : fallback;
  }

  if (
    typeof localized === "object" &&
    !Array.isArray(localized) &&
    typeof fallback === "object" &&
    fallback !== null &&
    !Array.isArray(fallback)
  ) {
    const localizedRecord = localized as Record<string, unknown>;
    const fallbackRecord = fallback as Record<string, unknown>;
    const merged: Record<string, unknown> = {};

    for (const key of new Set([
      ...Object.keys(fallbackRecord),
      ...Object.keys(localizedRecord),
    ])) {
      merged[key] = mergeWithFallback(
        localizedRecord[key],
        fallbackRecord[key],
      );
    }

    return merged;
  }

  return localized;
}

export function getPortfolioContent(locale: Locale): PortfolioContent {
  if (locale === "en") return enContent;

  return mergeWithFallback(zhCNContent, enContent) as PortfolioContent;
}

export { PROJECT_CATALOG } from "./project-catalog";
export type { ProjectId } from "./project-catalog";
export * from "./types";
