// ============================================================================
// ARCHITECTURAL INTENT: Portfolio Boundary Layer
// ============================================================================
// This layout establishes an architectural boundary for the Portfolio system.
// It serves as the isolation wall between Portfolio routes and global systems.
//
// CURRENT STATE: Minimal pass-through (precautionary boundary)
// FUTURE STATE: Can add Portfolio-specific providers without affecting global
//
// WHAT PORTFOLIO INHERITS (from parent RootLayout):
// - Theme (CSS variables, fonts)
// - PopupProvider (for WorksTunnel project clicks)
// - NavbarFullMenu (global navigation)
// - Cursor component
// - MotionLayout (page transitions)
//
// WHAT PORTFOLIO EXCLUDES:
// - Lenis smooth scroll (via path exclusion in useCinematicScroll)
// - Global ScrollTrigger animations
// - 9D navigation system
//
// SCROLL MODE: Native browser scroll (excluded from Lenis)
//
// RATIONALE:
// - Reduces coupling with global scroll lifecycle
// - Provides extension point for future Portfolio-specific state
// - Follows same pattern as home page custom navigation
//
// EVIDENCE: Documented in PROJECT_BRAIN/03_SYSTEMS_MAP.md (Portfolio Boundary)
// ============================================================================

import { ReactNode } from "react";

/**
 * Portfolio Layout - Architectural Boundary
 * 
 * Establishes clear separation between Portfolio routes and global systems.
 * Currently a pass-through, but serves as the insertion point for any
 * Portfolio-specific providers, contexts, or configurations.
 */
export default function PortfolioLayout({ children }: { children: ReactNode }) {
  // Pure pass-through for now
  // Future: Can add Portfolio-specific providers here:
  // - Portfolio navigation state
  // - Gallery filtering context
  // - Portfolio-specific analytics
  // - etc.
  
  return <>{children}</>;
}
