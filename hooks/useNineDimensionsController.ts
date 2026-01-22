"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useResponsiveMode } from "@/hooks/useResponsiveMode";

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
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mark as ready after hydration
  useEffect(() => {
    setIsReady(true);
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Navigation function
  const navigate = useCallback(
    (nextIndex: number) => {
      if (!enabled) return;
      if (nextIndex < 0 || nextIndex >= totalSections) return;
      if (isAnimating) return;

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
  // NAVIGATION EVENT HANDLERS
  // Only active in cinematic mode and when enabled
  // ============================================================================
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Don't attach handlers if disabled or in native scroll mode
    if (!enabled || scrollMode !== "cinematic") return;

    // 1. Wheel (Desktop scroll)
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) return;
      if (Math.abs(e.deltaY) < 30) return;

      if (e.deltaY > 0) {
        navigate(currentSection + 1);
      } else {
        navigate(currentSection - 1);
      }
    };

    // 2. Keyboard (arrows)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;
      
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault();
          navigate(currentSection + 1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          navigate(currentSection - 1);
          break;
      }
    };

    // 3. Touch Swipe (for tablets with touch in cinematic mode)
    let touchStart = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStart = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating) return;
      const touchEnd = e.changedTouches[0].clientY;
      const delta = touchStart - touchEnd;

      // Require significant swipe (50px threshold)
      if (Math.abs(delta) > 50) {
        if (delta > 0) {
          navigate(currentSection + 1);
        } else {
          navigate(currentSection - 1);
        }
      }
    };

    // Attach listeners
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, scrollMode, isAnimating, currentSection, navigate]);

  return {
    currentSection,
    isAnimating,
    navigate,
    isReady,
  };
}
