import type { ExperienceEntry } from "../../types";

export const experience = [
  {
    id: "hangzhou-xiaodao-product-intern",
    organization: "Hangzhou Xiaodao Technology Co., Ltd.",
    role: "Product Intern",
    location: "Hangzhou, China",
    period: {
      start: "2025-06",
      end: "2025-08",
      label: "Jun 2025 — Aug 2025",
    },
    summary: null,
    highlights: [
      "Studied application-security fundamentals including AST, SAST, SQL injection, and vulnerability scanning.",
      "Explored code-security product workflows, including scan execution and result presentation.",
      "Worked with front-end product interactions related to security-analysis workflows.",
    ],
    technologies: [],
  },
  {
    id: "yiwu-water-department-intern",
    organization: "Yiwu Water Department",
    role: "Intern",
    location: "Yiwu, China",
    period: {
      start: "2024-06",
      end: "2024-09",
      label: "Jun 2024 — Sep 2024",
    },
    summary: null,
    highlights: [
      "Collected and organized flood-risk and evacuation data for local communities.",
      "Coordinated household and location information for risk-area mapping and emergency planning.",
      "Classified and summarized field data for downstream administrative use.",
    ],
    technologies: [],
  },
] as const satisfies readonly ExperienceEntry[];
