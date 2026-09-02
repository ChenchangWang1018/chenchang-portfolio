import type { InterfaceContent } from "../../types";

export const ui = {
  heroScrollHint: "向下探索",
  languageLabel: "语言",
  homeLabel: "王宸畅，返回顶部",
  primaryNavigationLabel: "主导航",
  menuLabel: "菜单",
  closeMenuLabel: "关闭",
  mobileNavigationLabel: "移动端导航",
  mobilePrimaryNavigationLabel: "移动端主导航",
  opensNewTabLabel: "在新标签页打开 PDF",
  taskflowLiveAriaLabel: "在新标签页打开 TaskFlow 在线应用",
  taskflowImageAlt:
    "TaskFlow 分布式任务控制台，展示任务生命周期与 Worker 状态",
  coursepilotStudyGuideAlt: "CoursePilot 学习指南界面",
  coursepilotQuizAlt: "CoursePilot 练习测验界面",
} as const satisfies InterfaceContent;
