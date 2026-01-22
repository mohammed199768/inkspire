"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useResponsiveMode } from "./useResponsiveMode";

// ============================================================================
// TYPES
// ============================================================================
interface InViewState {
  /** Whether the element is currently in the viewport */
  isInView: boolean;
  /** Intersection ratio (0-1) */
  ratio: number;
  /** Has ever been in view (for "once" animations) */
  hasBeenInView: boolean;
}

interface UseNativeScrollOptions {
  /** IntersectionObserver threshold(s) */
  threshold?: number | number[];
  /** IntersectionObserver rootMargin */
  rootMargin?: string;
  /** If true, only trigger once when element enters view */
  triggerOnce?: boolean;
}

interface UseNativeScrollReturn {
  /** Ref to attach to the target element */
  ref: React.RefObject<HTMLElement | null>;
  /** Current in-view state */
  inView: InViewState;
  /** Scroll progress (0-1) based on document scroll */
  scrollProgress: number;
}

// ============================================================================
// THE HOOK
// ============================================================================
/**
 * Native scroll handling for mobile/tablet with IntersectionObserver.
 * Provides in-view detection and scroll progress for Framer Motion animations.
 * Respects prefersReducedMotion.
 * 
 * @param options Configuration options
 * @returns Object with ref, inView state, and scrollProgress
 */
export function useNativeScroll(
  options: UseNativeScrollOptions = {}
): UseNativeScrollReturn {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = false,
  } = options;

  const { prefersReducedMotion } = useResponsiveMode();
  const elementRef = useRef<HTMLElement | null>(null);
  
  const [inView, setInView] = useState<InViewState>({
    isInView: false,
    ratio: 0,
    hasBeenInView: false,
  });

  const [scrollProgress, setScrollProgress] = useState(0);

  // ============================================================================
  // INTERSECTION OBSERVER EFFECT
  // ============================================================================
  useEffect(() => {
    if (typeof window === "undefined") return;

    const element = elementRef.current;
    if (!element) return;

    // If reduced motion, immediately set as in view (no animation needed)
    if (prefersReducedMotion) {
      setInView({
        isInView: true,
        ratio: 1,
        hasBeenInView: true,
      });
      return;
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const isInView = entry.isIntersecting;
        const ratio = entry.intersectionRatio;

        setInView((prev) => {
          // If triggerOnce and already been in view, don't update isInView
          if (triggerOnce && prev.hasBeenInView) {
            return {
              ...prev,
              ratio,
            };
          }

          return {
            isInView,
            ratio,
            hasBeenInView: prev.hasBeenInView || isInView,
          };
        });
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, prefersReducedMotion]);

  // ============================================================================
  // SCROLL PROGRESS EFFECT
  // ============================================================================
  useEffect(() => {
    if (typeof window === "undefined") return;

    // If reduced motion, don't track scroll progress
    if (prefersReducedMotion) {
      setScrollProgress(1);
      return;
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      setScrollProgress(progress);
    };

    // Initial calculation
    handleScroll();

    // Use passive listener for performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prefersReducedMotion]);

  return {
    ref: elementRef,
    inView,
    scrollProgress,
  };
}

// ============================================================================
// BATCH OBSERVER HOOK (for multiple elements)
// ============================================================================
interface BatchObserverOptions extends UseNativeScrollOptions {
  /** Array of refs to observe */
  refs: React.RefObject<HTMLElement | null>[];
}

interface BatchInViewState {
  [key: number]: InViewState;
}

/**
 * Batch IntersectionObserver for multiple elements.
 * More efficient than multiple useNativeScroll hooks.
 */
export function useNativeScrollBatch(
  options: BatchObserverOptions
): BatchInViewState {
  const {
    refs,
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = false,
  } = options;

  const { prefersReducedMotion } = useResponsiveMode();
  const [states, setStates] = useState<BatchInViewState>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    // If reduced motion, immediately set all as in view
    if (prefersReducedMotion) {
      const allInView: BatchInViewState = {};
      refs.forEach((_, index) => {
        allInView[index] = { isInView: true, ratio: 1, hasBeenInView: true };
      });
      setStates(allInView);
      return;
    }

    const elements = refs.map((ref) => ref.current).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      setStates((prev) => {
        const newStates = { ...prev };

        entries.forEach((entry) => {
          const index = elements.indexOf(entry.target as HTMLElement);
          if (index === -1) return;

          const isInView = entry.isIntersecting;
          const ratio = entry.intersectionRatio;
          const prevState = prev[index] || { isInView: false, ratio: 0, hasBeenInView: false };

          // If triggerOnce and already been in view, don't update isInView
          if (triggerOnce && prevState.hasBeenInView) {
            newStates[index] = { ...prevState, ratio };
          } else {
            newStates[index] = {
              isInView,
              ratio,
              hasBeenInView: prevState.hasBeenInView || isInView,
            };
          }
        });

        return newStates;
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      rootMargin,
    });

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [refs, threshold, rootMargin, triggerOnce, prefersReducedMotion]);

  return states;
}
