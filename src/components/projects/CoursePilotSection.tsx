import Image from "next/image";

import { PROJECT_CATALOG } from "../../content/project-catalog";
import type { ProjectCopy } from "../../content/types";
import {
  CardBody,
  CardContainer,
  CardItem,
} from "../ui/3d-card";
import styles from "./CoursePilotSection.module.css";

interface CoursePilotSectionProps {
  readonly project: ProjectCopy;
}

const requireCopy = (value: string | null, field: string) => {
  if (!value) throw new Error(`Missing required CoursePilot copy: ${field}`);
  return value;
};

export function CoursePilotSection({ project }: CoursePilotSectionProps) {
  const catalog = PROJECT_CATALOG.coursepilot;
  const sourceUrl = catalog.links.github;
  const [studyGuideSrc, quizSrc] = catalog.publicAssets;
  const eyebrow = requireCopy(project.eyebrow, "eyebrow");
  const description = requireCopy(project.description, "description");
  const sourceLabel = requireCopy(
    project.linkLabels.github ?? null,
    "source label",
  );

  return (
    <section className={styles.section} aria-labelledby="coursepilot-title">
      <div className={`page-container ${styles.container}`}>
        <p className={styles.eyebrow}>{eyebrow}</p>

        <div className={styles.layout}>
          <div className={styles.copy}>
            <h2 id="coursepilot-title" className={styles.title}>
              {project.name}
            </h2>
            <p className={styles.description}>{description}</p>
            <p className={styles.technologies}>
              {project.technologies.join(" · ")}
            </p>
            <a
              className={styles.action}
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {sourceLabel} <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className={styles.showcase}>
            <CardContainer
              maxTilt={7}
              containerClassName={`py-0 ${styles.cardContainer}`}
              className={styles.tiltPlane}
            >
              <CardBody className={`h-auto w-full ${styles.cardBody}`}>
                <CardItem
                  translateZ={64}
                  className={`${styles.layer} ${styles.studyGuide}`}
                >
                  <div className={styles.productSurface}>
                    <Image
                      className={styles.image}
                      src={studyGuideSrc}
                      alt="CoursePilot study guide interface"
                      width={1840}
                      height={1474}
                      sizes="(max-width: 56rem) 92vw, 58vw"
                    />
                  </div>
                </CardItem>

                <CardItem
                  translateZ={128}
                  className={`${styles.layer} ${styles.quiz}`}
                >
                  <div className={styles.productSurface}>
                    <Image
                      className={styles.image}
                      src={quizSrc}
                      alt="CoursePilot practice quiz interface"
                      width={1840}
                      height={1482}
                      sizes="(max-width: 56rem) 58vw, 30vw"
                    />
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
