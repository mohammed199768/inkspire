"use client";

import { useSyncExternalStore } from "react";

// ============================================================================
// ARCHITECTURAL NOTE: SINGLETON DEVICE DETECTION SYSTEM
// ============================================================================
// This hook implements a TRUE SINGLETON pattern using useSyncExternalStore.
// Unlike typical hooks that create per-instance state, this hook ensures ALL
// component instances share the SAME global state and event listeners.
//
// WHY SINGLETON:
// - Prevents N components from attaching N resize listeners
// - Prevents N state updates causing cascading re-renders
// - Provides single source of truth for device characteristics
// - Enables proper cleanup when last subscriber unmounts
//
// HYDRATION SAFETY:
// Server renders with desktop defaults (isHydrated: false)
// Client hydrates with actual device state (isHydrated: true)
// Components MUST check isHydrated before branching render logic
// ============================================================================

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
// ARCHITECTURAL PATTERN: Module-level state (not React state)
// These variables exist ONCE per application, not once per hook call.
//
// cachedState: Memoized computation result, shared across all subscribers
// listeners: Set of callback refs from useSyncExternalStore subscribers
// subscriberCount: Reference counting for lifecycle management
// cleanupFn: Stored teardown logic, executed when last subscriber leaves
//
// CRITICAL: These are NOT recreated on each render. They persist across
// all component lifecycles. This is what makes this hook a true singleton.
// ============================================================================
let cachedState: ResponsiveMode | null = null;
let listeners = new Set<() => void>();
let subscriberCount = 0;
let cleanupFn: (() => void) | null = null;

