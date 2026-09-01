import type { ContactContent } from "../../types";

export const contact = {
  heading: "保持联系。",
  description: "无论是软件工程机会、项目合作，还是值得一起做的事情，都欢迎联系我。",
  connectLabel: "联系我",
  socialLinksLabel: "社交主页",
  copyEmailLabel: "复制邮箱",
  copiedLabel: "已复制",
  viewResumeLabel: "查看简历",
  backToTopLabel: "返回顶部",
  footerName: "CHENCHANG WANG",
  footerRole: "软件工程师",
  builtWithLabel: "使用 NEXT.JS 构建",
} as const satisfies ContactContent;
