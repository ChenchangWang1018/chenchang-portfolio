import type { SkillGroup } from "../../types";

const items = (...names: readonly string[]) =>
  names.map((name) => ({ name, detail: null }));

export const skills = [
  {
    id: "languages",
    label: "Languages",
    items: items("Python", "C++", "Java", "JavaScript", "TypeScript"),
  },
  {
    id: "frontend",
    label: "Frontend",
    items: items("React", "Next.js"),
  },
  {
    id: "backend",
    label: "Backend",
    items: items("FastAPI", "Spring Boot", "REST APIs"),
  },
  {
    id: "systems-infra",
    label: "Systems / Infra",
    items: items("PostgreSQL", "Redis", "Docker", "Linux", "Google Cloud"),
  },
  {
    id: "ai",
    label: "AI",
    items: items("OpenAI API", "RAG", "PyMuPDF"),
  },
  {
    id: "tools-testing",
    label: "Tools / Testing",
    items: items("Git", "GitHub", "Playwright", "JUnit"),
  },
] as const satisfies readonly SkillGroup[];
