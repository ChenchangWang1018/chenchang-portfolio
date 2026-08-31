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
  readonly credential: EditorialText;
  readonly field: EditorialText;
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
  readonly profile: ProfileContent;
  readonly navigation: readonly NavigationItem[];
  readonly projects: ProjectCopyMap;
  readonly experience: readonly ExperienceEntry[];
  readonly education: readonly EducationEntry[];
  readonly skills: readonly SkillGroup[];
}
