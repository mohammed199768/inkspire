"use client";

import { useSyncExternalStore } from "react";

// ============================================================================
// TYPES
// ============================================================================
export type Breakpoint = "mobile" | "tablet" | "desktop";
export type ScrollMode = "cinematic" | "native";

export interface ResponsiveMode {
  // Hydration safety flag
  isHydrated: boolean;

  // Device Classification
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: Breakpoint;

  // Input Detection
  hasTouch: boolean;
  hasFinePointer: boolean;

  // Preferences
  prefersReducedMotion: boolean;

  // Computed Decisions
  scrollMode: ScrollMode;
  render3D: boolean;

  // Device Capability Heuristics
  deviceCapable: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

// ============================================================================
// SINGLETON STATE - Global listeners attached ONCE
// ============================================================================
let cachedState: ResponsiveMode | null = null;
let listeners = new Set<() => void>();
let subscriberCount = 0;
let cleanupFn: (() => void) | null = null;

// ============================================================================
// SSR-SAFE INITIAL STATE - isHydrated = false
// ============================================================================
const getServerSnapshot = (): ResponsiveMode => ({
  isHydrated: false, // CRITICAL: false on server
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  breakpoint: "desktop",
  hasTouch: false,
  hasFinePointer: true,
  prefersReducedMotion: false,
  scrollMode: "cinematic",
  render3D: true,
  deviceCapable: true,
});

// ============================================================================
// CLIENT STATE COMPUTATION
// ============================================================================
const computeResponsiveMode = (): ResponsiveMode => {
  if (typeof window === "undefined") {
    return getServerSnapshot();
  }

  const width = window.innerWidth;

  // Breakpoint Detection
  const isMobile = width < BREAKPOINTS.mobile;
  const isTablet = width >= BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet;
  const isDesktop = width > BREAKPOINTS.tablet;
  const breakpoint: Breakpoint = isMobile
    ? "mobile"
    : isTablet
    ? "tablet"
    : "desktop";

  // Input Detection via matchMedia
  const hasTouch =
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(hover: none)").matches ||
    navigator.maxTouchPoints > 0;

  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  // User Preferences
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Device Capability Heuristics
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };
  const hasEnoughMemory = nav.deviceMemory === undefined || nav.deviceMemory >= 4;
  const hasEnoughCores =
    nav.hardwareConcurrency === undefined || nav.hardwareConcurrency >= 6;
  const deviceCapable = hasEnoughMemory && hasEnoughCores;

  // Scroll Mode Decision
  const scrollMode: ScrollMode =
    isDesktop && hasFinePointer && !prefersReducedMotion
      ? "cinematic"
      : "native";

  // 3D Render Decision
  let render3D = false;
  if (!prefersReducedMotion) {
    if (isDesktop) {
      render3D = true;
    } else if (isTablet && hasFinePointer && deviceCapable) {
      render3D = true;
    }
  }

  return {
    isHydrated: true, // CRITICAL: true on client
    isMobile,
    isTablet,
    isDesktop,
    breakpoint,
    hasTouch,
    hasFinePointer,
    prefersReducedMotion,
    scrollMode,
    render3D,
    deviceCapable,
  };
};

// ============================================================================
// NOTIFY ALL LISTENERS
// ============================================================================
const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

// ============================================================================
// RECOMPUTE AND NOTIFY IF CHANGED
// ============================================================================
const handleChange = () => {
  const newState = computeResponsiveMode();
  const oldState = cachedState;

  // Only notify if something actually changed
  if (
    !oldState ||
    oldState.breakpoint !== newState.breakpoint ||
    oldState.scrollMode !== newState.scrollMode ||
    oldState.render3D !== newState.render3D ||
    oldState.prefersReducedMotion !== newState.prefersReducedMotion ||
    oldState.hasFinePointer !== newState.hasFinePointer ||
    oldState.hasTouch !== newState.hasTouch ||
    oldState.isHydrated !== newState.isHydrated
  ) {
    cachedState = newState;
    notifyListeners();
  }
};

// ============================================================================
// SETUP GLOBAL LISTENERS (ONCE)
// ============================================================================
const setupListeners = () => {
  if (typeof window === "undefined") return;
  if (cleanupFn !== null) return; // Already set up

  const mediaQueries = [
    window.matchMedia(`(max-width: ${BREAKPOINTS.mobile - 1}px)`),
    window.matchMedia(
      `(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet}px)`
    ),
    window.matchMedia(`(min-width: ${BREAKPOINTS.tablet + 1}px)`),
    window.matchMedia("(pointer: coarse)"),
    window.matchMedia("(pointer: fine)"),
    window.matchMedia("(hover: none)"),
    window.matchMedia("(hover: hover)"),
    window.matchMedia("(prefers-reduced-motion: reduce)"),
  ];

  const mqHandler = () => handleChange();

  // Subscribe to all media queries
  mediaQueries.forEach((mq) => {
    if (mq.addEventListener) {
      mq.addEventListener("change", mqHandler);
    } else {
      mq.addListener(mqHandler);
    }
  });

  // Debounced resize handler
  let resizeTimer: ReturnType<typeof setTimeout>;
  const resizeHandler = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleChange, 100);
  };

  const orientationHandler = () => handleChange();

  window.addEventListener("resize", resizeHandler);
  window.addEventListener("orientationchange", orientationHandler);

  // Store cleanup function
  cleanupFn = () => {
    mediaQueries.forEach((mq) => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", mqHandler);
      } else {
        mq.removeListener(mqHandler);
      }
    });
    window.removeEventListener("resize", resizeHandler);
    window.removeEventListener("orientationchange", orientationHandler);
    clearTimeout(resizeTimer);
    cleanupFn = null;
  };
};

// ============================================================================
// TEARDOWN GLOBAL LISTENERS (when last subscriber leaves)
// ============================================================================
const teardownListeners = () => {
  if (cleanupFn) {
    cleanupFn();
  }
};

// ============================================================================
// EXTERNAL STORE IMPLEMENTATION
// ============================================================================
const getSnapshot = (): ResponsiveMode => {
  if (cachedState === null) {
    cachedState = computeResponsiveMode();
  }
  return cachedState;
};

const subscribe = (onStoreChange: () => void): (() => void) => {
  listeners.add(onStoreChange);
  subscriberCount++;

  // Setup global listeners on first subscriber
  if (subscriberCount === 1) {
    setupListeners();
    // Force initial computation on client
    cachedState = computeResponsiveMode();
  }

  return () => {
    listeners.delete(onStoreChange);
    subscriberCount--;

    // Teardown global listeners when last subscriber leaves
    if (subscriberCount === 0) {
      teardownListeners();
    }
  };
};

// ============================================================================
// THE HOOK
// ============================================================================
export function useResponsiveMode(): ResponsiveMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
