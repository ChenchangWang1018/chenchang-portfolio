"use client";

import {
  Fragment,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  LOCALE_ROUTES,
  ROUTE_LOCALES,
  type RouteLocale,
} from "../../config/locales";
import type { InterfaceContent, NavigationItem } from "../../content";
import {
  TASKFLOW_SCROLL_EVENT,
  type ScrollExpandProgressDetail,
} from "../../lib/scroll-events";
import styles from "./SiteNavbar.module.css";

interface SiteNavbarProps {
  items: readonly NavigationItem[];
  locale: RouteLocale;
  resumeHref: string;
  resumeLabel: string;
  ui: InterfaceContent;
}

const NAVIGATION_SCROLL_DURATION = 550;
const NAVIGATION_BREATHING_GAP = 20;

function easeNavigationScroll(progress: number) {
  const x1 = 0.22;
  const y1 = 1;
  const x2 = 0.36;
  const y2 = 1;

  const sample = (time: number, first: number, second: number) => {
    const inverse = 1 - time;
    return (
      3 * inverse * inverse * time * first +
      3 * inverse * time * time * second +
      time * time * time
    );
  };

  const sampleDerivative = (time: number) =>
    3 * (1 - time) * (1 - time) * x1 +
    6 * (1 - time) * time * (x2 - x1) +
    3 * time * time * (1 - x2);

  let time = progress;
  for (let iteration = 0; iteration < 5; iteration += 1) {
    const derivative = sampleDerivative(time);
    if (Math.abs(derivative) < 0.0001) break;
    time -= (sample(time, x1, x2) - progress) / derivative;
    time = Math.min(1, Math.max(0, time));
  }

  return sample(time, y1, y2);
}

