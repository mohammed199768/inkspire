# ROUTES AND PAGES

**Last Updated**: 2026-01-23T16:40:23+03:00

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
**COMPONENTS**:
- WorksTunnel (CSS 3D tunnel effect)
- Portfolio grid layout

**PURPOSE**: Interactive portfolio display

**DATA SOURCES**:
- projects.ts (tripled for visual density)

**INTERACTION**: Click project → opens popup (usePopup)

**EVIDENCE**: app/portfolio/page.tsx, components/sections/WorksTunnel/WorksTunnel.tsx:59-62

---

## Route: `/portfolio/[slug]`

**ENTRY FILE**: app/portfolio/[slug]/page.tsx  
**DYNAMIC PARAM**: slug (project identifier)

**PURPOSE**: Individual project detail pages

**DATA RESOLUTION**:
- projects.ts filtered by slug
- Static generation at build time
- All slugs pre-rendered

**EVIDENCE**: app/portfolio/[slug]/page.tsx, data/projects.ts

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
