import type { NavigationItem } from "../../types";

export const navigation = [
  { id: "work", target: "#work", label: "Work" },
  { id: "experience", target: "#experience", label: "Experience" },
  { id: "about", target: "#about", label: "About" },
  { id: "contact", target: "#contact", label: "Contact" },
] as const satisfies readonly NavigationItem[];
