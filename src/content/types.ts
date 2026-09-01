import type { ProjectId, ProjectLinkKind } from "./project-catalog";

export const SUPPORTED_LOCALES = ["en", "zh-CN"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/**
 * `null` is an explicit editorial placeholder. Future UI must not render it as
 * visible copy; replace it only after wording has been approved for that locale.
 */
export type EditorialText = string | null;

export interface SiteContent {
  readonly title: EditorialText;
  readonly description: EditorialText;
}

export interface InterfaceContent {
  readonly heroScrollHint: string;
  readonly languageLabel: string;
  readonly homeLabel: string;
  readonly primaryNavigationLabel: string;
  readonly menuLabel: string;
  readonly closeMenuLabel: string;
  readonly mobileNavigationLabel: string;
  readonly mobilePrimaryNavigationLabel: string;
  readonly opensNewTabLabel: string;
  readonly taskflowLiveAriaLabel: string;
  readonly taskflowImageAlt: string;
  readonly coursepilotStudyGuideAlt: string;
  readonly coursepilotQuizAlt: string;
}

export interface AboutContent {
  readonly paragraphs: readonly string[];
  readonly skillsLabel: EditorialText;
  readonly educationLabel: EditorialText;
}

export interface ContactContent {
  readonly heading: EditorialText;
  readonly description: EditorialText;
  readonly connectLabel: EditorialText;
  readonly socialLinksLabel: EditorialText;
  readonly copyEmailLabel: EditorialText;
  readonly copiedLabel: EditorialText;
  readonly viewResumeLabel: EditorialText;
  readonly backToTopLabel: EditorialText;
  readonly footerName: EditorialText;
  readonly footerRole: EditorialText;
  readonly builtWithLabel: EditorialText;
}

export interface ProfileContent {
  readonly name: EditorialText;
  readonly headline: EditorialText;
  readonly summary: EditorialText;
  readonly location: EditorialText;
  readonly availability: EditorialText;
  readonly contactLabels: {
    readonly github: EditorialText;
    readonly linkedin: EditorialText;
    readonly email: EditorialText;
    readonly resume: EditorialText;
  };
}

export interface NavigationItem {
  readonly id: string;
  readonly target: string;
  readonly label: string;
}

export interface DateRangeContent {
  readonly start: string | null;
  readonly end: string | null;
  readonly label: EditorialText;
}

export interface ProjectCopy {
  readonly id: ProjectId;
  readonly name: string;
  readonly eyebrow: EditorialText;
  readonly scrollHint: EditorialText;
  readonly summary: EditorialText;
  readonly description: EditorialText;
  readonly role: EditorialText;
  readonly period: DateRangeContent | null;
  readonly highlights: readonly string[];
  readonly technologies: readonly string[];
  readonly linkLabels: Partial<Record<ProjectLinkKind, EditorialText>>;
}

export type ProjectCopyMap = {
  readonly [Id in ProjectId]: Omit<ProjectCopy, "id"> & { readonly id: Id };
};

export interface ExperienceEntry {
  readonly id: string;
  readonly organization: EditorialText;
  readonly role: EditorialText;
  readonly location: EditorialText;
  readonly period: DateRangeContent;
  readonly summary: EditorialText;
  readonly highlights: readonly string[];
  readonly technologies: readonly string[];
}

export interface EducationEntry {
  readonly id: string;
  readonly institution: EditorialText;
  readonly institutionSecondary: EditorialText;
  readonly credential: EditorialText;
  readonly field: EditorialText;
  readonly degreeLabel: EditorialText;
  readonly location: EditorialText;
  readonly period: DateRangeContent;
  readonly highlights: readonly string[];
}

export interface SkillItem {
  readonly name: string;
  readonly detail: EditorialText;
}

export interface SkillGroup {
  readonly id: string;
  readonly label: string;
  readonly items: readonly SkillItem[];
}

export interface PortfolioContent {
  readonly locale: Locale;
  readonly site: SiteContent;
  readonly ui: InterfaceContent;
  readonly about: AboutContent;
  readonly contact: ContactContent;
  readonly profile: ProfileContent;
  readonly navigation: readonly NavigationItem[];
  readonly projects: ProjectCopyMap;
  readonly experience: readonly ExperienceEntry[];
  readonly education: readonly EducationEntry[];
  readonly skills: readonly SkillGroup[];
}
