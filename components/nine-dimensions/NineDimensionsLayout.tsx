"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useResponsiveMode } from "@/hooks/useResponsiveMode";
import { useNineDimensionsController } from "@/hooks/useNineDimensionsController";
import NineDimensionsBackground from "./NineDimensionsBackground";
import NineDimensionsHUD from "./NineDimensionsHUD";
import ResponsiveSection from "@/components/layout/ResponsiveSection";

// Import mapping sections
import HeroScene from "@/components/hero/HeroScene";
import StatsSection from "@/components/sections/StatsSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";

// Heavy sections dynamic
const SelectedWorkSection = dynamic(
  () => import("@/components/sections/SelectedWorkSection")
);
const TeamSection = dynamic(() => import("@/components/sections/TeamSection"));
const ClientsMarquee = dynamic(
  () => import("@/components/sections/ClientsMarquee")
);
const TestimonialsSection = dynamic(
  () => import("@/components/sections/TestimonialsSection")
);
const FinalCTA = dynamic(() => import("@/components/sections/FinalCTA"));

// ============================================================================
// SECTION DEFINITIONS
// ============================================================================
const SECTIONS = [
  { id: "genesis", component: <HeroScene /> }, // 0: Genesis (Chaos)
  { id: "tunnel", component: <StatsSection /> }, // 1: Tunnel
  { id: "sphere", component: <AboutSection /> }, // 2: Sphere
  { id: "cube", component: <ServicesSection /> }, // 3: Cube
  { id: "helix", component: <SelectedWorkSection /> }, // 4: Helix
  { id: "grid", component: <TeamSection /> }, // 5: Grid
  { id: "ring", component: <ClientsMarquee /> }, // 6: Ring
  { id: "vortex", component: <TestimonialsSection /> }, // 7: Vortex
  { id: "harmony", component: <FinalCTA /> }, // 8: Harmony
];

// Sections that need full-height styling
const FULL_HEIGHT_SECTIONS = new Set([0, 2, 6, 7, 8]);

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================
const cinematicVariants = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -50, scale: 1.1 },
};

const reducedMotionVariants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 1 },
};

// ============================================================================
// THE COMPONENT
// ============================================================================
/**
 * NineDimensionsLayout - Main home page layout with 9 cinematic sections.
 * 
 * Rendering Modes:
 * - scrollMode === 'native': Stacked sections with natural scroll (mobile + tablet)
 * - scrollMode === 'cinematic': Fixed viewport with section-by-section animation (desktop)
 * 
 * Background Rendering:
 * - render3D === true on desktop: Full 3D particle animation
 * - render3D === true on tablet (hybrid): Lite 3D (reduced particles, no post-fx)
 * - render3D === false: Static gradient background
 * 
 * SSR Safety:
 * - No window.innerWidth checks in render path
 * - Uses useResponsiveMode hook with useSyncExternalStore
 * - Stable initial state matches server render (desktop/cinematic)
 */
export default function NineDimensionsLayout() {
  const totalSections = SECTIONS.length;
  
  // SSR-safe responsive mode detection
  const { scrollMode, render3D, prefersReducedMotion, isMobile, isTablet, isHydrated } =
    useResponsiveMode();

  // Section navigation controller (only active in cinematic mode)
  const { currentSection, isAnimating, navigate, isReady } =
    useNineDimensionsController(totalSections, {
      enabled: isHydrated && scrollMode === "cinematic",
    });

  // Choose animation variants based on reduced motion preference
  const variants = prefersReducedMotion
    ? reducedMotionVariants
    : cinematicVariants;

  // ============================================================================
  // HYDRATION PLACEHOLDER - Prevents layout flicker
  // ============================================================================
  if (!isHydrated) {
    return (
      <main className="fixed inset-0 w-full h-full bg-[#09060f]" />
    );
  }


  // ============================================================================
  // NATIVE SCROLL MODE (Mobile + Tablet)
  // ============================================================================
  if (scrollMode === "native") {
    return (
      <main className="w-full min-h-screen relative bg-[#09060f] text-white">
        {/* Background Layer */}
        {render3D && isTablet ? (
          // Tablet with capable device: Lite 3D background
          <NineDimensionsBackground targetShapeIndex={0} lite />
        ) : (
          // Mobile or incapable tablet: Static gradient
          <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0d0e22] to-[#09060f] pointer-events-none" />
        )}

        {/* Stacked Sections */}
        <div className="relative z-10 flex flex-col w-full">
          {SECTIONS.map((item, idx) => (
            <ResponsiveSection
              key={idx}
              id={item.id}
              scrollModeOverride="native"
              className="justify-start pt-16 md:pt-20 scroll-mt-24"
            >
              {item.component}
            </ResponsiveSection>
          ))}
        </div>
      </main>
    );
  }

  // ============================================================================
  // CINEMATIC MODE (Desktop)
  // Wait for controller to be ready before rendering
  // ============================================================================
  if (!isReady) {
    // SSR-safe placeholder that matches server render
    return (
      <main className="overflow-hidden fixed inset-0 w-full h-full bg-[#09060f]" />
    );
  }

  const isFullHeight = FULL_HEIGHT_SECTIONS.has(currentSection);

  return (
    <main className="overflow-hidden fixed inset-0 w-full h-full">
      {/* 1. 3D Background Layer */}
      {render3D && (
        <NineDimensionsBackground targetShapeIndex={currentSection} />
      )}

      {/* Fallback gradient if 3D is disabled (reduced motion) */}
      {!render3D && (
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0d0e22] to-[#09060f] pointer-events-none" />
      )}

      {/* 2. HUD Layer */}
      <NineDimensionsHUD
        currentSection={currentSection}
        totalSections={totalSections}
        onDotClick={navigate}
        isAnimating={isAnimating}
      />

      {/* 3. Content Layer */}
      <AnimatePresence mode="wait">
        <motion.section
          key={currentSection}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{
            duration: prefersReducedMotion ? 0 : 1,
            ease: [0.23, 1, 0.32, 1],
          }}
          className={`
            absolute inset-0 z-50 w-full h-full 
            flex flex-col items-center justify-start 
            pointer-events-none pt-16 md:pt-20
            ${isFullHeight ? "p-0" : "px-4 md:px-8"}
          `}
        >
          <div
            className={`
            w-full pointer-events-auto
            ${isFullHeight ? "h-full" : "max-w-[1400px]"}
          `}
          >
            {SECTIONS[currentSection].component}
          </div>
        </motion.section>
      </AnimatePresence>
    </main>
  );
}
