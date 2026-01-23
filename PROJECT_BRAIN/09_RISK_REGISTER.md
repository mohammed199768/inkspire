# RISK REGISTER

**Last Updated**: 2026-01-23T16:50:00+03:00

---

## 1. Memory Leaks in Animation Loops

**SEVERITY**: HIGH
**CONTEXT**: Heavy use of custom RAF loops in Three.js and GSAP tickers.
**RISK**: If `remove` or `cancelAnimationFrame` fails on unmount, loops stack up, crashing the tab.
**EVIDENCE**: `hooks/useCinematicScroll.ts` manually manages GSAP tickers.
**MITIGATION**:
- Strict adherence to `useEffect` cleanup returns.
- Use `safeDispose` for WebGL resources.
- **Rule**: Never use inline functions for `gsap.ticker.add()`.

**SCROLL IMPULSE UPDATE** (2026-01-23):
- Scroll impulse feature added RAF-based decay mechanism in `useNineDimensionsController`
- **ZERO new event listeners added** (reuses existing wheel/keyboard handlers)
- Decay RAF cleanup: `cancelAnimationFrame(impulseDecayRef.current)` in unmount
- Self-terminating: decay loop stops when `impulse < epsilon`
- **EVIDENCE**: `hooks/useNineDimensionsController.ts:100-107` (cleanup), `144-177` (decay logic)

---

## 2. Hydration Mismatches

**SEVERITY**: MEDIUM
**CONTEXT**: Server renders desktop-default; Client renders mobile.
**RISK**: React layout shift or hydration errors (`Text content does not match`).
**EVIDENCE**: `hooks/useResponsiveMode.ts` uses `useSyncExternalStore`.
**MITIGATION**:
- `isHydrated` guard pattern.
- `if (!isHydrated) return null` (or placeholder) in components that depend on `window`.
- **Verified**: `NineDimensionsLayout` implements this guard.

---

## 3. Large Bundle Size (Three.js)

**SEVERITY**: MEDIUM
**CONTEXT**: 4 separate Three.js scenes imported.
**RISK**: Slow initial load on mobile.
**MITIGATION**:
- `OrbitalClientsScene` is dynamic imported (Verified).
- `NineDimensionsBackground` is core critical path (Acceptable).
- Shared library imports (ensure tree-shaking works).
- **Status**: Monitor `npm run build` sizes.

---

## 4. Dead Code Confusion

**SEVERITY**: LOW (Previously High)
**CONTEXT**: Templates/unused hooks cluttered the repo.
**RISK**: Developers use broken/stub hooks.
**MITIGATION**:
- **Audit Complete (2026-01-23)**: Removed `useFloatingParticles` (stub) and `useScrollScenes` (unused).
- **Remaining**: `@tsparticles/*` dependencies might be unused (Task pending).
- **Ref**: `11_DEAD_CODE_AUDIT.md`.

---

## 5. Safari Rendering Glitches

**SEVERITY**: LOW
**CONTEXT**: Complex CSS 3D + Backdrop Filters.
**RISK**: Visual artifacts or performance drops on iOS.
**MITIGATION**:
- `ClientsMarquee` has Safari-specific fallback logic.
- `HeroScene` used to have detection (removed as unused, but logic exists if needed).

---

## 6. Type Safety gaps

**SEVERITY**: LOW
**CONTEXT**: Some `any` usage in Three.js meshes or refs.
**RISK**: Runtime errors if refs are null.
**MITIGATION**:
- Strict `useRef<HTMLDivElement>(null)` typing.
- Null checks `if (!ref.current) return` in all effects.

---

## 7. Global Visibility Traps

**SEVERITY**: MEDIUM  
**CONTEXT**: CSS classes like `.fade-up { opacity: 0 }`.  
**RISK**: If JS fails or hook is missing, content remains invisible forever.  
**MITIGATION**:  
- **Inverted Logic**: CSS defaults to visible. JS hook sets initial hidden state.  
- **Ref**: `hooks/useGSAPFade.ts` refactored to specific visibility control.

---

## 8. External Hydration Interference

**SEVERITY**: LOW
**CONTEXT**: Browser extensions injecting attributes (e.g., `fdprocessedid`).
**RISK**: React hydration warnings polluting console.
**MITIGATION**:
- **Scoped Suppression**: `suppressHydrationWarning` on specific interactive elements (Buttons in Navbar).
- **Ref**: `components/layout/NavbarFullMenu.tsx`.

---

## 9. WebGL Context Loss

**SEVERITY**: LOW
**CONTEXT**: GPU crash or system sleep.
**RISK**: Canvas freezes or disappears without recovery.
**MITIGATION**:
- **Event Listeners**: `webglcontextlost` (stop loop) + `webglcontextrestored` (reload/re-init).
- **Ref**: `components/nine-dimensions/NineDimensionsBackground.tsx`.

---

## 10. RAF Loop Resume Failure After Tab Switch

**SEVERITY**: MEDIUM  
**CONTEXT**: Animation loops gated by Page Visibility API.  
**RISK**: RAF loop doesn't restart when user returns to tab, leaving animations frozen.  
**CAUSE**: IntersectionObserver only fires on scroll changes, not when tab visibility changes.  
**SYMPTOMS**: Particles frozen mid-morph, incorrect shapes displayed after tab switch.  
**MITIGATION**:  
- **Visibility Resume Bridge**: Dedicated `useEffect` watching `isPageActive`.
- When page becomes active: check if should animate (`isVisible && (isTransitioning || progress !== 0)`).
- If conditions met and RAF not running: call `animateRef.current()` to restart.
- When page becomes inactive: defensively cancel RAF.
- **Ref**: `components/nine-dimensions/NineDimensionsBackground.tsx:518-553`.

---

## 11. Privacy/Tracking Configuration Drift

**SEVERITY**: MEDIUM
**CONTEXT**: GTM allows adding tags/pixels without code changes.
**RISK**: GTM container configuration might drift from privacy policy (e.g., adding marketing pixels) without dev knowledge.
**MITIGATION**:
- **Environment Gating**: ID managed via `.env` (can swap containers).
- **Documentation**: Clear ownership defined in `16_TRACKING_SYSTEM.md`.
- **Constraint**: No custom events in code – limits "accidental" data leaks.

---

## SUMMARY

**Top Priority**: Ensure `safeDispose` and RAF cleanup are NEVER missed in new 3D components.
