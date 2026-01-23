"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useResponsiveMode } from "@/hooks/useResponsiveMode";

// ============================================================================
// ARCHITECTURAL NOTE: SECTION NAVIGATION STATE MACHINE
// ============================================================================
// This hook implements a finite state machine for Nine Dimensions home page
// section navigation in desktop cinematic mode.
//
// STATE: currentSection (integer 0 to N-1)
// TRANSITIONS: User events (wheel, keyboard, touch) trigger navigate(±1)
// GUARDS: Bounds validation, animation lock, enabled flag, scroll mode check
//
// CONDITIONAL ACTIVATION:
// - ONLY active when scrollMode === "cinematic" (desktop)
// - Disabled in native scroll mode (mobile/tablet use normal scroll)
// - Respects enabled flag for programmatic control
//
// EVENT HANDLING:
// - Wheel events (desktop mouse/trackpad)
// - Keyboard arrows (accessibility + power users)
// - Touch swipe (tablets that qualify for cinematic mode)
//
// ANIMATION LOCKING:
// Prevents section spam by locking interactions during transitions.
// Lock duration respects prefers-reduced-motion (100ms vs 1500ms).
// ============================================================================

// ============================================================================
// TYPES
// ============================================================================
interface UseNineDimensionsControllerOptions {
  /** If false, disables all navigation event handlers */
  enabled?: boolean;
  /** Animation lock duration in ms */
  animationDuration?: number;
}

interface UseNineDimensionsControllerReturn {
  /** Current section index (0-8) */
  currentSection: number;
  /** Whether a section transition is in progress */
  isAnimating: boolean;
  /** Navigate to a specific section */
  navigate: (index: number) => void;
  /** Whether the controller is ready (SSR-safe) */
  isReady: boolean;
  /** Scroll impulse value (0-1, triggers brief particle response) */
  scrollImpulse: number;
}

// ============================================================================
// THE HOOK
// ============================================================================
/**
 * Controller for Nine Dimensions section navigation.
 * 
 * Handles:
 * - Wheel navigation (desktop)
 * - Keyboard navigation (arrows)
 * - Touch swipe navigation (tablet with touch)
 * 
 * SSR Safety:
 * - Uses useResponsiveMode for device detection
 * - Has isReady flag for hydration safety
 * - No window access in render path
 * 
 * @param totalSections Number of sections
 * @param options Configuration options
 */
