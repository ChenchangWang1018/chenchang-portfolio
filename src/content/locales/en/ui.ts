import type { InterfaceContent } from "../../types";

export const ui = {
  heroScrollHint: "Scroll to explore ↓",
  languageLabel: "Language",
  homeLabel: "Chenchang Wang, home",
  primaryNavigationLabel: "Primary navigation",
  menuLabel: "Menu",
  closeMenuLabel: "Close",
  mobileNavigationLabel: "Mobile navigation",
  mobilePrimaryNavigationLabel: "Mobile primary navigation",
  opensNewTabLabel: "opens PDF in a new tab",
  taskflowLiveAriaLabel:
    "Open the live TaskFlow application in a new tab",
  taskflowImageAlt:
    "TaskFlow distributed operations dashboard showing task lifecycle and worker state",
  coursepilotStudyGuideAlt: "CoursePilot study guide interface",
  coursepilotQuizAlt: "CoursePilot practice quiz interface",
} as const satisfies InterfaceContent;
