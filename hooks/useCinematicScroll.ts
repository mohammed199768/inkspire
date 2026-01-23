"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageVisibility } from "./usePageVisibility";
import { useResponsiveMode } from "./useResponsiveMode";

// ============================================================================
// ARCHITECTURAL NOTE: LENIS SMOOTH SCROLL LIFECYCLE MANAGER
// ============================================================================
// This hook manages the complex lifecycle of Lenis smooth scroll and its
// integration with GSAP ScrollTrigger. It demonstrates the CORRECT pattern
// for integrating third-party animation libraries with React lifecycle.
//
// CRITICAL PATTERN DEMONSTRATED:
// - Storing callback refs for GSAP ticker removal (prevents memory leaks)
// - Aggressive cleanup of ALL resources (Lenis + ScrollTrigger + DOM state)
// - Conditional activation based on responsive mode
// - Path-based exclusion for custom scroll behavior
//
// MEMORY LEAK PREVENTION:
// GSAP ticker callbacks MUST be removed with exact function reference.
// We store the callback in tickerCallbackRef to enable proper cleanup.
// ============================================================================

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
// EXCLUDED: "/" (home), "/experience", and "/portfolio"
//
// WHY HOME IS EXCLUDED:
// - Home uses NineDimensionsLayout with custom section navigation
// - Desktop home has fixed viewport with AnimatePresence transitions
// - Lenis smooth scroll would conflict with section-by-section animation
//
// WHY "/experience" IS EXCLUDED:
// - Likely contains custom 3D navigation or scroll-jacking
//
// WHY "/portfolio" IS EXCLUDED (Added: 2026-01-23T22:31:09+03:00):
// - Architectural isolation: Portfolio system has independent boundary
// - Uses native scroll for better compatibility with WorksTunnel animations
// - Reduces coupling with global scroll lifecycle
// - Follows same pattern as home (custom interaction model)
//
// OTHER PATHS (contact, etc.):
// - USE Lenis for smooth, cinematic scroll experience
// ============================================================================
const DEFAULT_EXCLUDED_PATHS = ["/", "/experience", "/portfolio"];

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
  
  // ============================================================================
  // GSAP TICKER CALLBACK REF - Critical for proper cleanup
  // ============================================================================
  // PROBLEM: GSAP ticker.add() stores callbacks by reference.
  // If you pass an inline arrow function, you can't remove it later.
  //
  // ANTI-PATTERN:
  //   gsap.ticker.add((time) => lenis.raf(time)); // ❌ Can't remove!
  //
  // CORRECT PATTERN:
  //   const callback = (time) => lenis.raf(time);
  //   tickerCallbackRef.current = callback;
  //   gsap.ticker.add(callback);
  //   // Later: gsap.ticker.remove(tickerCallbackRef.current); ✅
  //
  // WHY: The cleanup function MUST reference the exact function that was added.
  // ============================================================================
  const tickerCallbackRef = useRef<((time: number) => void) | null>(null);
  
  // ============================================================================
  // LAGSMOOTHING STATE - Store original to restore on cleanup
  // ============================================================================
  // GSAP has a built-in lag smoothing feature (default: 500ms, 33ms).
  // We disable it (set to 0) because Lenis has its own timing system.
  // We store the previous value so we can restore it on cleanup (good citizen).
  // ============================================================================
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
  // 6-STEP CLEANUP PROCESS:
  // 1. Remove GSAP ticker callback (via stored ref)
  // 2. Restore lagSmoothing to original GSAP defaults
  // 3. Destroy Lenis instance
  // 4. Kill ALL ScrollTriggers (prevents orphaned scroll listeners)
  // 5. Clear ScrollTrigger memory and refresh
  // 6. Reset body/html overflow styles (Lenis may have mutated these)
  //
  // WHY SO AGGRESSIVE:
  // Lenis and ScrollTrigger can leave orphaned listeners, RAF loops, and
  // DOM mutations. Without thorough cleanup, memory leaks accumulate across
  // route changes in a Next.js SPA.
  //
  // CALLED WHEN:
  // - Component unmounts
  // - scrollMode changes from cinematic to native
  // - pathname changes to excluded path
  // - prefersReducedMotion becomes true
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

    // ============================================================================
    // LENIS CONFIGURATION
    // ============================================================================
    // duration: 1.2s interpolation (longer = smoother but slower responses)
    // easing: Custom exponential ease-out formula
    // smoothWheel: Interpolates wheel events (desktop)
    // touchMultiplier: 0 = disables touch scroll interpolation
    //   (we rely on native touch scroll for better mobile performance)
    // ============================================================================
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 0, // Disable on touch (use native)
      infinite: false,
      ...lenisConfig,
    });

    lenisRef.current = lenis;

    // ============================================================================
    // SYNC LENIS WITH SCROLLTRIGGER
    // ============================================================================
    // ScrollTrigger needs to know when scroll position changes.
    // We listen to Lenis "scroll" events and notify ScrollTrigger.
    // This keeps GSAP scroll-based animations in sync with smooth scroll.
    // ============================================================================
    lenis.on("scroll", ScrollTrigger.update);

    // ============================================================================
    // DISABLE GSAP LAG SMOOTHING
    // ============================================================================
    // GSAP's lag smoothing tries to "catch up" after frame drops.
    // This conflicts with Lenis's own timing system.
    // We store defaults (500, 33) to restore later, then disable (0).
    // ============================================================================
    prevLagSmoothingRef.current = { lag: 500, minDuration: 33 }; // GSAP defaults
    gsap.ticker.lagSmoothing(0); // Disable

    // ============================================================================
    // ADD LENIS TO GSAP TICKER - THE CRITICAL PATTERN
    // ============================================================================
    // We create the callback function and store it in a ref.
    // This allows us to remove it later with the exact same reference.
    //
    // CONVERSION: Lenis expects milliseconds, GSAP ticker provides seconds.
    // ============================================================================
    const tickerCallback = (time: number) => {
      if (lenisRef.current) {
        lenisRef.current.raf(time * 1000); // Convert seconds to milliseconds
      }
    };
    tickerCallbackRef.current = tickerCallback; // Store for cleanup
    gsap.ticker.add(tickerCallback);

    isActiveRef.current = true;

    // Cleanup on unmount or mode change
    return cleanup;
  }, [shouldActivate, cleanup, lenisConfig]);

  // ============================================================================
  // PAGE VISIBILITY EFFECT - Performance optimization
  // ============================================================================
  // WHEN TAB HIDDEN: Pause Lenis (saves CPU/battery)
  // WHEN TAB VISIBLE: Resume Lenis
  //
  // WHY: No point interpolating scroll when user can't see the page.
  // Especially important on mobile devices to conserve battery.
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
  // SCROLL TO METHOD - Programmatic scroll with fallback
  // ============================================================================
  // IF LENIS ACTIVE: Use Lenis smooth scroll API
  // IF LENIS INACTIVE: Fall back to native browser scroll APIs
  //
  // SUPPORTS:
  // - Numeric targets: scrollTo(500)
  // - Selector strings: scrollTo("#services")
  // - Element refs: scrollTo(elementRef.current)
  // - Options: scrollTo(target, { duration: 1.5, offset: -80 })
  // ============================================================================
  const scrollTo = useCallback(
    (target: number | string | HTMLElement, options?: object) => {
      if (lenisRef.current) {
        // Lenis is active, use smooth scroll
        lenisRef.current.scrollTo(target, options);
      } else if (typeof window !== "undefined") {
        // Lenis is not active, fall back to native APIs
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