export function useNineDimensionsController(
  totalSections: number,
  options: UseNineDimensionsControllerOptions = {}
): UseNineDimensionsControllerReturn {
  const { enabled = true, animationDuration = 1500 } = options;

  const { scrollMode, prefersReducedMotion } = useResponsiveMode();
  const [currentSection, setCurrentSection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [scrollImpulse, setScrollImpulse] = useState(0);
  
  // ============================================================================
  // ANIMATION TIMEOUT REF - Cleanup on unmount
  // ============================================================================
  // Stores setTimeout ID for animation lock release.
  // MUST be cleared on unmount to prevent setState on unmounted component.
  // ============================================================================
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // ============================================================================
  // SCROLL IMPULSE DECAY - RAF-based self-terminating decay
  // ============================================================================
  // Impulse spikes to 1.0 on scroll attempt, then decays to 0.
  // Decay RAF self-terminates when impulse < epsilon (demand pattern).
  // No cleanup needed beyond RAF cancellation (ref tracks ID).
  // ============================================================================
  const impulseDecayRef = useRef<number | null>(null);

  // ============================================================================
  // HYDRATION SAFETY - Mark ready after client mount
  // ============================================================================
  // isReady flag prevents hydration mismatch:
  // - Server renders with isReady: false
  // - Client sets isReady: true after mount
  // - Consumer (NineDimensionsLayout) waits for isReady before showing content
  //
  // CLEANUP: Clear pending animation timeout on unmount
  // ============================================================================
  useEffect(() => {
    setIsReady(true);
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      if (impulseDecayRef.current) {
        cancelAnimationFrame(impulseDecayRef.current);
      }
    };
  }, []);

  // ============================================================================
  // NAVIGATE FUNCTION - State transition with guards
  // ============================================================================
  // GUARDS (early returns):
  // 1. enabled === false → controller disabled
  // 2. nextIndex out of bounds [0, totalSections-1] → invalid transition
  // 3. isAnimating === true → prevent spam during transition
  //
  // TRANSITION:
  // 1. Set animation lock (prevents concurrent transitions)
  // 2. Update current section state
  // 3. Schedule lock release after animation completes
  //
  // REDUCED MOTION:
  // Animation duration: 100ms (reduced) vs 1500ms (normal)
  // Accessibility compliance with prefers-reduced-motion
  // ============================================================================
  const navigate = useCallback(
    (nextIndex: number) => {
      if (!enabled) return; // Guard: Controller disabled
      if (nextIndex < 0 || nextIndex >= totalSections) return; // Guard: Bounds check
      if (isAnimating) return; // Guard: Animation lock

      setIsAnimating(true);
      setCurrentSection(nextIndex);

      // Lock interaction during transition
      const duration = prefersReducedMotion ? 100 : animationDuration;
      animationTimeoutRef.current = setTimeout(
        () => setIsAnimating(false),
        duration
      );
    },
    [enabled, totalSections, isAnimating, prefersReducedMotion, animationDuration]
  );

  // ============================================================================
  // TRIGGER SCROLL IMPULSE - Spikes impulse to 1.0 and starts decay
  // ============================================================================
  // Called by wheel and keyboard handlers to create visual feedback pulse.
  // Decay multiplies impulse by 0.88 per frame (~40fps half-life ~1.2s).
  // Self-terminates when impulse < 0.01 (epsilon).
  // ============================================================================
  const triggerImpulse = useCallback(() => {
    setScrollImpulse(1.0);

    // Cancel existing decay RAF if running
    if (impulseDecayRef.current) {
      cancelAnimationFrame(impulseDecayRef.current);
    }

    // Start decay loop
    const decay = () => {
      setScrollImpulse((prev) => {
        const next = prev * 0.88;
        
        // Self-terminate when below epsilon
        if (next < 0.01) {
          impulseDecayRef.current = null;
          return 0;
        }
        
        // Continue decay
        impulseDecayRef.current = requestAnimationFrame(decay);
        return next;
      });
    };

    impulseDecayRef.current = requestAnimationFrame(decay);
  }, []);

  // ============================================================================
  // NAVIGATION EVENT HANDLERS
  // Only active in cinematic mode and when enabled
  // ============================================================================
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Don't attach handlers if disabled or in native scroll mode
    if (!enabled || scrollMode !== "cinematic") return;

    // ============================================================================
    // 1. WHEEL EVENT HANDLER (Desktop Mouse/Trackpad)
    // ============================================================================
    // NOISE FILTER: Requires minimum 30px deltaY to trigger
    // WHY: Prevents accidental section changes from small scroll gestures
    //
    // DIRECTION:
    // - Positive deltaY (scroll down) → next section
    // - Negative deltaY (scroll up) → previous section
    // ============================================================================
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) return; // Animation lock check
      if (Math.abs(e.deltaY) < 30) return; // Noise filter: ignore tiny scrolls

      // Trigger impulse for visual feedback (even if navigation blocked)
      triggerImpulse();

      if (e.deltaY > 0) {
        navigate(currentSection + 1); // Scroll down → next
      } else {
        navigate(currentSection - 1); // Scroll up → previous
      }
    };

    // ============================================================================
    // 2. KEYBOARD EVENT HANDLER (Arrow Keys)
    // ============================================================================
    // ACCESSIBILITY: Enables keyboard-only navigation
    // POWER USERS: Faster than mouse for sequential browsing
    //
    // BINDINGS:
    // - ArrowDown / ArrowRight → next section (intuitive direction mapping)
    // - ArrowUp / ArrowLeft → previous section
    //
    // CRITICAL: e.preventDefault() blocks default page scroll behavior
    // Without this, arrow keys would BOTH change section AND scroll the page.
    // ============================================================================
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return; // Animation lock check
      
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault(); // Block default scroll
          triggerImpulse(); // Visual feedback
          navigate(currentSection + 1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault(); // Block default scroll
          triggerImpulse(); // Visual feedback
          navigate(currentSection - 1);
          break;
      }
    };

    // ============================================================================
    // 3. TOUCH SWIPE HANDLER (Tablets in Cinematic Mode)
    // ============================================================================
    // EDGE CASE: Some tablets qualify for cinematic mode (capable hardware + fine pointer)
    // This provides touch gesture fallback for those devices.
    //
    // SWIPE DETECTION:
    // 1. touchstart captures starting Y position
    // 2. touchend captures ending Y position
    // 3. delta = start - end
    //    - Positive delta (swipe up, finger moves up) → next section
    //    - Negative delta (swipe down, finger moves down) → previous section
    //
    // THRESHOLD: Requires 50px minimum swipe to prevent accidental triggers
    // ============================================================================
    let touchStart = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStart = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating) return; // Animation lock check
      const touchEnd = e.changedTouches[0].clientY;
      const delta = touchStart - touchEnd;

      // Require significant swipe (50px threshold)
      if (Math.abs(delta) > 50) {
        if (delta > 0) {
          navigate(currentSection + 1); // Swipe up → next
        } else {
          navigate(currentSection - 1); // Swipe down → previous
        }
      }
    };

    // ============================================================================
    // ATTACH EVENT LISTENERS
    // ============================================================================
    // PASSIVE OPTIMIZATION:
    // wheel, touchstart, touchend use { passive: true }
    // - Signals browser we WON'T call preventDefault()
    // - Allows browser to optimize scroll performance
    // - Safe because we don't need to block these events
    //
    // keydown is NOT passive (we DO call preventDefault on arrows)
    // ============================================================================
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown); // Not passive (we use preventDefault)
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    // ============================================================================
    // CLEANUP - Remove all event listeners
    // ============================================================================
    // CRITICAL: Without this cleanup, each re-render would add duplicate listeners
    // MEMORY LEAK: Event listeners hold references to component scope
    // CONSEQUENCE: Hundreds of orphaned listeners after multiple renders
    // ============================================================================
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, scrollMode, isAnimating, currentSection, navigate, triggerImpulse]);

  return {
    currentSection,
    isAnimating,
    navigate,
    isReady,
    scrollImpulse,
  };
}
