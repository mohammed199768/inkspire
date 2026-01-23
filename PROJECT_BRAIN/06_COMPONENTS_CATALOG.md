# COMPONENTS CATALOG

**Last Updated**: 2026-01-23T16:47:11+03:00

**STATUS**: PARTIALLY DOCUMENTED
Components documented inline via 32 files (Tier 1-3B). Full catalog deferred to avoid duplication.

---

## Layout Components

**EVIDENCE LOCATION**: Documented in Tier 2  
**FILES**:
- components/layout/MotionLayout.tsx - Page transitions (GSAP)
- components/layout/SmoothScroll.tsx - Lenis wrapper  
- components/layout/ResponsiveSection.tsx - Dual-mode section renderer
- components/layout/NavbarFullMenu.tsx - Fullscreen menu

**DOCUMENTATION**: See PROJECT_BRAIN/../.gemini/antigravity/brain/ TIER2_CHECKPOINT.md

---

## Nine Dimensions System

**EVIDENCE LOCATION**: Documented in Tier 2 + 3B  
**FILES**:
- components/nine-dimensions/NineDimensionsLayout.tsx - Orchestrator
- components/nine-dimensions/NineDimensionsBackground.tsx - 3D particle system
- components/nine-dimensions/NineDimensionsHUD.tsx - Navigation

**DOCUMENTATION**: See TIER2_CHECKPOINT.md, FILE_CONTEXT (if created)

---

## Hero System

**EVIDENCE LOCATION**: Documented in Tier 3A  
**FILES**:
- components/hero/HeroScene.tsx - Hero orchestrator
- components/hero/CinematicRevealGrid.tsx - Image reveal grid

**DOCUMENTATION**: See TIER3A_FINAL_SUMMARY.md

---

## Contact System

**EVIDENCE LOCATION**: Documented in Tier 3A  
**FILES**:
- components/contact/ContactCommandCenter.tsx - Form
- components/contact/ParticleGlobeScene.tsx - 3D globe

**DOCUMENTATION**: See TIER3A_FINAL_SUMMARY.md

---

## Tunnel System

**EVIDENCE LOCATION**: Documented in Tier 3B  
**FILES**:
- components/tunnel/TunnelExperience.tsx - Orchestrator
- components/tunnel/TunnelBackground.tsx - Three.js shader tunnel
- components/sections/WorksTunnel/WorksTunnel.tsx - CSS 3D tunnel

**DOCUMENTATION**: See TIER3B_TUNNEL_CHECKPOINT.md

---

## Sections

**EVIDENCE LOCATION**: Documented in Tier 3B  
**FILES**:
- components/sections/ClientsMarquee.tsx
- components/sections/StatsSection.tsx
- components/sections/SelectedWorkSection.tsx
- components/sections/TestimonialsSection.tsx
- Others: AboutSection, ServicesSection, TeamSection, FinalCTA

**DOCUMENTATION**: See TIER3B_SECTIONS_CHECKPOINT.md

---

## UI Primitives

**EVIDENCE LOCATION**: Documented in Tier 2  
**FILES**:
- components/ui/Preloader.tsx
- components/ui/Cursor.tsx + CursorImpl.tsx
- components/ui/AnimatedCounter.tsx
- Others: SectionTitle, TypewriterText, etc.

**DOCUMENTATION**: See TIER2_CHECKPOINT.md

---

## RULE FOR CHATGPT WORKSPACES

**DO NOT infer component architecture from this file.**  

Instead:
1. Check 03_SYSTEMS_MAP.md for system-level architecture
2. Check ../brain/ TIER checkpoints for documented components
3. Check inline code comments for WHY-focused documentation
4. If component not documented: Mark as TODO-VERIFY, do not guess

**EVIDENCE**: 32 files comprehensively documented with inline comments + TIER checkpoints
