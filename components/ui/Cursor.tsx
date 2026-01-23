// ============================================================================
// ARCHITECTURAL INTENT: Custom Cursor Conditional Loader
// ============================================================================
// Smart loading pattern: Only load custom cursor code on desktop.
//
// PERFORMANCE OPTIMIZATION:
// - Dynamic import: CursorImpl code not in mobile bundle
// - Conditional rendering: Touch devices never mount cursor
// - SSR disabled: Cursor is client-only (requires window.matchMedia)
//
// DETECTION LOGIC:
// - isTouch === undefined: Initial render (waiting for detection)
// - isTouch === true: Mobile/tablet device
// - isTouch === false: Desktop with fine pointer
//
// BUNDLE IMPACT:
// - Without dynamic import: All users download cursor code
// - With dynamic import: Only desktop users download cursor code
// - Savings: ~5KB minified (CursorImpl + math logic)
//
// EVIDENCE: useIsTouchDevice documented in Tier 1
// ============================================================================

"use client";

import dynamic from "next/dynamic";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

// ARCHITECTURAL DECISION: Dynamic import for code-splitting
// CursorImpl only downloaded when isTouch === false
const CursorImpl = dynamic(() => import("./CursorImpl"), { ssr: false });

export default function Cursor() {
    const isTouch = useIsTouchDevice();

    // ARCHITECTURAL PATTERN: Guard Against Hydration + Touch Devices
    // - undefined: Initial client render (hook not yet determined)
    // - true: Touch device detected
    // Both cases: Don't render cursor
    if (isTouch === undefined || isTouch === true) {
        return null;
    }

    return <CursorImpl />;
}
