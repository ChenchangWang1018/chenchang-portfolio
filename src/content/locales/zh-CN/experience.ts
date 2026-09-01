import type { ExperienceEntry } from "../../types";

export const experience = [
  {
    id: "hangzhou-xiaodao-product-intern",
    organization: "杭州孝道科技有限公司",
    role: "产品实习生",
    location: "杭州",
    period: {
      start: "2025-06",
      end: "2025-08",
      label: "2025.06 — 2025.08",
    },
    summary: null,
    highlights: [
      "学习 AST、SAST、SQL 注入与漏洞扫描等应用安全基础知识。",
      "了解代码安全产品从扫描执行到结果展示的基本流程。",
      "参与与安全分析流程相关的前端产品交互体验与功能理解。",
    ],
    technologies: [],
  },
  {
    id: "yiwu-water-department-intern",
    organization: "义乌市水务局",
    role: "实习生",
    location: "义乌",
    period: {
      start: "2024-06",
      end: "2024-09",
      label: "2024.06 — 2024.09",
    },
    summary: null,
    highlights: [
      "参与山洪风险区域与人员疏散相关数据的采集和整理。",
      "协助核对住户、地点及风险区域信息，用于地图标注与应急规划。",
      "对现场采集数据进行分类、汇总与整理，便于后续行政使用。",
    ],
    technologies: [],
  },
] as const satisfies readonly ExperienceEntry[];
