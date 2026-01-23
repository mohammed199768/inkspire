// ============================================================================
// ARCHITECTURAL INTENT: Statistics Display Section
// ============================================================================
// Displays animated statistics using AnimatedCounter component.
//
// SIMPLICITY: Minimal logic - pure composition
// - Uses AnimatedCounter (Tier 1 hook: useAnimatedCounter)
// - Static data mapping (stats array)
// - Grid layout (1-4 columns responsive)
//
// ANIMATION: Delegated to AnimatedCounter component
// - Scroll-triggered counting (proxy pattern)
// - GSAP-powered number animation
//
// EVIDENCE: Simple section, delegates to Tier 1 components
// ============================================================================

import { stats } from "@/data/staticData";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import SectionTitle from "@/components/ui/SectionTitle";

export default function StatsSection() {
    return (
        <section className="scroll-mt-24 min-h-[100svh] relative isolate flex flex-col items-center justify-start pt-12 sm:pt-14 md:pt-16 pb-8 text-white w-full overflow-visible">
            {/* High-priority Title Layer - Isolated from overlays and animations */}
            <div className="relative z-50 w-full mb-8 md:mb-12 isolate">
                <SectionTitle 
                    title="Strategic" 
                    highlight="Impact" 
                    highlightColor="text-accentPurple"
                    className="!opacity-100 !visible !block" 
                />
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center w-full max-w-7xl px-4 md:px-6 mx-auto">
                {stats.map((item, i) => (
                    <AnimatedCounter key={i} value={item.val} label={item.label} />
                ))}
            </div>
        </section>
    );
}
