import type { EducationEntry } from "../../types";

export const education = [
  {
    id: "ucsb-computer-science",
    institution: "加州大学圣塔芭芭拉分校",
    institutionSecondary: "University of California, Santa Barbara",
    credential: "计算机科学",
    field: "学士",
    degreeLabel: "计算机科学学士",
    location: "美国加利福尼亚州圣塔芭芭拉",
    period: {
      start: "2023",
      end: "2027",
      label: "预计毕业：2027 年 3 月",
    },
    highlights: ["GPA：3.59"],
  },
] as const satisfies readonly EducationEntry[];
