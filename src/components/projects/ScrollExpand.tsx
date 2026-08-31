"use client";

import {
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

import type { ScrollExpandProgressDetail } from "../../lib/scroll-events";
import styles from "./ScrollExpand.module.css";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const progress = clamp((value - edge0) / (edge1 - edge0));
  return progress * progress * (3 - 2 * progress);
};

export interface ScrollExpandProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  readonly src?: string;
  readonly alt?: string;
  readonly title: string;
  readonly scrollHint?: string;
  readonly mediaType?: "image" | "video";
  readonly mediaContent?: ReactNode;
  readonly children?: ReactNode;
  readonly startWidth?: number;
  readonly startHeight?: number;
  readonly startRadius?: number;
  readonly endRadius?: number;
  readonly mediaZoom?: number;
  readonly overlayScrim?: number;
  readonly scrollDistance?: number;
  readonly holdDistance?: number;
  readonly smoothing?: number;
  readonly useWindowScroll?: boolean;
  readonly progressEventName?: string;
}

export function ScrollExpand({
  src,
  alt = "",
  title,
  scrollHint = "Scroll",
  mediaType = "image",
  mediaContent,
  children,
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  overlayScrim = 0.45,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  useWindowScroll = true,
  progressEventName,
  className,
  ...rest
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaShellRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    const frame = frameRef.current;
    const mediaShell = mediaShellRef.current;
    const titleElement = titleRef.current;
    const overlay = overlayRef.current;
    const scrim = scrimRef.current;
    const hint = hintRef.current;

    if (
      !root ||
      !track ||
      !stage ||
      !frame ||
      !mediaShell ||
      !titleElement ||
      !overlay ||
      !scrim ||
      !hint
    ) {
      return;
    }

    mediaRef.current =
      mediaShell.querySelector<HTMLElement>("[data-scroll-expand-media]") ??
      mediaShell;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let compact = false;
    let stageHeight = window.innerHeight;
    let currentProgress = reducedMotion ? 1 : 0;
    let targetProgress = currentProgress;
    let animationFrame = 0;

    const applyProgress = (rawProgress: number) => {
      const progress = clamp(rawProgress);
      const atEnd = progress >= 0.995;
      const eased = atEnd ? 1 : smoothstep(0, 1, progress);
      const resolvedStartWidth = compact ? 82 : startWidth;
      const resolvedStartHeight = compact ? 52 : startHeight;
      const resolvedStartRadius = compact
        ? Math.min(startRadius, 16)
        : startRadius;
      const width = resolvedStartWidth + (100 - resolvedStartWidth) * eased;
      const height = resolvedStartHeight + (100 - resolvedStartHeight) * eased;
      const insetX = (100 - width) / 2;
      const insetY = (100 - height) / 2;
      const radius =
        resolvedStartRadius + (endRadius - resolvedStartRadius) * eased;
      const mediaScale = mediaZoom + (1 - mediaZoom) * eased;
      const titleOpacity = 1 - smoothstep(0.4, 0.88, progress);
      const hintOpacity = 1 - smoothstep(0, 0.12, progress);
      const overlayProgress = smoothstep(0.68, 1, progress);
      const interactive = progress >= 0.88;

      frame.style.clipPath = atEnd
        ? "inset(0 0 0 0 round 0px)"
        : `inset(${insetY}% ${insetX}% round ${radius}px)`;
      mediaShell.style.inset = atEnd ? "0" : `${insetY}% ${insetX}%`;
      mediaShell.style.borderRadius = atEnd ? "0" : `${radius}px`;

      if (mediaRef.current) {
        mediaRef.current.style.transform = `scale(${mediaScale})`;
      }

      titleElement.style.opacity = `${titleOpacity}`;
      hint.style.opacity = `${hintOpacity}`;
      scrim.style.opacity = `${overlayScrim * eased}`;
      overlay.style.opacity = `${overlayProgress}`;
      overlay.style.transform = `translate3d(0, ${24 * (1 - overlayProgress)}px, 0)`;
      overlay.style.pointerEvents = interactive ? "auto" : "none";
      overlay.setAttribute("aria-hidden", interactive ? "false" : "true");
      overlay.inert = !interactive;
      mediaShell.inert = false;
      root.dataset.scrollExpandExpanded = interactive ? "true" : "false";
      root.dataset.scrollExpandProgress = progress.toFixed(3);

      const trackRect = track.getBoundingClientRect();
      const detail: ScrollExpandProgressDetail = {
        active: reducedMotion
          ? trackRect.top <= 0 && trackRect.bottom > 0
          : trackRect.top <= 0 && trackRect.bottom >= stageHeight,
        progress,
      };
      if (progressEventName) {
        window.dispatchEvent(
          new CustomEvent<ScrollExpandProgressDetail>(progressEventName, {
            detail,
          }),
        );
      }
    };

    const measure = () => {
      stageHeight = useWindowScroll
        ? window.innerHeight
        : stage.getBoundingClientRect().height;
      compact = root.getBoundingClientRect().width <= 640;
      track.style.height = reducedMotion
        ? `${stageHeight}px`
        : `${stageHeight * (1 + scrollDistance + holdDistance)}px`;
      titleElement.style.fontSize = `clamp(3rem, ${compact ? "17vw" : "12vw"}, 12rem)`;
    };

    const readProgress = () => {
      if (reducedMotion) return 1;

      if (useWindowScroll) {
        const trackTop = track.getBoundingClientRect().top;
        return clamp(-trackTop / (stageHeight * scrollDistance));
      }

      return clamp(root.scrollTop / (stageHeight * scrollDistance));
    };

    const render = () => {
      const follow =
        smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * smoothing));
      currentProgress += (targetProgress - currentProgress) * follow;

      if (Math.abs(targetProgress - currentProgress) < 0.0005) {
        currentProgress = targetProgress;
      }

      applyProgress(currentProgress);

      if (currentProgress !== targetProgress) {
        animationFrame = window.requestAnimationFrame(render);
      } else {
        animationFrame = 0;
      }
    };

    const requestRender = () => {
      targetProgress = readProgress();

      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      measure();
      currentProgress = reducedMotion ? 1 : readProgress();
      targetProgress = currentProgress;
      applyProgress(currentProgress);
    };

    const scrollTarget: Window | HTMLDivElement = useWindowScroll
      ? window
      : root;
    const resizeObserver = new ResizeObserver(() => {
      measure();
      requestRender();
    });

    measure();
    currentProgress = readProgress();
    targetProgress = currentProgress;
    applyProgress(currentProgress);

    scrollTarget.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", measure);
    motionQuery.addEventListener("change", onMotionPreferenceChange);
    resizeObserver.observe(stage);

    return () => {
      if (progressEventName) {
        window.dispatchEvent(
          new CustomEvent<ScrollExpandProgressDetail>(progressEventName, {
            detail: { active: false, progress: 0 },
          }),
        );
      }
      scrollTarget.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", measure);
      motionQuery.removeEventListener("change", onMotionPreferenceChange);
      resizeObserver.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [
    endRadius,
    holdDistance,
    mediaZoom,
    overlayScrim,
    progressEventName,
    scrollDistance,
    smoothing,
    startHeight,
    startRadius,
    startWidth,
    useWindowScroll,
  ]);

  const rootClassName = className
    ? `${styles.root} ${className}`
    : styles.root;

  return (
    <div ref={rootRef} className={rootClassName} {...rest}>
      <div ref={trackRef} className={styles.track}>
        <div ref={stageRef} className={styles.stage}>
          <div ref={frameRef} className={styles.frame}>
            <div ref={mediaShellRef} className={styles.mediaShell}>
              {mediaContent ??
                (mediaType === "video" ? (
                  <video
                    className={styles.fallbackMedia}
                    data-scroll-expand-media
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className={styles.fallbackMedia}
                    data-scroll-expand-media
                    src={src}
                    alt={alt}
                  />
                ))}
            </div>
            <div ref={scrimRef} className={styles.scrim} aria-hidden="true" />
            <div
              ref={overlayRef}
              className={styles.overlay}
              aria-hidden="true"
              inert
            >
              {children}
            </div>
          </div>

          <h2 ref={titleRef} className={styles.title} aria-hidden="true">
            {title}
          </h2>
          <p ref={hintRef} className={styles.hint}>
            {scrollHint}
          </p>
        </div>
      </div>
    </div>
  );
}
