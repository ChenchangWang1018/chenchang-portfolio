import type { ContactContent, ProfileContent } from "../../content/types";
import { BackToTop } from "./BackToTop";
import { CopyEmailButton } from "./CopyEmailButton";
import styles from "./ContactSection.module.css";

interface ContactDestinations {
  readonly email: {
    readonly address: string;
    readonly href: string;
  };
  readonly github: { readonly href: string };
  readonly linkedin: { readonly href: string };
  readonly resume: { readonly href: string };
}

interface ContactSectionProps {
  readonly contact: ContactContent;
  readonly destinations: ContactDestinations;
  readonly label: string;
  readonly profile: ProfileContent;
}

const requireCopy = (value: string | null, field: string) => {
  if (!value) throw new Error(`Missing required Contact copy: ${field}`);
  return value;
};

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.64 5.47 7.72.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.96-.09-.23-.48-.96-.82-1.15-.28-.15-.68-.53-.01-.54.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.91-3.64-4.02 0-.89.31-1.62.82-2.19-.08-.2-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.4 7.4 0 0 1 8 3.94c.68 0 1.36.09 2 .27 1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.96.08 2.16.51.57.82 1.3.82 2.19 0 3.12-1.87 3.81-3.65 4.02.29.25.54.74.54 1.51 0 1.09-.01 1.97-.01 2.24 0 .22.15.47.55.39A8.14 8.14 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
      <path
        fill="currentColor"
        d="M0 1.15C0 .51.53 0 1.18 0h13.64C15.47 0 16 .51 16 1.15v13.7c0 .64-.53 1.15-1.18 1.15H1.18C.53 16 0 15.49 0 14.85V1.15Zm4.94 12.24V6.17h-2.4v7.22h2.4ZM3.74 5.18c.84 0 1.36-.55 1.36-1.25-.02-.71-.52-1.24-1.34-1.24-.82 0-1.36.54-1.36 1.24 0 .7.52 1.25 1.33 1.25h.01Zm3.11 8.21h2.4V9.36c0-.22.02-.43.08-.59.17-.43.57-.88 1.23-.88.87 0 1.22.66 1.22 1.64v3.86h2.4V9.25C14.18 7.03 13 6 11.42 6c-1.27 0-1.85.7-2.17 1.19v.03h-.01l.01-.03V6.17h-2.4c.03.68 0 7.22 0 7.22Z"
      />
    </svg>
  );
}

export function ContactSection({
  contact,
  destinations,
  label,
  profile,
}: ContactSectionProps) {
  const heading = requireCopy(contact.heading, "heading");
  const description = requireCopy(contact.description, "description");
  const connectLabel = requireCopy(contact.connectLabel, "connectLabel");
  const socialLinksLabel = requireCopy(
    contact.socialLinksLabel,
    "socialLinksLabel",
  );
  const copyEmailLabel = requireCopy(
    contact.copyEmailLabel,
    "copyEmailLabel",
  );
  const copiedLabel = requireCopy(contact.copiedLabel, "copiedLabel");
  const viewResumeLabel = requireCopy(
    contact.viewResumeLabel,
    "viewResumeLabel",
  );
  const backToTopLabel = requireCopy(
    contact.backToTopLabel,
    "backToTopLabel",
  );
  const footerName = requireCopy(contact.footerName, "footerName");
  const footerRole = requireCopy(contact.footerRole, "footerRole");
  const builtWithLabel = requireCopy(
    contact.builtWithLabel,
    "builtWithLabel",
  );
  const emailLabel = requireCopy(
    profile.contactLabels.email,
    "profile.contactLabels.email",
  );
  const githubLabel = requireCopy(
    profile.contactLabels.github,
    "profile.contactLabels.github",
  );
  const linkedinLabel = requireCopy(
    profile.contactLabels.linkedin,
    "profile.contactLabels.linkedin",
  );
  const currentYear = new Date().getFullYear();

  return (
    <>
      <section
        id="contact"
        className={styles.section}
        aria-labelledby="contact-heading"
      >
        <div className={`page-container ${styles.container}`}>
          <h2 id="contact-heading" className={styles.eyebrow}>
            06 / {label}
          </h2>

          <div className={styles.contactBody}>
            <p className={styles.closingLine}>{heading}</p>
            <p className={styles.description}>{description}</p>
          </div>

          <div className={styles.contactDetails}>
            <div className={styles.emailBlock}>
              <p className={styles.actionLabel}>{emailLabel}</p>
              <div className={styles.emailLine}>
                <a
                  className={styles.emailAddress}
                  href={destinations.email.href}
                >
                  {destinations.email.address}
                </a>
                <CopyEmailButton
                  copiedLabel={copiedLabel}
                  email={destinations.email.address}
                  label={copyEmailLabel}
                />
              </div>
            </div>

            <div className={styles.controlRow}>
              <div
                className={styles.socialControl}
                role="group"
                aria-label={socialLinksLabel}
              >
                <span className={styles.socialLabel}>{connectLabel}</span>
                <span className={styles.socialLinks}>
                  <a
                    className={styles.socialLink}
                    href={destinations.github.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={githubLabel}
                  >
                    <GitHubIcon />
                  </a>
                  <a
                    className={styles.socialLink}
                    href={destinations.linkedin.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={linkedinLabel}
                  >
                    <LinkedInIcon />
                  </a>
                </span>
              </div>

              <a
                className={styles.resumeLink}
                href={destinations.resume.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {viewResumeLabel} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`page-container ${styles.footerInner}`}>
          <div>
            <p className={styles.footerName}>{footerName}</p>
            <p className={styles.footerRole}>{footerRole}</p>
          </div>
          <div className={styles.footerMeta}>
            <p>© {currentYear}</p>
            <p>{builtWithLabel}</p>
          </div>
        </div>
      </footer>

      <BackToTop label={backToTopLabel} />
    </>
  );
}
