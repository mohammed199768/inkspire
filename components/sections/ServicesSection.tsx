"use client";

import { services } from "@/data/staticData";
import SectionTitle from "@/components/ui/SectionTitle";
import {
    Fingerprint,
    Clapperboard,
    Laptop,
    CalendarCheck,
    PenTool,
    Target,
    Megaphone,
    CheckCircle,
    LucideIcon
} from "lucide-react";
import { useGSAPFade } from "@/hooks/useGSAPFade";
import { usePopup } from "@/hooks/usePopup";
import { buildPopupFromService } from "@/lib/popupMappers";

const iconMap: Record<string, LucideIcon> = {
    Fingerprint,
    Clapperboard,
    Laptop,
    CalendarCheck,
    PenTool,
    Target,
    Megaphone
};

export default function ServicesSection() {
    const containerRef = useGSAPFade();
    const { openPopup } = usePopup();

    return (
        <div ref={containerRef} className="min-h-full w-full flex flex-col pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-12">
            <div className="max-w-7xl mx-auto w-full">
                <SectionTitle title="Our" highlight="Intelligent" highlightColor="text-purple-400" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, i) => {
                        const IconComponent = iconMap[service.icon] || CheckCircle;

                        return (

                            <div
                                key={i}
                                onClick={() => openPopup(buildPopupFromService(service))}
                                className="fade-up group p-8 rounded-3xl bg-[#0B0F1A]/90 border border-white/10 shadow-lg hover:bg-zinc-900/90 transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-2 cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                                        <IconComponent className="text-white group-hover:text-purple-400 transition-colors" size={28} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-white">{service.title}</h3>
                                    <p className="text-white transition-colors leading-relaxed text-sm">
                                        {service.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
