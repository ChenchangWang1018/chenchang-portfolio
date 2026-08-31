/**
 * Verified external destinations supplied by the portfolio owner.
 * Keep URLs here so content and future UI code never duplicate them.
 */
export const VERIFIED_LINKS = {
  profile: {
    github: {
      href: "https://github.com/ChenchangWang1018",
    },
    linkedin: {
      href: "https://www.linkedin.com/in/chenchang-wang-3271a5362/",
    },
    email: {
      address: "chenchang041018@gmail.com",
      href: "mailto:chenchang041018@gmail.com",
    },
  },
  projects: {
    taskflow: {
      live: "https://taskflow-web-nqi4mka4qq-uw.a.run.app",
      github:
        "https://github.com/ChenchangWang1018/taskflow-distributed-scheduler",
    },
    coursepilot: {
      github: "https://github.com/ChenchangWang1018/coursepilot-ai",
    },
    pong: {
      github: "https://github.com/ucsb-cs148-w26/pj05-pong-3d",
    },
  },
} as const;

