import type { ProjectCopyMap } from "../../types";

// Write this copy for mainland Chinese recruiters; do not translate mechanically.
export const projects = {
  taskflow: {
    id: "taskflow",
    name: "TaskFlow",
    eyebrow: null,
    scrollHint: null,
    summary: null,
    description: null,
    role: null,
    period: null,
    highlights: [],
    technologies: [],
    linkLabels: {
      live: null,
      github: null,
    },
  },
  coursepilot: {
    id: "coursepilot",
    name: "CoursePilot",
    eyebrow: null,
    scrollHint: null,
    summary: null,
    description: null,
    role: null,
    period: null,
    highlights: [],
    technologies: [],
    linkLabels: {
      github: null,
    },
  },
  pong: {
    id: "pong",
    name: "3D Pong",
    eyebrow: null,
    scrollHint: null,
    summary: null,
    description: null,
    role: null,
    period: null,
    highlights: [],
    technologies: [],
    linkLabels: {
      github: null,
    },
  },
} as const satisfies ProjectCopyMap;
