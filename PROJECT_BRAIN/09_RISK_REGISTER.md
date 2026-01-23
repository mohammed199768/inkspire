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

## SUMMARY

**Top Priority**: Ensure `safeDispose` and RAF cleanup are NEVER missed in new 3D components.
