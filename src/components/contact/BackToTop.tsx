"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import styles from "./BackToTop.module.css";

interface BackToTopProps {
  readonly label: string;
}

export function BackToTop({ label }: BackToTopProps) {
  const [visible, setVisible] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);

  useEffect(() => {
    let animationFrame = 0;

    const updateVisibility = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        setVisible(window.scrollY > Math.max(720, window.innerHeight * 1.25));
      });
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) => {
      setNearFooter(entry.isIntersecting);
    });

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      className={styles.button}
      type="button"
      data-visible={visible}
      data-near-footer={nearFooter}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={scrollToTop}
      aria-label={label}
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.arrow} aria-hidden="true">
        <ArrowUp strokeWidth={1.5} />
      </span>
    </button>
  );
}
