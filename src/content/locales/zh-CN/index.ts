import type { PortfolioContent } from "../../types";
import { education } from "./education";
import { experience } from "./experience";
import { navigation } from "./navigation";
import { profile } from "./profile";
import { projects } from "./projects";
import { site } from "./site";
import { skills } from "./skills";

export const zhCNContent = {
  locale: "zh-CN",
  site,
  profile,
  navigation,
  projects,
  experience,
  education,
  skills,
} as const satisfies PortfolioContent;

