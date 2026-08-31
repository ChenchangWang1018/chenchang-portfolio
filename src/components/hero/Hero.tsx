"use client";

import { useEffect, useRef } from "react";

import { AsciiName } from "./AsciiName";
import styles from "./Hero.module.css";

interface HeroProps {
  name: string;
  headline: string;
  summary: string;
}

export function Hero({ name, headline, summary }: HeroProps) {
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const visual = visualRef.current;
    if (!visual) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    const resetVisual = () => {
      visual.style.opacity = "1";
      visual.style.transform = "none";
      visual.style.filter = "none";
    };

    const updateExit = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        if (reducedMotion.matches) {
          resetVisual();
          return;
        }

        const exitDistance = Math.min(window.innerHeight * 0.24, 240);
        const progress = Math.min(window.scrollY / Math.max(exitDistance, 1), 1);
        visual.style.opacity = String(1 - progress * 0.8);
        visual.style.transform = `translate3d(0, ${-progress * 56}px, 0) scale(${1 - progress * 0.04})`;
        visual.style.filter = `blur(${progress * 1.25}px)`;
      });
    };

    updateExit();
    window.addEventListener("scroll", updateExit, { passive: true });
    window.addEventListener("resize", updateExit);
    reducedMotion.addEventListener("change", updateExit);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateExit);
      window.removeEventListener("resize", updateExit);
      reducedMotion.removeEventListener("change", updateExit);
    };
  }, []);

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-name">
      <div className={`page-container ${styles.viewport}`}>
        <div ref={visualRef} className={styles.visual}>
          <AsciiName />
        </div>

        <div className={styles.footer}>
          <div className={styles.identity}>
            <h1 id="hero-name" className={styles.name}>
              {name}
            </h1>
            <p className={styles.headline}>{headline}</p>
            <p className={styles.summary}>{summary}</p>
          </div>

          <p className={styles.scrollCue} aria-hidden="true">
            Scroll to explore ↓
          </p>
        </div>
      </div>
    </section>
  );
}
