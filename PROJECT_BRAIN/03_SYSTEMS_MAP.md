# SYSTEMS MAP

**Last Updated**: 2026-01-23T16:36:31+03:00

---

## Routing System

**PURPOSE**: Next.js App Router for static page generation

**KEY FILES**:
- app/layout.tsx (root layout)
- app/page.tsx (home)
- app/contact/page.tsx
- app/portfolio/page.tsx
- app/portfolio/[slug]/page.tsx

**ROUTES**:
- /  NineDimensionsLayout (9 cinematic sections)
- /contact  ContactCommandCenter + ParticleGlobeScene
- /portfolio  Portfolio grid + WorksTunnel
- /portfolio/[slug]  Dynamic project pages

**DATA**: Static generation from data/projects.ts

**EVIDENCE**: app/ folder structure

---

## Layout Orchestration System

**PURPOSE**: Global wrappers and providers for entire app

**KEY FILES**:
- app/layout.tsx (RootLayout)
- components/layout/SmoothScroll.tsx (Lenis wrapper)
- components/layout/MotionLayout.tsx (page transitions)
- components/layout/NavbarFullMenu.tsx (menu overlay)

**DATA FLOW**:
- IN: children (page content)
- OUT: Wrapped with providers + global UI

**LIFECYCLE**: Mounts once, persists across route changes

**EVIDENCE**: app/layout.tsx:20-80

---

## Scroll System

**PURPOSE**: Dual-mode scroll (cinematic vs native)

**KEY FILES**:
- hooks/useCinematicScroll.ts (Lenis lifecycle)
- hooks/useNineDimensionsController.ts (9D navigation)
- hooks/useNativeScroll.ts (IntersectionObserver)
- components/layout/SmoothScroll.tsx (wrapper)

**MODES**:
- Cinematic: Desktop + finePointer + !reducedMotion  Lenis smooth scroll
- Native: Mobile/tablet OR reducedMotion  Standard browser scroll

**DATA INGRESS**:
- Scroll events
- Wheel events
- Keyboard (arrow keys)

**DATA EGRESS**:
- currentSection (9D)
- scroll progress (native)
- Lenis instance (ref)

**CLEANUP**:
- Remove GSAP ticker callback (useRef for dedup)
- Destroy Lenis instance
- Kill all ScrollTriggers
- Remove event listeners

**EVIDENCE**: hooks/useCinematicScroll.ts:1-300

---

## Animation System (GSAP)

**PURPOSE**: Imperative timeline-based animations

**KEY FILES**:
- hooks/useHeroAnimation.ts (hero entrance)
- hooks/useCinematicReveal.ts (clip-path reveals)
- hooks/useGSAPFade.ts (fade-in)
- hooks/useAnimatedCounter.ts (number counting)
- components/layout/MotionLayout.tsx (page transitions)

**DATA INGRESS**: DOM refs, scroll position, user interaction

**DATA EGRESS**: DOM mutations (style transforms)

**CLEANUP PATTERN**: 
- Short animations (<1s): No context needed
- Long animations: gsap.context() + evert()
- Ticker callbacks: 	icker.remove(callbackRef.current) (MUST use ref)
- ScrollTrigger: ScrollTrigger.getAll().forEach(t => t.kill())

**EVIDENCE**: Multiple hook files, MotionLayout.tsx

---

## Animation System (Framer Motion)

**PURPOSE**: Declarative React animations

**KEY FILES**:
- components/nine-dimensions/NineDimensionsLayout.tsx (AnimatePresence)
- components/layout/ResponsiveSection.tsx (in-view)
- components/contact/ContactCommandCenter.tsx (form)
- components/ui/Preloader.tsx

**DATA INGRESS**: React state changes, visibility

**DATA EGRESS**: Animated components

**CLEANUP**: Framer Motion handles cleanup automatically

**EVIDENCE**: Multiple component imports of framer-motion

---

## 3D/WebGL System (Three.js)

**PURPOSE**: Particle systems and 3D backgrounds

**KEY FILES**:
- components/nine-dimensions/NineDimensionsBackground.tsx (1500 particles, GPU morphing)
- components/contact/ParticleGlobeScene.tsx (5000 particles on sphere)
- components/tunnel/TunnelBackground.tsx (600 particles, shader-based)
- components/sections/clients/OrbitalClientsScene.tsx (3D logos)
- lib/three/safeDispose.ts (cleanup utility)

**DATA INGRESS**:
- targetShapeIndex (9D morphing)
- sectionIndex (tunnel colors)
- Page visibility
- IntersectionObserver

**DATA EGRESS**: Canvas rendering (WebGL)

**LIFECYCLE**:
- Setup: Create scene, camera, renderer, mesh
- Animation: RAF loop updates uniforms, renders
- Cleanup: safeDispose, renderer.dispose(), geometry/material disposal

**DEMAND RENDERING**: Pause RAF when !isVisible || !isPageActive

**EVIDENCE**: All 4 Three.js scene files

---

## Popup/Overlay System

**PURPOSE**: Global modal for project details

**KEY FILES**:
- hooks/usePopup.tsx (context + hook)
- components/popup/InsightPopup.tsx (modal UI)
- lib/popupMappers.ts (data transformation)

**DATA FLOW**:
1. Component calls openPopup(popupData)
2. PopupProvider updates context state
3. InsightPopup renders with data
4. User closes  closePopup()

**TRIGGERS**:
- WorksTunnel project clicks
- ClientsMarquee logo clicks
- SelectedWorkSection slide clicks

**EVIDENCE**: hooks/usePopup.tsx, multiple component imports

---

## Responsive/Capability Gating System

**PURPOSE**: Adapt UX to device capabilities

**KEY FILES**:
- hooks/useResponsiveMode.ts (singleton detection)
- hooks/useIsTouchDevice.ts (touch detection)
- hooks/usePageVisibility.ts (tab visibility)

**DATA INGRESS**:
- window.innerWidth
- matchMedia (pointer, hover, reduced-motion)
- navigator.deviceMemory
- navigator.hardwareConcurrency
- navigator.maxTouchPoints
- document.visibilityState

**DATA EGRESS**:
- scrollMode (cinematic | native)
- breakpoint (mobile | tablet | desktop)
- render3D (boolean)
- isHydrated (boolean)
- hasTouch (boolean)

**CLEANUP**: Reference counting, removes listeners when last subscriber unmounts

**EVIDENCE**: hooks/useResponsiveMode.ts (entire file)

---

## SYSTEM INTERACTIONS

`
Page Load
   RootLayout mounts
     SmoothScroll detects mode (cinematic/native)
       IF cinematic: Initialize Lenis
       IF native: Use standard scroll
     useResponsiveMode detects device
       Determines render3D, scrollMode
     NineDimensionsLayout (if home page)
       IF cinematic: useNineDimensionsController
       IF native: stacked sections
       NineDimensionsBackground (IF render3D)
         Demand rendering (pause when hidden)

User Interaction
   Scroll/Wheel
     IF cinematic: Lenis + GSAP ScrollTrigger
     IF native: IntersectionObserver
   Click project
     usePopup  openPopup(data)
       InsightPopup renders
`

**EVIDENCE**: Traced through layout.tsx, page.tsx, hook dependencies
