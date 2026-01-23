# PROJECT INDEX

**Last Updated**: 2026-01-23T16:32:52+03:00  
**Status**: FROZEN - Update only if architecture contradicts. Always include EVIDENCE.

## Project Identity

**NAME**: Inkspire Studio  
**PURPOSE**: Digital creative agency marketing/portfolio website  
**DOMAIN**: https://inkspire.studio  
**TYPE**: Static Next.js site showcasing cinematic web experiences  
**CODEBASE**: c:\Users\domim\Desktop\new_inkspir

## What This Project IS

✅ **Marketing/Portfolio Website**
- Showcase for digital creative agency
- High-performance visual experiences
- Cinematic motion and 3D effects
- Static content (no CMS)

✅ **Client-Only Execution**
- Next.js 14 App Router
- Static generation (next build + export pattern)
- Client-side hydration only
- All data hard-coded in `/data/*.ts`

**EVIDENCE**: package.json scripts, app/ structure, no server files

## What This Project IS NOT

❌ **NO Backend**: No Express/Fastify server, no API routes  
❌ **NO Database**: No MongoDB/PostgreSQL, no ORM  
❌ **NO Authentication**: No user accounts, login, or protected routes  
❌ **NO Real-time**: No WebSockets, no live updates  
❌ **NO CMS**: All content static in TypeScript files  
❌ **NO i18n**: English-only content

**EVIDENCE**: No `/api` routes, no database config, no auth middleware

## Technology Stack

### Framework
- Next.js 14.2.33 (App Router)
- React 18
- TypeScript 5

**EVIDENCE**: package.json:14-16

### Animation & 3D
- Three.js 0.160.0 + @react-three/fiber 8.17.10 + @react-three/drei 9.121.4
- GSAP 3.12.5 (imperative timelines)
- Framer Motion 12.23.24 (declarative React)
- Lenis 1.3.15 (smooth scroll)

**EVIDENCE**: package.json:17-21

### Styling
- Tailwind CSS 3.4.13
- CSS Modules (for complex components)
- Custom CSS variables

**EVIDENCE**: tailwind.config.ts, styles/globals.css

### UI Libraries
- lucide-react 0.446.0 (icons)
- Swiper 11.1.14 (touch slider)
- Custom components (no external UI library)

**EVIDENCE**: package.json:25-27

## Deployment Intent

**Target**: Static CDN hosting  
**Build**: `npm run build` → static HTML/CSS/JS  
**Export**: Configured for static export  
**Data**: All content compiled at build time

**EVIDENCE**: next.config.mjs, package.json build script

## Folder Organization

```
/app                    - Next.js App Router (routes & layouts)
/components             - React components (by domain)
  /contact             - Contact page components
  /hero                - Hero section components
  /layout              - Global layout components
  /nine-dimensions     - Home page 9D system
  /popup               - Popup/modal components
  /sections            - Section components
  /tunnel              - 3D tunnel experiences
  /ui                  - Reusable UI primitives
/hooks                  - Custom React hooks (12 active)
/lib                    - Utility libraries
  /three               - Three.js utilities (safeDispose)
/data                   - Static content (projects, clients, etc.)
/types                  - TypeScript definitions
/public                 - Static assets
/styles                 - Global CSS
/PROJECT_BRAIN          - Architecture documentation (THIS FOLDER)
```

**EVIDENCE**: Directory structure, verified via file system

## Routing Structure

- `/` → NineDimensionsLayout (9 cinematic sections)
- `/contact` → Contact form + ParticleGlobeScene
- `/portfolio` → Portfolio grid with WorksTunnel
- `/portfolio/[slug]` → Dynamic project pages

**EVIDENCE**: app/page.tsx, app/contact/page.tsx, app/portfolio/

## Component Hierarchy

```
RootLayout (app/layout.tsx)
├── Preloader
├── SmoothScroll (Lenis integration)
│   ├── PopupProvider
│   │   ├── FloatingVectorParticles
│   │   ├── Cursor (desktop only)
│   │   ├── NavbarFullMenu
│   │   ├── MotionLayout (page transitions)
│   │   │   └── {children} (page content)
│   │   └── InsightPopup
```

**EVIDENCE**: app/layout.tsx:20-80

## Evidence Pointers

All documentation in PROJECT_BRAIN includes evidence in format:
- `file.tsx:10-20` (line range)
- `hooks/useX.ts` (whole file)
- package.json:14 (specific line)

**Cross-reference with**:
- 02_ARCHITECTURE_TRUTHS.md (core patterns)
- 03_SYSTEMS_MAP.md (system breakdown)
- FILE_CONTEXT/ (file-level details)
