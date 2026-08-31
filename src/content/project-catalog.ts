import { VERIFIED_LINKS } from "../config/links";
import { SOURCE_ASSETS } from "../config/source-assets";

export type ProjectId = keyof typeof SOURCE_ASSETS.projects;
export type ProjectLinkKind = "live" | "github";

export interface ProjectCatalogEntry {
  readonly id: ProjectId;
  readonly links: Partial<Record<ProjectLinkKind, string>>;
  readonly sourceAssets: readonly string[];
  readonly publicAssets?: readonly string[];
}

/**
 * Language-neutral project facts. Authored project copy lives in each locale.
 */
export const PROJECT_CATALOG = {
  taskflow: {
    id: "taskflow",
    links: {
      live: VERIFIED_LINKS.projects.taskflow.live,
      github: VERIFIED_LINKS.projects.taskflow.github,
    },
    sourceAssets: SOURCE_ASSETS.projects.taskflow,
    publicAssets: ["/projects/taskflow/taskflow-overview-01.webp"],
  },
  coursepilot: {
    id: "coursepilot",
    links: {
      github: VERIFIED_LINKS.projects.coursepilot.github,
    },
    sourceAssets: SOURCE_ASSETS.projects.coursepilot,
  },
  pong: {
    id: "pong",
    links: {
      github: VERIFIED_LINKS.projects.pong.github,
    },
    sourceAssets: SOURCE_ASSETS.projects.pong,
  },
} as const satisfies Record<ProjectId, ProjectCatalogEntry>;
