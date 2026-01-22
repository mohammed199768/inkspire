import { stats } from "@/data/staticData";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import SectionTitle from "@/components/ui/SectionTitle";

export default function StatsSection() {
    return (
        <section className="scroll-mt-24 min-h-[100svh] relative isolate flex flex-col items-center justify-start pt-16 md:pt-20 pb-8 text-white w-full overflow-visible">
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
