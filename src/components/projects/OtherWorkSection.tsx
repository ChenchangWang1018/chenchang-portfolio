"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";

import { PROJECT_CATALOG } from "../../content/project-catalog";
import type { ProjectCopy } from "../../content/types";
import styles from "./OtherWorkSection.module.css";

interface OtherWorkSectionProps {
  readonly projects: readonly ProjectCopy[];
}

interface OtherWorkProject {
  readonly id: ProjectCopy["id"];
  readonly title: string;
  readonly eyebrow: string;
  readonly description: string;
  readonly stack: readonly string[];
  readonly image: string;
  readonly sourceUrl: string;
  readonly sourceLabel: string;
}

const requireCopy = (value: string | null, field: string) => {
  if (!value) throw new Error(`Missing required Other Work copy: ${field}`);
  return value;
};

function createOtherWorkProjects(
  projects: readonly ProjectCopy[],
): readonly OtherWorkProject[] {
  return projects.map((project) => {
    const catalog = PROJECT_CATALOG[project.id];
    const image = catalog.publicAssets[0];
    const sourceUrl = catalog.links.github;

    if (!image) {
      throw new Error(`Missing public preview asset: ${project.id}`);
    }

    if (!sourceUrl) {
      throw new Error(`Missing source URL: ${project.id}`);
    }

    return {
      id: project.id,
      title: project.name,
      eyebrow: requireCopy(project.eyebrow, `${project.id}.eyebrow`),
      description: requireCopy(
        project.description,
        `${project.id}.description`,
      ),
      stack: project.technologies,
      image,
      sourceUrl,
      sourceLabel: requireCopy(
        project.linkLabels.github ?? null,
        `${project.id}.sourceLabel`,
      ),
    };
  });
}

export function OtherWorkSection({ projects }: OtherWorkSectionProps) {
  const otherWorkProjects = createOtherWorkProjects(projects);
  const [activeProject, setActiveProject] = useState(
    otherWorkProjects[0]?.id,
  );
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const previewFrameRef = useRef<HTMLDivElement>(null);
  const currentProject =
    otherWorkProjects.find((project) => project.id === activeProject) ??
    otherWorkProjects[0];
  const resetParallax = () => {
    previewFrameRef.current?.style.setProperty("--pong-parallax-x", "0px");
    previewFrameRef.current?.style.setProperty("--pong-parallax-y", "0px");
  };

  const handlePreviewPointerEnter = () => {
    const supportsPointerInteraction = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    if (supportsPointerInteraction) {
      setIsPreviewActive(true);
    }
  };

  const handlePreviewPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const supportsParallax = window.matchMedia(
      "(min-width: 56rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    ).matches;

    if (!supportsParallax || !previewFrameRef.current) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;

    previewFrameRef.current.style.setProperty(
      "--pong-parallax-x",
      `${normalizedX * 7}px`,
    );
    previewFrameRef.current.style.setProperty(
      "--pong-parallax-y",
      `${normalizedY * 5}px`,
    );
  };

  const handlePreviewPointerLeave = () => {
    setIsPreviewActive(false);
    resetParallax();
  };

  if (!currentProject) return null;

  return (
    <section className={styles.section} aria-labelledby="other-work-heading">
      <div className={`page-container ${styles.container}`}>
        <p id="other-work-heading" className={styles.eyebrow}>
          {currentProject.eyebrow}
        </p>

        <div className={styles.layout}>
          <div className={styles.projectList}>
            {otherWorkProjects.map((project, index) => {
              const isActive = project.id === currentProject.id;
              const titleId = `other-work-${project.id}-title`;

              return (
                <article
                  className={styles.projectEntry}
                  data-active={isActive}
                  key={project.id}
                  onMouseEnter={() => setActiveProject(project.id)}
                  onFocusCapture={() => setActiveProject(project.id)}
                  aria-labelledby={titleId}
                >
                  <button
                    className={styles.projectTrigger}
                    type="button"
                    aria-controls="other-work-preview"
                    aria-pressed={isActive}
                    onClick={() => setActiveProject(project.id)}
                  >
                    <span className={styles.indexGroup} aria-hidden="true">
                      <span className={styles.index}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={styles.activeIndicator}
                        data-visible={isActive && isPreviewActive}
                      >
                        ●
                      </span>
                    </span>
                    <span id={titleId} className={styles.title}>
                      {project.title}
                    </span>
                  </button>

                  <p className={styles.description}>{project.description}</p>

                  <div className={styles.meta}>
                    <p className={styles.technologies}>
                      {project.stack.join(" · ")}
                    </p>
                    <a
                      className={styles.action}
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.sourceLabel}
                      <ArrowUpRight
                        className={styles.actionIcon}
                        aria-hidden="true"
                        strokeWidth={1.5}
                      />
                    </a>
                  </div>

                  <div className={styles.mobilePreview} aria-hidden="true">
                    <Image
                      className={styles.image}
                      src={project.image}
                      alt=""
                      width={2558}
                      height={1516}
                      sizes="(max-width: 56rem) calc(100vw - 40px), 1px"
                    />
                  </div>
                </article>
              );
            })}
          </div>

          <div
            id="other-work-preview"
            className={styles.previewPanel}
            aria-hidden="true"
          >
            <div
              ref={previewFrameRef}
              className={styles.previewFrame}
              data-awake={isPreviewActive}
              onPointerEnter={handlePreviewPointerEnter}
              onPointerMove={handlePreviewPointerMove}
              onPointerLeave={handlePreviewPointerLeave}
            >
              {otherWorkProjects.map((project) => (
                <div
                  className={styles.previewLayer}
                  data-active={project.id === currentProject.id}
                  key={project.id}
                >
                  <Image
                    className={styles.image}
                    src={project.image}
                    alt=""
                    fill
                    sizes="(max-width: 80rem) 52vw, 620px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
