import type { AboutContent } from "../../types";

export const about = {
  paragraphs: [
    "我目前就读于加州大学圣塔芭芭拉分校计算机科学专业，主要关注软件工程、分布式系统、全栈开发以及 AI 产品。",
    "我喜欢从系统行为和后端可靠性一路做到最终用户界面，把复杂的流程做成真正可运行、可理解、可使用的产品。",
  ],
  skillsLabel: "技能",
  educationLabel: "教育经历",
} as const satisfies AboutContent;
