import type { PortfolioContent } from "../../types";
import { about } from "./about";
import { contact } from "./contact";
import { education } from "./education";
import { experience } from "./experience";
import { navigation } from "./navigation";
import { profile } from "./profile";
import { projects } from "./projects";
import { site } from "./site";
import { skills } from "./skills";
import { ui } from "./ui";

export const zhCNContent = {
  locale: "zh-CN",
  site,
  ui,
  about,
  contact,
  profile,
  navigation,
  projects,
  experience,
  education,
  skills,
} as const satisfies PortfolioContent;
