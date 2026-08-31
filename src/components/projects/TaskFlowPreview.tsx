"use client";

import Image from "next/image";
import { type MouseEvent, type PointerEvent, useRef } from "react";

import styles from "./TaskFlowSection.module.css";

interface PointerOrigin {
  readonly x: number;
  readonly y: number;
  readonly scrollY: number;
}

interface TaskFlowPreviewProps {
  readonly href: string;
  readonly imageSrc: string;
}

export function TaskFlowPreview({ href, imageSrc }: TaskFlowPreviewProps) {
  const pointerOrigin = useRef<PointerOrigin | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    pointerOrigin.current = {
      x: event.clientX,
      y: event.clientY,
      scrollY: window.scrollY,
    };
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const origin = pointerOrigin.current;
    pointerOrigin.current = null;

    if (!origin) return;

    const pointerTravel = Math.hypot(
      event.clientX - origin.x,
      event.clientY - origin.y,
    );
    const scrollTravel = Math.abs(window.scrollY - origin.scrollY);

    if (pointerTravel > 8 || scrollTravel > 6) {
      event.preventDefault();
    }
  };

  return (
    <div className={styles.browserWindow}>
      <a
        className={styles.browserHitArea}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open the live TaskFlow application in a new tab"
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      />
      <span className={styles.browserBar}>
        <span className={styles.browserControls} aria-hidden="true">
          <span className={`${styles.browserControl} ${styles.controlClose}`} />
          <span
            className={`${styles.browserControl} ${styles.controlMinimize}`}
          />
          <span
            className={`${styles.browserControl} ${styles.controlMaximize}`}
          />
        </span>
        <a
          className={styles.browserLabel}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onPointerDown={handlePointerDown}
          onClick={handleClick}
        >
          TASKFLOW / LIVE ↗
        </a>
      </span>
      <span className={styles.browserViewport}>
        <Image
          className={styles.browserImage}
          data-scroll-expand-media
          src={imageSrc}
          alt="TaskFlow distributed operations dashboard showing task lifecycle and worker state"
          width={2544}
          height={1468}
          sizes="100vw"
          loading="eager"
          draggable={false}
        />
      </span>
    </div>
  );
}
