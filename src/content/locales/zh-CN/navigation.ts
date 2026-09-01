import type { NavigationItem } from "../../types";

export const navigation = [
  { id: "work", target: "#work", label: "项目" },
  { id: "experience", target: "#experience", label: "经历" },
  { id: "about", target: "#about", label: "我的背景" },
  { id: "contact", target: "#contact", label: "联系" },
] as const satisfies readonly NavigationItem[];
