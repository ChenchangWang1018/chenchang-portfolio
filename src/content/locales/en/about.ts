import type { AboutContent } from "../../types";

export const about = {
  paragraphs: [
    "I'm a Computer Science student at UC Santa Barbara focused on software engineering, distributed systems, full-stack development, and AI-powered products.",
    "I enjoy building systems end to end — from backend behavior and reliability to interfaces that make complex workflows easier to understand and use.",
  ],
  skillsLabel: "Skills",
  educationLabel: "Education",
} as const satisfies AboutContent;
