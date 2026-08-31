import { PROJECT_CATALOG } from "../../content/project-catalog";
import type { ProjectCopy } from "../../content/types";
import { TASKFLOW_SCROLL_EVENT } from "../../lib/scroll-events";
import { ScrollExpand } from "./ScrollExpand";
import { TaskFlowPreview } from "./TaskFlowPreview";
import styles from "./TaskFlowSection.module.css";

interface TaskFlowSectionProps {
  readonly project: ProjectCopy;
}

const requireCopy = (value: string | null, field: string) => {
  if (!value) throw new Error(`Missing required TaskFlow copy: ${field}`);
  return value;
};

export function TaskFlowSection({ project }: TaskFlowSectionProps) {
  const catalog = PROJECT_CATALOG.taskflow;
  const liveUrl = catalog.links.live;
  const sourceUrl = catalog.links.github;
  const imageSrc = catalog.publicAssets[0];
  const eyebrow = requireCopy(project.eyebrow, "eyebrow");
  const summary = requireCopy(project.summary, "summary");
  const description = requireCopy(project.description, "description");
  const scrollHint = requireCopy(project.scrollHint, "scrollHint");
  const liveLabel = requireCopy(project.linkLabels.live ?? null, "live label");
  const sourceLabel = requireCopy(
    project.linkLabels.github ?? null,
    "source label",
  );

  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <header className={`page-container ${styles.intro}`}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <div className={styles.introGrid}>
          <h2 id="work-title" className={styles.projectTitle}>
            {project.name}
          </h2>
          <p className={styles.summary}>{summary}</p>
        </div>
      </header>

      <ScrollExpand
        title="TASKFLOW"
        scrollHint={scrollHint}
        useWindowScroll
        startWidth={42}
        startHeight={58}
        startRadius={24}
        endRadius={0}
        mediaZoom={1.35}
        scrollDistance={1.2}
        holdDistance={0.35}
        smoothing={0.1}
        progressEventName={TASKFLOW_SCROLL_EVENT}
        mediaContent={
          <TaskFlowPreview href={liveUrl} imageSrc={imageSrc} />
        }
      >
        <div className={styles.details}>
          <div className={styles.detailsCopy}>
            <p className={styles.detailsLabel}>{project.name}</p>
            <p className={styles.technologies}>
              {project.technologies.join(" · ")}
            </p>
            <p className={styles.description}>{description}</p>
          </div>
          <div className={styles.actions}>
            <a
              className={styles.action}
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {liveLabel} <span aria-hidden="true">↗</span>
            </a>
            <a
              className={styles.action}
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {sourceLabel} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </ScrollExpand>
    </section>
  );
}
