"use client";

import { useCinematicScroll } from "@/hooks/useCinematicScroll";

/**
 * SmoothScroll component - Simplified wrapper around useCinematicScroll.
 * 
 * This component delegates all scroll management to the useCinematicScroll hook,
 * which handles:
 * - SSR-safe initialization
 * - Lenis + GSAP ScrollTrigger integration
 * - Aggressive cleanup on mode switch
 * - Page visibility gating
 * - Excluded paths (/, /experience)
 * 
 * The hook internally uses useResponsiveMode to determine when to activate
 * cinematic scroll vs falling back to native scroll.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // The hook handles all the logic:
  // - Initializes Lenis only when scrollMode === 'cinematic'
  // - Excludes paths that handle their own navigation
  // - Cleans up aggressively on mode changes
  useCinematicScroll({
    excludePaths: ["/", "/experience"],
  });

  return <>{children}</>;
}
