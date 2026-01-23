// ============================================================================
// ARCHITECTURAL INTENT: Responsive Section Wrapper
// ============================================================================
// Provides dual-mode section rendering with intelligent animation behavior.
//
// DESIGN RATIONALE:
// - scrollMode === 'native': Scroll-triggered in-view animations (mobile + tablet)
// - scrollMode === 'cinematic': No in-view animations (handled by parent AnimatePresence)
//
// KEY FEATURES:
// - Uses 100svh for proper mobile viewport (excludes browser chrome)
// - Safe-area padding for notched devices
// - Ref composition pattern (forwards ref while using IntersectionObserver)
// - Respects prefersReducedMotion
//
// EVIDENCE: Part of 9D system documented in ARCHITECTURE_MEMORY.txt
// ============================================================================

"use client";

import React, { forwardRef } from "react";
import { motion, type Variants } from "framer-motion";
import { useNativeScroll } from "@/hooks/useNativeScroll";
import { useResponsiveMode, type ScrollMode } from "@/hooks/useResponsiveMode";

// ============================================================================
// TYPES
// ============================================================================
interface ResponsiveSectionProps {
  /** Section content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Section ID for navigation */
  id?: string;
  /** Override scroll mode for this section */
  scrollModeOverride?: ScrollMode;
  /** Disable animations for this section */
  disableAnimation?: boolean;
  /** Custom animation variants */
  animationVariants?: Variants;
}

// ============================================================================
// DEFAULT ANIMATION VARIANTS
// ============================================================================
// ARCHITECTURAL NOTE:
// - defaultVariants: Used for native scroll mode (fade + slide up)
// - reducedMotionVariants: Accessibility fallback (no motion)
const defaultVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Reduced motion variants (immediate, no animation)
const reducedMotionVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

// ============================================================================
// THE COMPONENT
// ============================================================================
/**
 * Wrapper component for consistent responsive section behavior.
 * 
 * Features:
 * - Uses 100svh for proper mobile viewport handling
 * - Safe-area padding support for notched devices
 * - In-view animations for native scroll mode
 * - Respects prefersReducedMotion
 */
const ResponsiveSection = forwardRef<HTMLElement, ResponsiveSectionProps>(
  (
    {
      children,
      className = "",
      id,
      scrollModeOverride,
      disableAnimation = false,
      animationVariants,
    },
    forwardedRef
  ) => {
    const { scrollMode, prefersReducedMotion } = useResponsiveMode();
    const { ref: inViewRef, inView } = useNativeScroll({
      threshold: 0.15,
      triggerOnce: true,
      rootMargin: "-10% 0px",
    });

    const activeScrollMode = scrollModeOverride ?? scrollMode;
    const shouldAnimate =
      !disableAnimation &&
      !prefersReducedMotion &&
      activeScrollMode === "native";

    // Choose animation variants
    const variants = prefersReducedMotion
      ? reducedMotionVariants
      : animationVariants ?? defaultVariants;

    // ARCHITECTURAL PATTERN: Ref Composition
    // Why: Need both IntersectionObserver ref (internal) AND forwarded ref (parent)
    // Solution: Single callback ref that updates both
    const setRef = (element: HTMLElement | null) => {
      // Update inViewRef (for IntersectionObserver)
      (inViewRef as React.MutableRefObject<HTMLElement | null>).current = element;
      
      // Update forwarded ref (for parent access)
      if (typeof forwardedRef === "function") {
        forwardedRef(element);
      } else if (forwardedRef) {
        forwardedRef.current = element;
      }
    };

    // Base classes for proper responsive height
    const baseClasses = [
      "w-full",
      "relative",
      // Use svh for proper mobile viewport (accounts for browser chrome)
      "min-h-[100svh]",
      // Safe area padding for notched devices
      "pb-[env(safe-area-inset-bottom)]",
      // Flex container for content centering
      "flex",
      "flex-col",
    ].join(" ");

    // ARCHITECTURAL DECISION: Conditional Rendering Based on Scroll Mode
    //
    // Cinematic mode (desktop): NO in-view animation
    // - Parent AnimatePresence handles section transitions
    // - Render plain <section> (no motion)
    // - Prevents double-animation (AnimatePresence + in-view)
    //
    // Native mode (mobile/tablet): IN-VIEW animation
    // - Uses motion.section with IntersectionObserver
    // - Animates when scrolled into view
    if (activeScrollMode === "cinematic" || !shouldAnimate) {
      return (
        <section
          ref={setRef}
          id={id}
          className={`${baseClasses} ${className}`}
        >
          {children}
        </section>
      );
    }

    // Native mode: Use Framer Motion for in-view animations
    return (
      <motion.section
        ref={setRef}
        id={id}
        className={`${baseClasses} ${className}`}
        initial="hidden"
        animate={inView.hasBeenInView ? "visible" : "hidden"}
        variants={variants}
      >
        {children}
      </motion.section>
    );
  }
);

ResponsiveSection.displayName = "ResponsiveSection";

export default ResponsiveSection;

// ============================================================================
// UTILITY: Section content wrapper for inner padding
// ============================================================================
interface SectionContentProps {
  children: React.ReactNode;
  className?: string;
  /** Center content vertically */
  centered?: boolean;
}

export function SectionContent({
  children,
  className = "",
  centered = false,
}: SectionContentProps) {
  return (
    <div
      className={`
        w-full
        max-w-7xl
        mx-auto
        px-[var(--container-padding)]
        ${centered ? "flex-1 flex flex-col justify-center" : "flex flex-col justify-start"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
