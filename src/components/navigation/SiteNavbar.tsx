"use client";

import { useEffect, useRef, useState } from "react";

import type { NavigationItem } from "../../content";
import {
  TASKFLOW_SCROLL_EVENT,
  type ScrollExpandProgressDetail,
} from "../../lib/scroll-events";
import styles from "./SiteNavbar.module.css";

interface SiteNavbarProps {
  items: readonly NavigationItem[];
  resumeLabel: string;
}

export function SiteNavbar({ items, resumeLabel }: SiteNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let animationFrame = 0;

    const updateScrollState = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 64);
      });
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleTaskFlowProgress = (event: Event) => {
      const { active, progress } = (
        event as CustomEvent<ScrollExpandProgressDetail>
      ).detail;
      const normalized = Math.min(
        1,
        Math.max(0, (progress - 0.65) / (0.82 - 0.65)),
      );
      const eased = normalized * normalized * (3 - 2 * normalized);
      const visibilityProgress = active ? eased : 0;
      const hidden = visibilityProgress >= 0.995;

      header.style.setProperty(
        "--taskflow-nav-progress",
        visibilityProgress.toFixed(4),
      );
      header.dataset.taskflowHidden = hidden ? "true" : "false";
      header.inert = hidden;
      header.setAttribute("aria-hidden", hidden ? "true" : "false");
    };

    window.addEventListener(TASKFLOW_SCROLL_EVENT, handleTaskFlowProgress);

    return () => {
      window.removeEventListener(TASKFLOW_SCROLL_EVENT, handleTaskFlowProgress);
      header.style.removeProperty("--taskflow-nav-progress");
      delete header.dataset.taskflowHidden;
      header.inert = false;
      header.removeAttribute("aria-hidden");
    };
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 48rem)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };

    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstMenuLinkRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsMenuOpen(false);
      requestAnimationFrame(() => menuButtonRef.current?.focus());
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-scrolled={isScrolled ? "true" : "false"}
      data-menu-open={isMenuOpen ? "true" : "false"}
    >
      <div className={`page-container ${styles.headerContainer}`}>
        <div className={styles.navShell}>
          <a className={styles.monogram} href="#top" onClick={closeMenu}>
            <span aria-hidden="true">CW</span>
            <span className={styles.visuallyHidden}>Chenchang Wang, home</span>
          </a>

          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {items.map((item) => (
              <a key={item.id} className={styles.navLink} href={item.target}>
                {item.label}
              </a>
            ))}
            <a
              className={styles.navLink}
              href="/resumes/resume-en.pdf"
              target="_blank"
              rel="noreferrer"
              aria-label={`${resumeLabel}, opens PDF in a new tab`}
            >
              {resumeLabel} <span aria-hidden="true">↗</span>
            </a>
          </nav>

          <button
            ref={menuButtonRef}
            className={styles.menuButton}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={styles.mobilePanel}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        hidden={!isMenuOpen}
      >
        <div className={`page-container ${styles.mobilePanelInner}`}>
          <nav className={styles.mobileNav} aria-label="Mobile primary navigation">
            {items.map((item, index) => (
              <a
                ref={index === 0 ? firstMenuLinkRef : undefined}
                key={item.id}
                className={styles.mobileLink}
                href={item.target}
                onClick={closeMenu}
              >
                <span>{item.label}</span>
                <span aria-hidden="true">↘</span>
              </a>
            ))}
            <a
              className={styles.mobileLink}
              href="/resumes/resume-en.pdf"
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              aria-label={`${resumeLabel}, opens PDF in a new tab`}
            >
              <span>{resumeLabel}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
