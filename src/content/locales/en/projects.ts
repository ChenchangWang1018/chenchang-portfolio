import type { ProjectCopyMap } from "../../types";

export const projects = {
  taskflow: {
    id: "taskflow",
    name: "TaskFlow",
    eyebrow: "01 / Selected work",
    scrollHint: "Scroll to expand ↓",
    summary:
      "Distributed task scheduling built around reliability, recovery, and observable worker state.",
    description:
      "A distributed task scheduler with concurrent workers, retries, heartbeats, failure recovery, and observable task state.",
    role: null,
    period: null,
    highlights: [],
    technologies: [
      "Go",
      "PostgreSQL",
      "Redis",
      "React",
      "Docker",
      "Google Cloud",
    ],
    linkLabels: {
      live: "Open live",
      github: "View source",
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
