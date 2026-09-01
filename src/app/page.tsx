import { Hero } from "../components/hero/Hero";
import { SiteNavbar } from "../components/navigation/SiteNavbar";
import { CoursePilotSection } from "../components/projects/CoursePilotSection";
import { TaskFlowSection } from "../components/projects/TaskFlowSection";
import { getPortfolioContent } from "../content";

function requireCopy(value: string | null, field: string) {
  if (!value) throw new Error(`Missing required English hero copy: ${field}`);
  return value;
}

export default function Home() {
  const content = getPortfolioContent("en");
  const name = requireCopy(content.profile.name, "profile.name");
  const headline = requireCopy(content.profile.headline, "profile.headline");
  const summary = requireCopy(content.profile.summary, "profile.summary");
  const resumeLabel = requireCopy(
    content.profile.contactLabels.resume,
    "profile.contactLabels.resume",
  );

  return (
    <>
      <SiteNavbar items={content.navigation} resumeLabel={resumeLabel} />
      <main>
        <Hero name={name} headline={headline} summary={summary} />
        <TaskFlowSection project={content.projects.taskflow} />
        <CoursePilotSection project={content.projects.coursepilot} />
      </main>
    </>
  );
}
