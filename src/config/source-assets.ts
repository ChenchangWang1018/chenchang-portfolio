/**
 * Repository-relative paths to original source materials.
 * These are deliberately not public asset URLs.
 */
export const SOURCE_ASSETS = {
  resumes: {
    en: "assets-source/resumes/resume-en.pdf",
    "zh-CN": "assets-source/resumes/resume-zh.pdf",
  },
  projects: {
    taskflow: ["assets-source/taskflow/taskflow-overview-01.png"],
    coursepilot: [
      "assets-source/coursepilot/coursepilot-study-guide-01.png",
      "assets-source/coursepilot/coursepilot-study-guide-02.png",
      "assets-source/coursepilot/coursepilot-quiz-01.png",
    ],
    pong: [
      "assets-source/pong/pong-lobby-01.png",
      "assets-source/pong/pong-lobby-02.png",
    ],
  },
} as const;
