"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  ASCIIText,
  type NormalizedPointerVector,
  type SharedInteractionScale,
} from "./ASCIIText";
import styles from "./AsciiName.module.css";

function subscribeToMediaQuery(query: string, callback: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => subscribeToMediaQuery(query, callback),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function AsciiName() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pointerVectorRef = useRef<NormalizedPointerVector>({ x: 0, y: 0 });
  const smoothedPointerRef = useRef<NormalizedPointerVector>({ x: 0, y: 0 });
  const interactionScaleRef = useRef<SharedInteractionScale>({ value: 1 });
  const isMobile = useMediaQuery("(max-width: 47.999rem)");
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const animate = !reducedMotion;
  const enablePointerInteraction =
    !reducedMotion && !isMobile && !isCoarsePointer;
  const scaleMode = isMobile ? "mobile" : "desktop";
  const [sharedScale, setSharedScale] = useState<{
    mode: typeof scaleMode;
    screenPlaneHeight: number;
  } | null>(null);
  const handlePrimaryFit = useCallback(
    (screenPlaneHeight: number) => {
      setSharedScale((current) => {
        if (
          current?.mode === scaleMode &&
          Math.abs(current.screenPlaneHeight - screenPlaneHeight) < 0.1
        ) {
          return current;
        }

        return { mode: scaleMode, screenPlaneHeight };
      });
    },
    [scaleMode],
  );
  const sharedScreenPlaneHeight =
    sharedScale?.mode === scaleMode
      ? sharedScale.screenPlaneHeight
      : undefined;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !enablePointerInteraction) {
      pointerVectorRef.current.x = 0;
      pointerVectorRef.current.y = 0;
      smoothedPointerRef.current.x = 0;
      smoothedPointerRef.current.y = 0;
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = wrapper.getBoundingClientRect();
      const halfWidth = Math.max(bounds.width / 2, 1);
      const halfHeight = Math.max(bounds.height / 2, 1);
      const centerX = bounds.left + halfWidth;
      const centerY = bounds.top + halfHeight;
      const normalizedX = Math.max(
        -1,
        Math.min(1, (event.clientX - centerX) / halfWidth),
      );
      const normalizedY = Math.max(
        -1,
        Math.min(1, (event.clientY - centerY) / halfHeight),
      );

      pointerVectorRef.current.x = normalizedX;
      pointerVectorRef.current.y = normalizedY;
      wrapper.dataset.pointerX = normalizedX.toFixed(3);
      wrapper.dataset.pointerY = normalizedY.toFixed(3);
    };

    document.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => document.removeEventListener("pointermove", handlePointerMove);
  }, [enablePointerInteraction]);

  return (
    <div ref={wrapperRef} className={styles.wrapper} aria-hidden="true">
      <div className={`${styles.line} ${styles.primaryLine}`}>
        <ASCIIText
          className={styles.asciiText}
          text="CHENCHANG"
          asciiFontSize={7}
          textFontSize={isMobile ? 220 : 300}
          textColor="#fdf9f3"
          planeBaseHeight={isMobile ? 7.4 : 20}
          enableWaves={!reducedMotion}
          animate={animate}
          enablePointerInteraction={enablePointerInteraction}
          fitWidthRatio={0.94}
          extremeFitWidthRatio={0.98}
          maxPointerRotationX={0.42}
          maxPointerRotationY={0.2}
          pointerFollow={0.07}
          rotationFollow={0.07}
          pointerVectorRef={pointerVectorRef}
          smoothedPointerRef={smoothedPointerRef}
          drivesPointerSmoothing
          interactionScaleRef={interactionScaleRef}
          drivesInteractionScale
          onScreenPlaneHeightFit={handlePrimaryFit}
        />
      </div>

      <div className={`${styles.line} ${styles.secondaryLine}`}>
        {sharedScreenPlaneHeight !== undefined ? (
          <ASCIIText
            className={styles.asciiText}
            text="WANG"
            asciiFontSize={7}
            textFontSize={isMobile ? 220 : 300}
            textColor="#fdf9f3"
            planeBaseHeight={isMobile ? 12.5 : 21}
            enableWaves={!reducedMotion}
            animate={animate}
            enablePointerInteraction={enablePointerInteraction}
            fitWidthRatio={0.94}
            extremeFitWidthRatio={0.98}
            maxPointerRotationX={0.42}
            maxPointerRotationY={0.2}
            pointerFollow={0.07}
            rotationFollow={0.07}
            pointerVectorRef={pointerVectorRef}
            smoothedPointerRef={smoothedPointerRef}
            interactionScaleRef={interactionScaleRef}
            sharedScreenPlaneHeight={sharedScreenPlaneHeight}
          />
        ) : null}
      </div>
    </div>
  );
}
