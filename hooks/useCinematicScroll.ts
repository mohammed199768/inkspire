"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageVisibility } from "./usePageVisibility";
import { useResponsiveMode } from "./useResponsiveMode";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// TYPES
// ============================================================================
interface UseCinematicScrollOptions {
  excludePaths?: string[];
  lenisConfig?: Partial<ConstructorParameters<typeof Lenis>[0]>;
}

interface UseCinematicScrollReturn {
  lenis: Lenis | null;
  isActive: boolean;
  scrollTo: (target: number | string | HTMLElement, options?: object) => void;
}

// ============================================================================
// DEFAULT EXCLUDED PATHS
// ============================================================================
const DEFAULT_EXCLUDED_PATHS = ["/", "/experience"];

// ============================================================================
// THE HOOK
// ============================================================================
export function useCinematicScroll(
  options: UseCinematicScrollOptions = {}
): UseCinematicScrollReturn {
  const { excludePaths = DEFAULT_EXCLUDED_PATHS, lenisConfig = {} } = options;

  const { scrollMode, prefersReducedMotion, isHydrated } = useResponsiveMode();
  const pathname = usePathname();
  const isPageVisible = usePageVisibility();

  const lenisRef = useRef<Lenis | null>(null);
  const isActiveRef = useRef(false);
  
  // GSAP ticker callback ref - for proper cleanup
  const tickerCallbackRef = useRef<((time: number) => void) | null>(null);
  
  // Store previous lagSmoothing to restore on cleanup
  const prevLagSmoothingRef = useRef<{ lag: number; minDuration: number } | null>(null);

  // Check if current path is excluded
  const isExcludedPath = excludePaths.some(
    (path) => pathname === path || pathname?.startsWith(path + "/")
  );

  // Determine if we should activate cinematic scroll
  const shouldActivate =
    isHydrated &&
    scrollMode === "cinematic" &&
    !isExcludedPath &&
    !prefersReducedMotion;

  // ============================================================================
  // AGGRESSIVE CLEANUP FUNCTION
  // ============================================================================
  const cleanup = useCallback(() => {
    // 1. Remove GSAP ticker callback
    if (tickerCallbackRef.current) {
      gsap.ticker.remove(tickerCallbackRef.current);
      tickerCallbackRef.current = null;
    }

    // 2. Restore lagSmoothing if we changed it
    if (prevLagSmoothingRef.current) {
      gsap.ticker.lagSmoothing(
        prevLagSmoothingRef.current.lag,
        prevLagSmoothingRef.current.minDuration
      );
      prevLagSmoothingRef.current = null;
    }

    // 3. Destroy Lenis
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
    }

    // 4. Kill ALL ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    ScrollTrigger.clearScrollMemory();
    ScrollTrigger.refresh();

    // 5. Reset body styles
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.documentElement.style.scrollBehavior = "";
    }

    isActiveRef.current = false;
  }, []);

  // ============================================================================
  // INITIALIZATION EFFECT
  // ============================================================================
  useEffect(() => {
    if (typeof window === "undefined") return;

    // If we shouldn't activate, ensure cleanup and exit
    if (!shouldActivate) {
      cleanup();
      return;
    }

    // Already active? Skip re-init
    if (isActiveRef.current && lenisRef.current) {
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 0,
      infinite: false,
      ...lenisConfig,
    });

    lenisRef.current = lenis;

    // Sync Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Store current lagSmoothing before changing
    // Note: GSAP doesn't expose current values, so we store our change flag
    prevLagSmoothingRef.current = { lag: 500, minDuration: 33 }; // GSAP defaults
    gsap.ticker.lagSmoothing(0);

    // Create ticker callback and store ref for cleanup
    const tickerCallback = (time: number) => {
      if (lenisRef.current) {
        lenisRef.current.raf(time * 1000);
      }
    };
    tickerCallbackRef.current = tickerCallback;
    gsap.ticker.add(tickerCallback);

    isActiveRef.current = true;

    // Cleanup on unmount or mode change
    return cleanup;
  }, [shouldActivate, cleanup, lenisConfig]);

  // ============================================================================
  // PAGE VISIBILITY EFFECT
  // ============================================================================
  useEffect(() => {
    if (!lenisRef.current) return;

    if (isPageVisible) {
      lenisRef.current.start();
    } else {
      lenisRef.current.stop();
    }
  }, [isPageVisible]);

  // ============================================================================
  // SCROLL TO METHOD
  // ============================================================================
  const scrollTo = useCallback(
    (target: number | string | HTMLElement, options?: object) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, options);
      } else if (typeof window !== "undefined") {
        if (typeof target === "number") {
          window.scrollTo({ top: target, behavior: "smooth" });
        } else if (typeof target === "string") {
          const element = document.querySelector(target);
          element?.scrollIntoView({ behavior: "smooth" });
        } else if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    []
  );

  return {
    lenis: lenisRef.current,
    isActive: isActiveRef.current,
    scrollTo,
  };
}
