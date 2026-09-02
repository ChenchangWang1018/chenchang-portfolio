import type { ProjectCopyMap } from "../../types";

export const projects = {
  taskflow: {
    id: "taskflow",
    name: "TaskFlow",
    eyebrow: "01 / 精选项目",
    scrollHint: "滚动展开",
    summary: "围绕可靠性、故障恢复与 Worker 状态可观测性构建的分布式任务调度系统。",
    description:
      "一个支持并发 Worker、任务重试、心跳检测、故障恢复与任务状态追踪的分布式任务调度系统。",
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
      live: "在线体验",
      github: "查看源码",
    },
  },
  coursepilot: {
    id: "coursepilot",
    name: "CoursePilot AI",
    eyebrow: "02 / 更多项目",
    scrollHint: null,
    summary: null,
    description:
      "一个面向课程学习的 AI 学习平台，可将课程 PDF 转化为学习指南、测验、学习报告，并提供基于原文内容的 AI 辅导。",
    role: null,
    period: null,
    highlights: [],
    technologies: [
      "Next.js",
      "TypeScript",
      "FastAPI",
      "Python",
      "OpenAI API",
      "PyMuPDF",
      "RAG",
    ],
    linkLabels: {
      github: "查看源码",
    },
  },
  pong: {
    id: "pong",
    name: "3D Multiplayer Pong",
    eyebrow: "03 / 其他作品",
    scrollHint: null,
    summary: null,
    description:
      "一个实时多人 3D Pong 游戏，支持公开与私有房间、匹配、玩家资料、排行榜以及 Google OAuth 登录。",
    role: null,
    period: null,
    highlights: [],
    technologies: ["Three.js", "WebSockets", "Node.js", "Express", "SQLite"],
    linkLabels: {
      github: "查看源码",
    },
  },
} as const satisfies ProjectCopyMap;
