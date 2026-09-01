import type { ExperienceEntry } from "../../content/types";
import styles from "./ExperienceSection.module.css";

interface ExperienceSectionProps {
  readonly entries: readonly ExperienceEntry[];
  readonly label: string;
}

const requireCopy = (value: string | null, field: string) => {
  if (!value) throw new Error(`Missing required experience copy: ${field}`);
  return value;
};

export function ExperienceSection({
  entries,
  label,
}: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      className={styles.section}
      aria-labelledby="experience-heading"
    >
      <div className={`page-container ${styles.container}`}>
        <h2 id="experience-heading" className={styles.eyebrow}>
          04 / {label}
        </h2>

        <ol className={styles.timeline}>
          {entries.map((entry, index) => {
            const organization = requireCopy(
              entry.organization,
              `${entry.id}.organization`,
            );
            const role = requireCopy(entry.role, `${entry.id}.role`);
            const location = requireCopy(
              entry.location,
              `${entry.id}.location`,
            );
            const period = requireCopy(
              entry.period.label,
              `${entry.id}.period.label`,
            );

            return (
              <li className={styles.entry} key={entry.id}>
                <div className={styles.rail}>
                  <span className={styles.index} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <time className={styles.date}>{period}</time>
                  <span className={styles.marker} aria-hidden="true" />
                </div>

                <article className={styles.content}>
                  <header className={styles.header}>
                    <h3 className={styles.role}>{role}</h3>
                    <p className={styles.organization}>{organization}</p>
                    <p className={styles.location}>{location}</p>
                  </header>

                  {entry.summary ? (
                    <p className={styles.summary}>{entry.summary}</p>
                  ) : null}

                  {entry.highlights.length > 0 ? (
                    <ul className={styles.highlights}>
                      {entry.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
