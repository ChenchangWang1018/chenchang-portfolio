import type { ReactNode } from "react";

import "../../styles/globals.css";
import { DocumentShell } from "../DocumentShell";

export default function RedirectLayout({ children }: { children: ReactNode }) {
  return <DocumentShell lang="en">{children}</DocumentShell>;
}