// ============================================================================
// SSR-SAFE INITIAL STATE - isHydrated = false
// ============================================================================
// HYDRATION STRATEGY: Server snapshot defines the "default" state that matches
// what will be rendered on the server. This MUST match the initial client render
// before useSyncExternalStore kicks in and updates to the real client state.
//
// WHY THIS MATTERS:
// 1. Server renders desktop layout (isHydrated: false)
// 2. Client rehydrates with same desktop layout (prevents mismatch)
// 3. useSyncExternalStore detects actual device (updates to isHydrated: true)
// 4. Components check isHydrated and branch safely
//
// WITHOUT THIS: React hydration error (server HTML ≠ client HTML)
// ============================================================================
const getServerSnapshot = (): ResponsiveMode => ({
  isHydrated: false, // CRITICAL: false on server, signals "don't trust other values yet"
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

  // ============================================================================
  // SCROLL MODE DECISION - Computed from device characteristics
  // ============================================================================
  // DECISION TREE:
  // - Desktop + Fine Pointer + No Motion Preference → Cinematic (section-by-section)
  // - Anything else → Native (standard browser scroll)
  //
  // RATIONALE:
  // Cinematic mode requires precise wheel control and powerful hardware.
  // Touch devices get native scroll for familiarity and performance.
  // ============================================================================
  const scrollMode: ScrollMode =
    isDesktop && hasFinePointer && !prefersReducedMotion
      ? "cinematic"
      : "native";

  // ============================================================================
  // 3D RENDER DECISION - Multi-tier performance strategy
  // ============================================================================
  // TIER 1: Desktop → Full 3D (particles + post-processing)
  // TIER 2: Capable Tablet (fine pointer + RAM/CPU) → Lite 3D (reduced particles)
  // TIER 3: Mobile / Incapable Tablet → Static gradient (no WebGL)
  //
  // ACCESSIBILITY: Always false if prefers-reduced-motion
  // RATIONALE: 3D rendering is expensive. Only enable where hardware can handle it.
  // ============================================================================
  let render3D = false;
  if (!prefersReducedMotion) {
    if (isDesktop) {
      render3D = true; // Full 3D experience
    } else if (isTablet && hasFinePointer && deviceCapable) {
      render3D = true; // Lite 3D (reduced particle count, no post-fx)
    }
    // Mobile: stays false, gets static gradient
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
// OPTIMIZATION: Deep equality check prevents unnecessary re-renders.
// Only notifies subscribers if meaningful state actually changed.
//
// CHECKED FIELDS:
// - breakpoint, scrollMode, render3D (most common triggers)
// - prefersReducedMotion, hasFinePointer, hasTouch (user/device changes)
// - isHydrated (initial client mount)
//
// NOT CHECKED: isMobile, isTablet, isDesktop (derived from breakpoint)
// ============================================================================
const handleChange = () => {
  const newState = computeResponsiveMode();
  const oldState = cachedState;

  // Only notify if something actually changed (prevents re-render storms)
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
// LIFECYCLE: Called when first subscriber subscribes
// IDEMPOTENT: Guarded by cleanupFn check, safe to call multiple times
//
// LISTENS TO:
// - Window resize/orientationchange (viewport size changes)
// - Media query changes (pointer type, hover, motion preference)
//
// PATTERN: Stores cleanup function for later teardown
// ============================================================================
const setupListeners = () => {
  if (typeof window === "undefined") return;
  if (cleanupFn !== null) return; // Already set up, prevent duplicate listeners

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

  // ============================================================================
  // DEBOUNCED RESIZE HANDLER
  // ============================================================================
  // RATIONALE: Window resize fires dozens of events during drag.
  // We only want to recompute state once the user stops resizing.
  // 100ms debounce balances responsiveness with performance.
  // ============================================================================
  let resizeTimer: ReturnType<typeof setTimeout>;
  const resizeHandler = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleChange, 100);
  };

  const orientationHandler = () => handleChange();

  window.addEventListener("resize", resizeHandler);
  window.addEventListener("orientationchange", orientationHandler);

  // ============================================================================
  // CLEANUP FUNCTION - Removes all global listeners
  // ============================================================================
  // LIFECYCLE: Called when last subscriber unsubscribes
  // CRITICAL: Must remove event listeners to prevent memory leaks
  //
  // COMPATIBILITY: Checks for addEventListener vs addListener (Safari legacy)
  // RESETS: cleanupFn to null so setupListeners can run again if needed
  // ============================================================================
  cleanupFn = () => {
    mediaQueries.forEach((mq) => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", mqHandler);
      } else {
        mq.removeListener(mqHandler); // Safari < 14 fallback
      }
    });
    window.removeEventListener("resize", resizeHandler);
    window.removeEventListener("orientationchange", orientationHandler);
    clearTimeout(resizeTimer); // Prevent pending debounce from firing
    cleanupFn = null; // Allow re-setup if subscribers return
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

// USESYNCEXTERNALSTORE SUBSCRIBE FUNCTION
// ============================================================================
// CALLED: Every time a component calls useResponsiveMode()
// RETURNS: Unsubscribe function for cleanup
//
// REFERENCE COUNTING PATTERN:
// - subscriberCount === 1: First subscriber → attach global listeners
// - subscriberCount > 1: Subsequent subscribers → reuse existing listeners
// - subscriberCount === 0: Last subscriber left → tear down listeners
//
// WHY: Ensures global listeners exist only when needed
// ============================================================================
const subscribe = (onStoreChange: () => void): (() => void) => {
  listeners.add(onStoreChange);
  subscriberCount++;

  // Setup global listeners on first subscriber
  if (subscriberCount === 1) {
    setupListeners();
    // Force initial computation on client (replaces null cache)
    cachedState = computeResponsiveMode();
  }

  // Return cleanup function for this specific subscriber
  return () => {
    listeners.delete(onStoreChange);
    subscriberCount--;

    // Teardown global listeners when last subscriber leaves
    if (subscriberCount === 0) {
      teardownListeners();
      // OPTIONAL: Could also null cachedState here, but leaving it
      // allows instant reads if subscribers return quickly
    }
  };
};

// ============================================================================
// THE HOOK
// ============================================================================
export function useResponsiveMode(): ResponsiveMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
