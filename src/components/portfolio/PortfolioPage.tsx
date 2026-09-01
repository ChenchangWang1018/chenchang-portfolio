import { LOCALE_ROUTES, type RouteLocale } from "../../config/locales";
import { VERIFIED_LINKS } from "../../config/links";
import { getPortfolioContent } from "../../content";
import { AboutSection } from "../about/AboutSection";
import { ContactSection } from "../contact/ContactSection";
import { ExperienceSection } from "../experience/ExperienceSection";
import { Hero } from "../hero/Hero";
import { SiteNavbar } from "../navigation/SiteNavbar";
import { CoursePilotSection } from "../projects/CoursePilotSection";
import { OtherWorkSection } from "../projects/OtherWorkSection";
import { TaskFlowSection } from "../projects/TaskFlowSection";

interface PortfolioPageProps {
  readonly routeLocale: RouteLocale;
}

function requireCopy(value: string | null, field: string) {
  if (!value) throw new Error(`Missing required portfolio copy: ${field}`);
  return value;
}

export function PortfolioPage({ routeLocale }: PortfolioPageProps) {
  const localeConfig = LOCALE_ROUTES[routeLocale];
  const content = getPortfolioContent(localeConfig.contentLocale);
  const name = requireCopy(content.profile.name, "profile.name");
  const headline = requireCopy(content.profile.headline, "profile.headline");
  const summary = requireCopy(content.profile.summary, "profile.summary");
  const resumeLabel = requireCopy(
    content.profile.contactLabels.resume,
    "profile.contactLabels.resume",
  );
  const experienceLabel = content.navigation.find(
    (item) => item.id === "experience",
  )?.label;
  const aboutLabel = content.navigation.find(
    (item) => item.id === "about",
  )?.label;
  const contactLabel = content.navigation.find(
    (item) => item.id === "contact",
  )?.label;

  if (!experienceLabel || !aboutLabel || !contactLabel) {
    throw new Error("Missing required navigation label");
  }

  const contactDestinations = {
    email: VERIFIED_LINKS.profile.email,
    github: VERIFIED_LINKS.profile.github,
    linkedin: VERIFIED_LINKS.profile.linkedin,
    resume: VERIFIED_LINKS.profile.resume[localeConfig.contentLocale],
  };

  return (
    <>
      <SiteNavbar
        items={content.navigation}
        locale={routeLocale}
        resumeHref={contactDestinations.resume.href}
        resumeLabel={resumeLabel}
        ui={content.ui}
      />
      <main>
        <Hero
          name={name}
          headline={headline}
          scrollHint={content.ui.heroScrollHint}
          summary={summary}
        />
        <TaskFlowSection project={content.projects.taskflow} ui={content.ui} />
        <CoursePilotSection
          project={content.projects.coursepilot}
          ui={content.ui}
        />
        <OtherWorkSection projects={[content.projects.pong]} />
        <ExperienceSection
          entries={content.experience}
          label={experienceLabel}
        />
        <AboutSection
          about={content.about}
          education={content.education}
          label={aboutLabel}
          skills={content.skills}
        />
        <ContactSection
          contact={content.contact}
          destinations={contactDestinations}
          label={contactLabel}
          profile={content.profile}
        />
      </main>
    </>
  );
}
