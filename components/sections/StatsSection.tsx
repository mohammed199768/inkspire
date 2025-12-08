import { stats } from "@/data/staticData";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function StatsSection() {
    return (
        <section className="min-h-[40vh] md:min-h-[50vh] flex items-center justify-center py-12 md:py-20 text-white w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12 text-center w-full max-w-7xl px-4 md:px-6 mx-auto">
                {stats.map((item, i) => (
                    <AnimatedCounter key={i} value={item.val} label={item.label} />
                ))}
            </div>
        </section>
    );
}
