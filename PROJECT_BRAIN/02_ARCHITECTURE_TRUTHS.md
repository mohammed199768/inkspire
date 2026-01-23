# ARCHITECTURE TRUTHS

**Last Updated**: 2026-01-23T16:36:31+03:00  
**Status**: FROZEN FACTS ONLY - Update only when code contradicts

---

## FACT: Client-Only Execution

**TRUTH**: No server runtime, no API, no database  
**EVIDENCE**: No `/api` folder, no server files in app/, package.json has no server deps  
**IMPLICATION**: All data must be static or client-computed

## FACT: Dual Scroll Modes

**TRUTH**: Desktop uses Lenis smooth scroll, mobile/tablet uses native  
**DECISION LOGIC**:
- Desktop + fine pointer + !reducedMotion → cinematic (Lenis)
- Otherwise → native browser scroll

**EVIDENCE**: hooks/useCinematicScroll.ts:30-45, hooks/useResponsiveMode.ts:80-95

## FACT: Hydration Safety Protocol

**TRUTH**: Server renders default desktop state, client detects actual device  
**LAYERS**:
1. Server snapshot returns desktop defaults (isHydrated: false)
2. First client render detects actual device (isHydrated: true)
3. Components guard with `if (!isHydrated) return placeholder;`

**EVIDENCE**: hooks/useResponsiveMode.ts:120-140, components/nine-dimensions/NineDimensionsLayout.tsx:129-136

## FACT: Global Singleton Pattern

**TRUTH**: useResponsiveMode is a singleton using useSyncExternalStore  
**WHY**: All components must share same device state (prevents re-render storms)  
**MECHANISM**: Single store, reference counted cleanup

**EVIDENCE**: hooks/useResponsiveMode.ts:1-200 (entire file implements singleton)

## FACT: Three Animation Systems Coexist

**TRUTH**: GSAP (imperative), Framer Motion (declarative), Three.js (RAF) all used  
**SEPARATION**:
- GSAP: Scroll reveals, page transitions, tunnel warps
- Framer Motion: Section transitions, in-view fades
- Three.js: Continuous 3D particle rendering

**EVIDENCE**: Multiple imports across files (MotionLayout.tsx, NineDimensionsBackground.tsx, etc.)

## FACT: Demand Rendering Pattern

**TRUTH**: 3D scenes pause RAF when invisible  
**GATE LOGIC**: `isVisible && isPageActive && (isTransitioning || progress !== 0)`  
**SAVINGS**: Massive CPU/GPU when tab hidden or content off-screen

**EVIDENCE**: components/nine-dimensions/NineDimensionsBackground.tsx:411-417, components/tunnel/TunnelBackground.tsx:146-149

## FACT: GPU Morphing, Not CPU

**TRUTH**: Particle shape morphing happens entirely on GPU via shaders  
**MECHANISM**: Vertex shader interpolates between aPosStart/aPosEnd using uProgress uniform  
**COST**: Zero CPU during 1500-particle transitions

**EVIDENCE**: components/nine-dimensions/NineDimensionsBackground.tsx:47-85 (vertex shader code)

## FACT: Scroll Impulse Illusion Layer

**TRUTH**: Transient particle displacement on scroll attempts, vertex shader only  
**MECHANISM**:  
- Controller triggers impulse (0→1) on wheel/keyboard events
- Impulse decays via RAF (× 0.88 per frame, self-terminates at epsilon)
- Vertex shader adds displacement: `finalPos += vec3(wave, jitter) * uImpulse`

**DEMAND RENDERING COMPLIANCE**:  
- Gate extended: RAF runs if `impulse > epsilon` (in addition to transition/progress)
- Brief activity per scroll: ~300-600ms, then auto-stops
- **Zero new event listeners** (reuses existing wheel/keyboard handlers)

**COMPATIBILITY**:  
- Ignored if `prefersReducedMotion` or `profile.count === 0`
- No fragment shader changes (visual layer only)

**EVIDENCE**: hooks/useNineDimensionsController.ts:144-177, components/nine-dimensions/NineDimensionsBackground.tsx:450-490

## FACT: Tiered Performance Profiles

**TRUTH**: Different particle counts by device capability  
**PROFILES**:
- Desktop (>1024px): 1500 particles, DPR 1.5
- Tablet (768-1024px): 600-800 particles, DPR 1.0, IF deviceMemory >= 4GB
- Mobile (<768px): 0 particles, gradient fallback

**EVIDENCE**: components/nine-dimensions/NineDimensionsBackground.tsx:36-42

## FACT: Cleanup Patterns (Critical)

**TRUTH**: All effects must clean up to prevent leaks  
**PATTERNS**:
- RAF: `cancelAnimationFrame(ref.current)`
- GSAP ticker: `ticker.remove(callbackRef.current)` (MUST use ref, not inline)
- GSAP context: `context.revert()`
- Three.js: `safeDispose(object)`, `renderer.dispose()`
- Observers: `observer.disconnect()`
- Event listeners: `removeEventListener`

**EVIDENCE**: lib/three/safeDispose.ts, all documented hooks follow pattern

## FACT: No WeakSet for One-Time Disposal

**TRUTH**: WeakSet pattern only needed for shared resource deduplication  
**USED**: lib/three/safeDispose.ts (texture sharing across materials)  
**NOT USED**: Component-level disposal (no sharing, dispose once on unmount)

**EVIDENCE**: safeDispose.ts vs NineDimensionsBackground.tsx cleanup

## FACT: Static Data Only

**TRUTH**: All content from /data/*.ts files, no fetching  
**FILES**: projects.ts, clients.ts, siteContent.ts, staticData.ts  
**COMPILE TIME**: All data known at build, embedded in bundle

**EVIDENCE**: data/ folder, no fetch/axios calls in codebase

## FACT: Popup System (Global Context)

**TRUTH**: Single global popup via React Context  
**FLOW**: Component calls `openPopup(data)` → Context updates → InsightPopup renders  
**USED BY**: WorksTunnel, ClientsMarquee, SelectedWorkSection

**EVIDENCE**: hooks/usePopup.tsx, components/popup/InsightPopup.tsx

## FACT: Dynamic Import for Code-Splitting

**TRUTH**: Heavy modules dynamically imported to reduce initial bundle  
**EXAMPLES**:
- OrbitalClientsScene (ssr: false)
- CursorImpl (ssr: false)
- Heavy sections

**EVIDENCE**: components/sections/ClientsMarquee.tsx:46, components/ui/Cursor.tsx:25

## Missing Systems (Confirmed)

**TRUTH**: These DO NOT EXIST (evidence: absence)
- No backend server
- No database / ORM
- No authentication
- No WebSocket
- No CMS integration
- No real-time features
- No i18n system

**EVIDENCE**: No API routes, no db config, no auth middleware, no socket setup
