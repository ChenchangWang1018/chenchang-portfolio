import type { ProjectCopyMap } from "../../types";

export const projects = {
  taskflow: {
    id: "taskflow",
    name: "TaskFlow",
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
