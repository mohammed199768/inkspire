# DATA SOURCES

**Last Updated**: 2026-01-23T16:50:00+03:00

---

## 1. Static Data Files (Build-Time)

**LOCATION**: `/data/*.ts`  
**TYPE**: Hard-coded TypeScript objects  
**USAGE**: Imported directly by components/pages

### Primary Files:
- **`projects.ts`**:
  - Full portfolio data (slug, title, images, credits)
  - Used by: `app/portfolio/`, `SelectedWorkSection`, `WorksTunnel`
  - Truth: Single source for all work items

- **`clients.ts`**:
  - Client logos and names
  - Used by: `ClientsMarquee`, `app/page.tsx`

- **`staticData.ts`**:
  - Stats numbers, team members, testimonials
  - Used by: `StatsSection`, `TeamSection`, `TestimonialsSection`

- **`siteContent.ts`**:
  - Hero copy, shared text, navigation links
  - Used by: `HeroScene`, `NavbarFullMenu`

**EVIDENCE**: `data/` directory content, direct imports in components

---

## 2. Runtime Sensors (Client-Side)

**LOCATION**: Hooks / Event Listeners  
**TYPE**: Ephemeral, derived from environment  
**PERSISTENCE**: None (resets on reload)

### Primary Sensors:
- **`window.innerWidth` / `matchMedia`**:
  - Ingress: `useResponsiveMode` (Singleton)
  - Egress: `isMobile`, `isTablet`, `scrollMode`
  - **EVIDENCE**: `hooks/useResponsiveMode.ts`

- **`navigator.deviceMemory` / `hardwareConcurrency`**:
  - Ingress: `useResponsiveMode`
  - Egress: `render3D` (Capability gating)
  - **EVIDENCE**: `hooks/useResponsiveMode.ts:167`

- **`document.visibilityState`**:
  - Ingress: `usePageVisibility`
  - Egress: `isPageActive` (Pauses RAF loops)
  - **EVIDENCE**: `hooks/usePageVisibility.ts`

- **`matchMedia('(pointer: coarse)')`**:
  - Ingress: `useIsTouchDevice`
  - Egress: `isTouch`, `cursor` visibility
  - **EVIDENCE**: `hooks/useIsTouchDevice.ts`

---

## 3. User Input Events

**LOCATION**: Event Listeners on DOM  
**TYPE**: Real-time interaction

### Primary Inputs:
- **Scroll / Wheel**:
  - Ingress: `useCinematicScroll` (Lenis), `useNineDimensionsController`
  - Output: Page navigation, animation progress
  - **EVIDENCE**: `hooks/useCinematicScroll.ts`

- **Mouse Move**:
  - Ingress: `CinematicRevealGrid`, `CursorImpl`
  - Output: Clip-path reveals, custom cursor position
  - **EVIDENCE**: `components/hero/CinematicRevealGrid.tsx`

- **Clicks**:
  - Ingress: `usePopup` triggers
  - Output: Modal open state
  - **EVIDENCE**: `hooks/usePopup.tsx`

- **Keyboard (Arrow Keys)**:
  - Ingress: `useNineDimensionsController`
  - Output: Section navigation
  - **EVIDENCE**: `hooks/useNineDimensionsController.ts`

---

## 4. Derived Data Patterns

**PATTERN**: `useMemo` for filtering/formatting  
**EXAMPLE**: `WorksTunnel` triples project data for visual density  
**CODE**:
```typescript
const massiveWorks = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    return [...projects, ...projects, ...projects];
}, []);
```
**EVIDENCE**: `components/sections/WorksTunnel/WorksTunnel.tsx:59`

---

## MISSING DATA SOURCES (Confirmed)

❌ **NO API Fetching**: `fetch`, `axios`, `SWR` are NOT used  
❌ **NO LocalStorage**: User preferences not persisted  
❌ **NO Cookie/Session**: No auth state  
❌ **NO CMS**: No Headless CMS integration  

**EVIDENCE**: Codebase scan reveals solely static and sensor-based data.