export function SiteNavbar({
  items,
  locale,
  resumeHref,
  resumeLabel,
  ui,
}: SiteNavbarProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const navigationFrameRef = useRef<number | null>(null);
  const pendingMobileTargetRef = useRef<string | null>(null);
  const pendingLocaleHrefRef = useRef<string | null>(null);
  const taskFlowProgressRef = useRef<ScrollExpandProgressDetail>({
    active: false,
    progress: 0,
  });

  const cancelNavigationScroll = useCallback(() => {
    if (navigationFrameRef.current === null) return;
    cancelAnimationFrame(navigationFrameRef.current);
    navigationFrameRef.current = null;
  }, []);

  const updateHash = useCallback((target: string) => {
    const method = window.location.hash === target ? "replaceState" : "pushState";
    window.history[method](null, "", target);
  }, []);

  const scrollToTarget = useCallback(
    (target: string) => {
      const targetElement = document.querySelector<HTMLElement>(target);
      if (!targetElement) return;

      cancelNavigationScroll();

      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0;
      const unclampedTarget =
        window.scrollY +
        targetElement.getBoundingClientRect().top -
        headerHeight -
        NAVIGATION_BREATHING_GAP;
      const maximumScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = Math.min(
        maximumScroll,
        Math.max(0, unclampedTarget),
      );
      const startScroll = window.scrollY;
      const distance = targetScroll - startScroll;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion || Math.abs(distance) < 1) {
        window.scrollTo(0, targetScroll);
        updateHash(target);
        return;
      }

      const startTime = performance.now();
      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / NAVIGATION_SCROLL_DURATION);
        const easedProgress = easeNavigationScroll(progress);

        window.scrollTo(0, startScroll + distance * easedProgress);

        if (progress < 1) {
          navigationFrameRef.current = requestAnimationFrame(animateScroll);
          return;
        }

        navigationFrameRef.current = null;
        updateHash(target);
      };

      navigationFrameRef.current = requestAnimationFrame(animateScroll);
    },
    [cancelNavigationScroll, updateHash],
  );

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
    window.addEventListener("wheel", cancelNavigationScroll, { passive: true });
    window.addEventListener("touchstart", cancelNavigationScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", cancelNavigationScroll);
      window.removeEventListener("touchstart", cancelNavigationScroll);
      cancelNavigationScroll();
    };
  }, [cancelNavigationScroll]);

  const applyTaskFlowHeaderState = useCallback(
    ({ active, progress }: ScrollExpandProgressDetail, menuOpen: boolean) => {
      const header = headerRef.current;
      if (!header) return;

      const normalized = Math.min(
        1,
        Math.max(0, (progress - 0.65) / (0.82 - 0.65)),
      );
      const eased = normalized * normalized * (3 - 2 * normalized);
      const visibilityProgress = menuOpen ? 0 : active ? eased : 0;
      const hidden = visibilityProgress >= 0.995;

      header.style.setProperty(
        "--taskflow-nav-progress",
        visibilityProgress.toFixed(4),
      );
      header.dataset.taskflowHidden = hidden ? "true" : "false";
      header.inert = hidden;
      header.setAttribute("aria-hidden", hidden ? "true" : "false");
    },
    [],
  );

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleTaskFlowProgress = (event: Event) => {
      const detail = (
        event as CustomEvent<ScrollExpandProgressDetail>
      ).detail;
      taskFlowProgressRef.current = detail;
      applyTaskFlowHeaderState(
        detail,
        header.dataset.menuOpen === "true",
      );
    };

    window.addEventListener(TASKFLOW_SCROLL_EVENT, handleTaskFlowProgress);

    return () => {
      window.removeEventListener(TASKFLOW_SCROLL_EVENT, handleTaskFlowProgress);
      header.style.removeProperty("--taskflow-nav-progress");
      delete header.dataset.taskflowHidden;
      header.inert = false;
      header.removeAttribute("aria-hidden");
    };
  }, [applyTaskFlowHeaderState]);

  useEffect(() => {
    applyTaskFlowHeaderState(taskFlowProgressRef.current, isMenuOpen);
  }, [applyTaskFlowHeaderState, isMenuOpen]);

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

    const lockedScrollY = window.scrollY;
    const documentElement = document.documentElement;
    const body = document.body;
    const previousDocumentOverflow = documentElement.style.overflow;
    const previousDocumentOverscroll = documentElement.style.overscrollBehavior;
    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = body.style.overscrollBehavior;
    const previousPosition = body.style.position;
    const previousTop = body.style.top;
    const previousWidth = body.style.width;

    documentElement.style.overflow = "hidden";
    documentElement.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.top = `-${lockedScrollY}px`;
    body.style.width = "100%";
    firstMenuLinkRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsMenuOpen(false);
      requestAnimationFrame(() => menuButtonRef.current?.focus());
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      documentElement.style.overflow = previousDocumentOverflow;
      documentElement.style.overscrollBehavior = previousDocumentOverscroll;
      body.style.overflow = previousOverflow;
      body.style.overscrollBehavior = previousOverscroll;
      body.style.position = previousPosition;
      body.style.top = previousTop;
      body.style.width = previousWidth;
      window.scrollTo(0, lockedScrollY);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) return;

    if (pendingLocaleHrefRef.current) {
      const href = pendingLocaleHrefRef.current;
      pendingLocaleHrefRef.current = null;
      const routeFrame = requestAnimationFrame(() => router.push(href));

      return () => cancelAnimationFrame(routeFrame);
    }

    if (!pendingMobileTargetRef.current) return;

    const target = pendingMobileTargetRef.current;
    pendingMobileTargetRef.current = null;
    const animationFrame = requestAnimationFrame(() => scrollToTarget(target));

    return () => cancelAnimationFrame(animationFrame);
  }, [isMenuOpen, router, scrollToTarget]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleSectionNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    target: string,
    fromMobileMenu = false,
  ) => {
    event.preventDefault();

    if (fromMobileMenu) {
      pendingMobileTargetRef.current = target;
      setIsMenuOpen(false);
      return;
    }

    scrollToTarget(target);
  };

  const handleLocaleNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    targetLocale: RouteLocale,
    fromMobileMenu = false,
  ) => {
    event.preventDefault();
    cancelNavigationScroll();

    const destination = `${LOCALE_ROUTES[targetLocale].path}${window.location.hash}`;

    if (fromMobileMenu) {
      pendingLocaleHrefRef.current = destination;
      setIsMenuOpen(false);
      return;
    }

    router.push(destination);
  };

  const renderLocaleSwitcher = (mobile = false) => (
    <div
      className={`${styles.localeSwitcher} ${
        mobile ? styles.mobileLocaleSwitcher : ""
      }`}
      aria-label={ui.languageLabel}
    >
      {ROUTE_LOCALES.map((routeLocale, index) => (
        <Fragment key={routeLocale}>
          {index > 0 ? (
            <span className={styles.localeSeparator} aria-hidden="true">
              /
            </span>
          ) : null}
          {routeLocale === locale ? (
            <span className={styles.localeCurrent} aria-current="page">
              {LOCALE_ROUTES[routeLocale].label}
            </span>
          ) : (
            <a
              className={styles.localeLink}
              href={LOCALE_ROUTES[routeLocale].path}
              hrefLang={LOCALE_ROUTES[routeLocale].htmlLang}
              lang={LOCALE_ROUTES[routeLocale].htmlLang}
              onClick={(event) =>
                handleLocaleNavigation(event, routeLocale, mobile)
              }
            >
              {LOCALE_ROUTES[routeLocale].label}
            </a>
          )}
        </Fragment>
      ))}
    </div>
  );

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-scrolled={isScrolled ? "true" : "false"}
      data-menu-open={isMenuOpen ? "true" : "false"}
    >
      <div className={`page-container ${styles.headerContainer}`}>
        <div className={styles.navShell}>
          <a
            className={styles.monogram}
            href="#top"
            onClick={(event) =>
              handleSectionNavigation(event, "#top", isMenuOpen)
            }
          >
            <span aria-hidden="true">CW</span>
            <span className={styles.visuallyHidden}>{ui.homeLabel}</span>
          </a>

          <nav
            className={styles.desktopNav}
            aria-label={ui.primaryNavigationLabel}
          >
            {items.map((item) => (
              <a
                key={item.id}
                className={styles.navLink}
                href={item.target}
                onClick={(event) =>
                  handleSectionNavigation(event, item.target)
                }
              >
                {item.label}
              </a>
            ))}
            <a
              className={styles.navLink}
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${resumeLabel}, ${ui.opensNewTabLabel}`}
            >
              {resumeLabel} <span aria-hidden="true">↗</span>
            </a>
            {renderLocaleSwitcher()}
          </nav>

          <button
            ref={menuButtonRef}
            className={styles.menuButton}
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? ui.closeMenuLabel : ui.menuLabel}
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={styles.mobilePanel}
        role="dialog"
        aria-modal="true"
        aria-label={ui.mobileNavigationLabel}
        hidden={!isMenuOpen}
      >
        <div className={`page-container ${styles.mobilePanelInner}`}>
          <nav
            className={styles.mobileNav}
            aria-label={ui.mobilePrimaryNavigationLabel}
          >
            {items.map((item, index) => (
              <a
                ref={index === 0 ? firstMenuLinkRef : undefined}
                key={item.id}
                className={styles.mobileLink}
                href={item.target}
                onClick={(event) =>
                  handleSectionNavigation(event, item.target, true)
                }
              >
                <span>{item.label}</span>
                <span aria-hidden="true">↘</span>
              </a>
            ))}
            <a
              className={styles.mobileLink}
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              aria-label={`${resumeLabel}, ${ui.opensNewTabLabel}`}
            >
              <span>{resumeLabel}</span>
              <span aria-hidden="true">↗</span>
            </a>
            {renderLocaleSwitcher(true)}
          </nav>
        </div>
      </div>
    </header>
  );
}
