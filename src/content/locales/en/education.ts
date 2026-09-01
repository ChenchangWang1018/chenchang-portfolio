import type { EducationEntry } from "../../types";

export const education = [
  {
    id: "ucsb-computer-science",
    institution: "University of California, Santa Barbara",
    institutionSecondary: null,
    credential: "B.S.",
    field: "Computer Science",
    degreeLabel: null,
    location: "Santa Barbara, California",
    period: {
      start: "2023",
      end: "2027",
      label: "Expected Mar 2027",
    },
    highlights: ["GPA 3.59"],
  },
] as const satisfies readonly EducationEntry[];
