import type { SkillGroup } from "../../types";

const items = (...names: readonly string[]) =>
  names.map((name) => ({ name, detail: null }));

export const skills = [
  {
    id: "languages",
    label: "编程语言",
    items: items("Python", "C++", "Java", "JavaScript", "TypeScript"),
  },
  {
    id: "frontend",
    label: "前端",
    items: items("React", "Next.js"),
  },
  {
    id: "backend",
    label: "后端",
    items: items("FastAPI", "Spring Boot", "REST APIs"),
  },
  {
    id: "systems-infra",
    label: "系统 / 基础设施",
    items: items("PostgreSQL", "Redis", "Docker", "Linux", "Google Cloud"),
  },
  {
    id: "ai",
    label: "AI",
    items: items("OpenAI API", "RAG", "PyMuPDF"),
  },
  {
    id: "tools-testing",
    label: "工具 / 测试",
    items: items("Git", "GitHub", "Playwright", "JUnit"),
  },
] as const satisfies readonly SkillGroup[];
