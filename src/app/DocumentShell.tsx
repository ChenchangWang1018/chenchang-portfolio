import type { ReactNode } from "react";

interface DocumentShellProps {
  readonly children: ReactNode;
  readonly lang: string;
}

export function DocumentShell({ children, lang }: DocumentShellProps) {
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
