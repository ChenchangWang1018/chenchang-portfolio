import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortfolioPage } from "../../components/portfolio/PortfolioPage";
import {
  isRouteLocale,
  LOCALE_ROUTES,
  ROUTE_LOCALES,
} from "../../config/locales";
import { getPortfolioContent } from "../../content";

interface LocalePageProps {
  readonly params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return ROUTE_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isRouteLocale(locale)) return {};

  const localeConfig = LOCALE_ROUTES[locale];
  const content = getPortfolioContent(localeConfig.contentLocale);

  return {
    title: content.site.title ?? undefined,
    description: content.site.description ?? undefined,
    alternates: {
      canonical: localeConfig.path,
      languages: {
        en: LOCALE_ROUTES.en.path,
        "zh-CN": LOCALE_ROUTES.zh.path,
      },
    },
  };
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isRouteLocale(locale)) notFound();

  return <PortfolioPage routeLocale={locale} />;
}
