import type {
  AboutContent,
  EducationEntry,
  SkillGroup,
} from "../../content/types";
import styles from "./AboutSection.module.css";

interface AboutSectionProps {
  readonly about: AboutContent;
  readonly education: readonly EducationEntry[];
  readonly label: string;
  readonly skills: readonly SkillGroup[];
}

const requireCopy = (value: string | null, field: string) => {
  if (!value) throw new Error(`Missing required About copy: ${field}`);
  return value;
};

export function AboutSection({
  about,
  education,
  label,
  skills,
}: AboutSectionProps) {
  const skillsLabel = requireCopy(about.skillsLabel, "skillsLabel");
  const educationLabel = requireCopy(about.educationLabel, "educationLabel");

  return (
    <section
      id="about"
      className={styles.section}
      aria-labelledby="about-heading"
    >
      <div className={`page-container ${styles.container}`}>
        <h2 id="about-heading" className={styles.eyebrow}>
          05 / {label}
        </h2>

        <div className={styles.primaryLayout}>
          <div className={styles.aboutColumn}>
            <h3 className={styles.subheading}>{label}</h3>
            <div className={styles.aboutCopy}>
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className={styles.skillsColumn}>
            <h3 className={styles.subheading}>{skillsLabel}</h3>
            <div className={styles.skillGroups}>
              {skills.map((group) => (
                <div className={styles.skillGroup} key={group.id}>
                  <h4 className={styles.skillLabel}>{group.label}</h4>
                  <p className={styles.skillItems}>
                    {group.items.map((item) => item.name).join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.educationBlock}>
          <h3 className={styles.subheading}>{educationLabel}</h3>
          <div className={styles.educationEntries}>
            {education.map((entry) => {
              const institution = requireCopy(
                entry.institution,
                `${entry.id}.institution`,
              );
              const institutionSecondary = entry.institutionSecondary;
              const credential = requireCopy(
                entry.credential,
                `${entry.id}.credential`,
              );
              const field = requireCopy(entry.field, `${entry.id}.field`);
              const degree =
                entry.degreeLabel ?? `${credential} ${field}`;
              const location = requireCopy(
                entry.location,
                `${entry.id}.location`,
              );
              const expected = requireCopy(
                entry.period.label,
                `${entry.id}.period.label`,
              );
              const years = [entry.period.start, entry.period.end]
                .filter(Boolean)
                .join(" — ");

              return (
                <article className={styles.educationEntry} key={entry.id}>
                  <div className={styles.educationIdentity}>
                    <h4 className={styles.institution}>{institution}</h4>
                    {institutionSecondary ? (
                      <p className={styles.degree}>{institutionSecondary}</p>
                    ) : null}
                    <p className={styles.degree}>{degree}</p>
                  </div>

                  <div className={styles.educationTiming}>
                    <p className={styles.years}>{years}</p>
                    <p className={styles.expected}>{expected}</p>
                  </div>

                  <p className={styles.educationHighlights}>
                    {entry.highlights.join(" · ")}
                  </p>
                  <p className={styles.educationLocation}>{location}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
