# ROUTES AND PAGES

**Last Updated**: 2026-01-23T22:31:09+03:00

---

## Route: `/` (Home)

**ENTRY FILE**: app/page.tsx  
**COMPONENT**: NineDimensionsLayout  
**PURPOSE**: Main landing page with 9 cinematic sections

**SECTIONS** (in order):
0. HeroScene (Genesis) - Full height
1. StatsSection (Tunnel)
2. AboutSection (Sphere) - Full height
3. ServicesSection (Cube)
4. SelectedWorkSection (Helix)
5. TeamSection (Grid)
6. ClientsMarquee (Ring) - Full height
7. TestimonialsSection (Vortex) - Full height
8. FinalCTA (Harmony) - Full height

**DATA SOURCES**:
- siteContent.ts (hero copy, about, services)
- projects.ts (selected work)
- staticData.ts (stats, team, testimonials)
- clients.ts (client logos)

**MODES**:
- Desktop: Cinematic (fixed viewport, section switching)
- Mobile/Tablet: Native (stacked scroll)

**EVIDENCE**: app/page.tsx:1-10, components/nine-dimensions/NineDimensionsLayout.tsx:33-46

---

## Route: `/contact`

**ENTRY FILE**: app/contact/page.tsx  
**COMPONENTS**:
- ContactCommandCenter (form)
- ParticleGlobeScene (3D background)

**PURPOSE**: Contact form with particle globe visual

**DATA SOURCES**:
- siteContent.ts (contact info)
- Form state (local component state, not persisted)

**SUBMISSION**: Simulated (setTimeout 1.5s), no backend

**EVIDENCE**: app/contact/page.tsx, components/contact/ContactCommandCenter.tsx:22-26

---

## Route: `/portfolio`

**ENTRY FILE**: app/portfolio/page.tsx  
**LAYOUT FILE**: app/portfolio/layout.tsx (isolation boundary)  
**COMPONENTS**:
- WorksTunnel (CSS 3D tunnel effect)
- Portfolio grid layout

**PURPOSE**: Interactive portfolio display

**SCROLL MODE**: Native browser scroll (excluded from Lenis smooth scroll)

**DATA SOURCES**:
- projects.ts (tripled for visual density)

**INTERACTION**: Click project → opens popup (usePopup)

**ARCHITECTURE**: Portfolio has independent boundary layer isolating it from global scroll lifecycle

**EVIDENCE**:  
- app/portfolio/layout.tsx:1-48 (boundary implementation)  
- app/portfolio/page.tsx (page implementation)  
- hooks/useCinematicScroll.ts:L69 (scroll exclusion)  
- components/sections/WorksTunnel/WorksTunnel.tsx:59-62

---

## Route: `/portfolio/[slug]`

**ENTRY FILE**: app/portfolio/[slug]/page.tsx  
**LAYOUT FILE**: app/portfolio/layout.tsx (inherits parent boundary)  
**DYNAMIC PARAM**: slug (project identifier)

**PURPOSE**: Individual project detail pages

**SCROLL MODE**: Native browser scroll (inherited from parent exclusion)

**DATA RESOLUTION**:
- projects.ts filtered by slug
- Static generation at build time
- All slugs pre-rendered

**ARCHITECTURE**: Inherits Portfolio boundary isolation from parent layout

**EVIDENCE**:  
- app/portfolio/[slug]/page.tsx (page implementation)  
- app/portfolio/layout.tsx (parent boundary)  
- data/projects.ts (data source)

---

## Global Layout (All Routes)

**ENTRY FILE**: app/layout.tsx  
**WRAPS**: All pages

**COMPONENTS** (render order):
1. Preloader
2. SmoothScroll (Lenis wrapper)
   - PopupProvider
     - FloatingVectorParticles
     - Cursor (desktop only)
     - NavbarFullMenu
     - MotionLayout (page transitions)
       - {children}
     - InsightPopup

**DATA SOURCES**:
- siteContent.ts (nav links)
- Font loading (app/fonts/)

**EVIDENCE**: app/layout.tsx:20-80

---

## Dynamic Route Generation

**STATIC PATHS**: Generated at build time from projects.ts  
**NO ISR**: No incremental static regeneration  
**NO SSR**: No server-side rendering

**EVIDENCE**: No getServerSideProps, no revalidate config
