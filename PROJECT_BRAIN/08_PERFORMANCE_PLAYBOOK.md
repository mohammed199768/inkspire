# PERFORMANCE PLAYBOOK

**Last Updated**: 2026-01-23T16:50:00+03:00

---

## 1. LCP Strategy (Largest Contentful Paint)

**GOAL**: Prioritize hero assets, delay everything else.

**TACTICS**:
- **Hero Image Priority**: `priority={true}` on the first image in `CinematicRevealGrid`.
  - **EVIDENCE**: `components/hero/CinematicRevealGrid.tsx`
- **Lazy Loading**: `loading="lazy"` (default) for carousel/below-fold images.
  - **EVIDENCE**: `components/sections/SelectedWorkSection.tsx` (priority on first 3 only)
- **Preloader**: Short mask to hide initial layout shift/hydration.
  - **EVIDENCE**: `components/ui/Preloader.tsx`

---

## 2. Dynamic Imports (Code Splitting)

**GOAL**: Keep initial bundle small; load heavy 3D chunks on demand.

**TACTICS**:
- **3D Scenes**: `OrbitalClientsScene` is dynamically imported with `ssr: false`.
  - **EVIDENCE**: `components/sections/ClientsMarquee.tsx:13`
- **Custom Cursor**: Client-only import to avoid hydration matches.
  - **EVIDENCE**: `components/ui/Cursor.tsx`

---

## 3. Demand Rendering (RAF Management)

**GOAL**: Zero GPU/CPU usage when tab hidden or component off-screen.

**TACTICS**:
- **Page Visibility Gate**:
  ```typescript
  const isPageActive = usePageVisibility();
  if (!isPageActive) cancelAnimationFrame();
  ```
  - **EVIDENCE**: `NineDimensionsBackground`, `TunnelBackground`, `ParticleGlobeScene`
- **Visibility Gate**:
  - `IntersectionObserver` disconnects RAF when component leaves viewport.
  - **EVIDENCE**: `hooks/useCinematicScroll.ts`
- **CRITICAL: Visibility Resume Bridge**:
  - `IntersectionObserver` alone is **insufficient** for RAF resume after tab switches.
  - Page visibility changes (tab switches) do NOT fire IntersectionObserver callbacks.
  - **REQUIRED**: Add dedicated `useEffect` watching `isPageActive` to restart RAF.
  - **EVIDENCE**: `components/nine-dimensions/NineDimensionsBackground.tsx:518-553`

**SCROLL IMPULSE EXTENSION** (Added: 2026-01-23):
- **Gate Logic**: RAF now runs if `impulse > epsilon` (in addition to transition/progress checks)
  ```typescript
  const epsilon = 0.01;
  if (!isVisible || !isPageActive || 
      (!isTransitioning && progress === 0 && impulse < epsilon)) {
    // Stop RAF
  }
  ```
- **Duration**: Brief RAF activity during scroll impulse decay (~300-600ms per scroll attempt)
- **Self-Terminating**: Impulse decays (× 0.88 per frame), RAF auto-stops at epsilon
- **Compatibility**: Impulse ignored if `prefersReducedMotion` or `profile.count === 0`
- **EVIDENCE**: `components/nine-dimensions/NineDimensionsBackground.tsx:450-490`

---

## 4. Performance Optimization History

### 2026-01-24: WebGL Idle CPU Fix

**PROBLEM**: Continuous RAF loop consuming 48.2% CPU when idle (no user interaction).

**ROOT CAUSE**: Unconditional `scene.rotation.y += 0.0005` in animation loop prevented demand rendering gate from stopping RAF.

**EVIDENCE**:
- Baseline: 48.2% CPU idle, 65.5% active
- Test A (WebGL disabled): 2.5% idle, 12% active
- **Delta**: 94.8% reduction → WebGL = 95% of total load

**FIXES APPLIED**:

1. **Conditional Scene Rotation** (`NineDimensionsBackground.tsx:L486-500`)
   - Made rotation conditional on `hasActivity` (transitions, progress > 0, impulse > epsilon)
   - Expected impact: ~90% CPU reduction on idle

2. **Particle Count Reduction (-50%)** (`NineDimensionsBackground.tsx:L73-79`)
   - Desktop: 1500 → 750 particles, Tablet: 800 → 400
   - Impact: ~30% GPU memory reduction

3. **Ref-Based Impulse Pattern** (Prevent Context Destruction)
   - Store `scrollImpulse` in `useRef` to decouple animation loop from React render cycle
   - Prevents destroying WebGL context on every scroll frame (Zombie Loop cause #1)

4. **Gate Logic Fix** (The "One-Line Fix")
   - Removed `progress === 0` check from demand gate
   - **Why**: Initial intro animation leaves `progress` at 1. Old gate kept running forever.
   - **Result**: CPU drops to **0.7%** (Idle)
   - **Trade-off**: Idle drift freezes (worth it for 98% savings)

**FINAL METRICS (2026-01-24)**:
- Idle CPU: **0.7%** (was 48.2%) 📉
- Zombie Loop: **Dead** 💀
- Status: **SOLVED**

---

## 5. Capability Gating (Tiered Experience)

**GOAL**: 60fps on potato phones, Cinematic on desktops.

**TACTICS**:
- **`render3D` Flag**:
  - `true` only if `deviceMemory >= 4GB` AND `hardwareConcurrency >= 6`.
  - Otherwise, render gradient fallback (Zero WebGL).
  - **EVIDENCE**: `hooks/useResponsiveMode.ts`
- **Particle Count Scaling**:
  - Desktop: 1500 particles, DPR 1.5
  - Tablet: 600 particles, DPR 1.0
  - Mobile: 0 particles
  - **EVIDENCE**: `components/nine-dimensions/NineDimensionsBackground.tsx`

---

## 5. Memory Management

**GOAL**: No leaks on route changes.

**TACTICS**:
- **Three.js Disposal**: Use `safeDispose(object)` on unmount.
  - **EVIDENCE**: `lib/three/safeDispose.ts`
- **GSAP Context**: Use `gsap.context()` for easy revert.
  - **EVIDENCE**: `hooks/useHeroAnimation.ts`
- **Ticker Cleanups**: Must use reference to function, not inline closure.
  - **EVIDENCE**: `hooks/useCinematicScroll.ts`
- **Context Loss Handling**: Listen for `webglcontextlost` and `webglcontextrestored`.
  - **EVIDENCE**: `components/nine-dimensions/NineDimensionsBackground.tsx`

---

## 6. Safari Optimizations

**GOAL**: Prevent rendering crashes/glitches on WebKit.

**TACTICS**:
- **Filters**: Detect Safari and simplify `backdrop-filter` or opacity effects.
  - **EVIDENCE**: `components/sections/ClientsMarquee.tsx` (Logo grayscale tweak)
- **Backface Visibility**: Applied to 3D CSS transforms to prevent flickering.

---

## SUMMARY

**Critical Rule**:
**Critical Rule 1**:
If adding a new animation loop (RAF), you **MUST** implement the Demand Rendering pattern. Never allow an infinite loop that runs when the tab is hidden.

**Critical Rule 2**:
Avoid "Hidden by Default" global CSS classes. Always set initial hidden state in JavaScript (`gsap.set`) immediately before animation. This prevents "blank page" syndrome if JS fails.
