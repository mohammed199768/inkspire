# HOOKS CATALOG

**Last Updated**: 2026-01-23T16:40:23+03:00

---

## useResponsiveMode (SINGLETON)

**CATEGORY**: Singleton / Global State  
**PURPOSE**: Device detection with unified state across all subscribers

**INPUTS**: Window dimensions, media queries, navigator API  
**OUTPUTS**: scrollMode, breakpoint, render3D, isHydrated, isMobile, isTablet, hasTouch

**USED BY**: 15+ components (NineDimensionsLayout, NineDimensionsBackground, ClientsMarquee, ResponsiveSection, etc.)

**CLEANUP**: Reference counting, removes listeners when last subscriber unmounts

**STATUS**: ACTIVE  
**EVIDENCE**: hooks/useResponsiveMode.ts (entire file)

---

## useCinematicScroll

**CATEGORY**: Controller  
**PURPOSE**: Lenis smooth scroll lifecycle management

**INPUTS**: excludePaths (default: ["/", "/experience", "/portfolio"])  
**OUTPUTS**: Lenis instance (stored in ref)

**SIDE EFFECTS**:
- Initializes Lenis
- Adds GSAP ticker callback
- Registers ScrollTrigger

**CLEANUP**:
- Removes ticker callback (via ref for dedup)
- Destroys Lenis
- Kills all ScrollTriggers

**USED BY**: SmoothScroll.tsx (layout wrapper)

**STATUS**: ACTIVE  
**EVIDENCE**: hooks/useCinematicScroll.ts:1-300

---

## useNineDimensionsController

**CATEGORY**: Controller  
**PURPOSE**: Section navigation state machine for 9D home page

**INPUTS**: totalSections, enabled flag  
**OUTPUTS**: currentSection, isAnimating, navigate, isReady

**SIDE EFFECTS**:
- Wheel event listener
- Keyboard event listener (arrow keys)
- Animation lock

**CLEANUP**: Removes event listeners

**USED BY**: NineDimensionsLayout.tsx

**STATUS**: ACTIVE  
**EVIDENCE**: hooks/useNineDimensionsController.ts

---

## useNativeScroll

**CATEGORY**: Utility  
**PURPOSE**: IntersectionObserver wrapper for scroll progress

**INPUTS**: threshold, triggerOnce, rootMargin  
**OUTPUTS**: ref, inView (object with hasBeenInView, progress)

**CLEANUP**: IntersectionObserver.disconnect()

**USED BY**: ResponsiveSection.tsx

**STATUS**: ACTIVE  
**EVIDENCE**: hooks/useNativeScroll.ts

---

## usePageVisibility

**CATEGORY**: Utility  
**PURPOSE**: Page Visibility API wrapper

**INPUTS**: None  
**OUTPUTS**: isPageActive (boolean)

**CLEANUP**: Removes visibilitychange listener

**USED BY**: All demand-rendering components (NineDimensionsBackground, TunnelBackground, WorksTunnel, ParticleGlobeScene)

**STATUS**: ACTIVE  
**EVIDENCE**: hooks/usePageVisibility.ts

---

## useIsTouchDevice

**CATEGORY**: Utility  
**PURPOSE**: Touch device detection

**INPUTS**: None  
**OUTPUTS**: isTouch (boolean | undefined)

**CLEANUP**: None (no listeners)

**USED BY**: Cursor.tsx, useCinematicReveal.ts

**STATUS**: ACTIVE  
**EVIDENCE**: hooks/useIsTouchDevice.ts

---

## usePopup

**CATEGORY**: Utility / Context Consumer  
**PURPOSE**: Global popup state management

**INPUTS**: None  
**OUTPUTS**: openPopup, closePopup, popupData

**CLEANUP**: None (Context-based)

**USED BY**: WorksTunnel, ContactCommandCenter, ClientsMarquee, SelectedWorkSection

**STATUS**: ACTIVE  
**EVIDENCE**: hooks/usePopup.tsx

---

## useHeroAnimation

**CATEGORY**: Animation / GSAP  
**PURPOSE**: Hero section entrance timeline

**INPUTS**: containerRef, titleRef, ctaRef, scrollLabelRef  
**OUTPUTS**: None (side effects only)

**CLEANUP**: GSAP context revert

**USED BY**: HeroScene.tsx

**STATUS**: ACTIVE  
**EVIDENCE**: hooks/useHeroAnimation.ts

---

## useCinematicReveal

**CATEGORY**: Animation / GSAP  
**PURPOSE**: Clip-path reveal effect on mouse move

**INPUTS**: None  
**OUTPUTS**: isTouch, containerRef, setStackRef

**CLEANUP**: GSAP ticker callback removal, event listener removal

**USED BY**: CinematicRevealGrid.tsx

**STATUS**: ACTIVE  
**EVIDENCE**: hooks/useCinematicReveal.ts

---

## useGSAPFade

**CATEGORY**: Animation / GSAP  
**PURPOSE**: Simple fade-in animation

**INPUTS**: None  
**OUTPUTS**: ref (to attach to element)  
**NOTE**: Explicitly sets initial `opacity: 0` / `visibility: hidden` before animating (Safe-Fail pattern).

**CLEANUP**: GSAP context revert

**USED BY**: SelectedWorkSection.tsx

**STATUS**: ACTIVE  
**EVIDENCE**: hooks/useGSAPFade.ts

---

## useAnimatedCounter

**CATEGORY**: Animation / GSAP  
**PURPOSE**: Scroll-triggered number counting

**INPUTS**: value, label (in component)  
**OUTPUTS**: ref (to attach to element)

**CLEANUP**: GSAP context revert, ScrollTrigger kill

**USED BY**: AnimatedCounter.tsx  StatsSection.tsx

**STATUS**: ACTIVE  
**EVIDENCE**: hooks/useAnimatedCounter.ts

---

## useCinematicTransitions

**CATEGORY**: Animation / GSAP  
**PURPOSE**: Page transition effects

**USED BY**: app/portfolio/page.tsx, app/contact/page.tsx  
**NOTE**: Supports `scope` ref to isolate animations (prevents cross-page conflicts).

**STATUS**: ACTIVE  
**EVIDENCE**: hooks/useCinematicTransitions.ts

---

## REMOVED HOOKS

### useFloatingParticles (DELETED 2026-01-23)
**REASON**: Stub implementation, zero imports  
**SAVINGS**: 1.8KB

### useScrollScenes (DELETED 2026-01-23)
**REASON**: Zero imports confirmed  
**SAVINGS**: 1.2KB

---

## SUMMARY

**Total Hooks**: 12 active  
**Categories**:
- 1 Singleton (useResponsiveMode)
- 2 Controllers (useCinematicScroll, useNineDimensionsController)
- 5 Animation (GSAP-based)
- 4 Utility

**Cleanup Compliance**: All hooks follow proper cleanup patterns
