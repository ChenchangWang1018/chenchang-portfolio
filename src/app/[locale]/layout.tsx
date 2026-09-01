import type { ReactNode } from "react";

import "../../styles/globals.css";
import { isRouteLocale, LOCALE_ROUTES } from "../../config/locales";
import { DocumentShell } from "../DocumentShell";

interface LocaleLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const htmlLang = isRouteLocale(locale)
    ? LOCALE_ROUTES[locale].htmlLang
    : "en";

  return <DocumentShell lang={htmlLang}>{children}</DocumentShell>;
}
