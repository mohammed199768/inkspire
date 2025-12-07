import { stats } from "@/data/staticData";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function StatsSection() {
    return (
        <div className="min-h-[50vh] flex items-center justify-center py-20 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center w-full max-w-6xl px-6">
                {stats.map((item, i) => (
                    <AnimatedCounter key={i} value={item.val} label={item.label} />
                ))}
            </div>
        </div>
    );
}
