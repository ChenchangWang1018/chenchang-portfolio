import { enContent } from "./locales/en";
import { zhCNContent } from "./locales/zh-CN";
import type { Locale, PortfolioContent } from "./types";

export const CONTENT_BY_LOCALE = {
  en: enContent,
  "zh-CN": zhCNContent,
} as const satisfies Record<Locale, PortfolioContent>;

export function getPortfolioContent(locale: Locale): PortfolioContent {
  return CONTENT_BY_LOCALE[locale];
}

export { PROJECT_CATALOG } from "./project-catalog";
export type { ProjectId } from "./project-catalog";
export * from "./types";

