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
        <div id="services" ref={containerRef} className="scroll-mt-24 min-h-[100svh] lg:h-full flex flex-col justify-start pt-12 sm:pt-14 md:pt-16 pb-12 px-4 md:px-6 relative isolate overflow-visible">
            {/* Background Veil - High contrast for readability */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-full lg:h-[95%] w-full max-w-7xl mx-auto pointer-events-none z-0"
                 style={{ 
                     background: 'radial-gradient(circle at center, rgba(9,6,15,0.7), rgba(9,6,15,0.0) 85%)' 
                 }} 
            />

            <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col h-full">
                <SectionTitle 
                    title="Our" 
                    highlight="Intelligent" 
                    highlightColor="text-accentPurple"
                    className="mb-4 md:mb-6 lg:mb-8"
                />
                
                {/* 
                    Grid System for 6 Cards:
                    - Optimized to fit 100vh on Desktop
                    - Uses auto-rows-fr for equal heights
                */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-fr gap-3 md:gap-4 lg:gap-5 overflow-y-auto lg:overflow-visible pb-10 lg:pb-0 custom-scrollbar">
                    {services.map((service, i) => {
                        const IconComponent = iconMap[service.icon] || CheckCircle;

                        return (
                            <div
                                key={i}
                                onClick={() => openPopup(buildPopupFromService(service))}
                                className="fade-up group p-4 md:p-5 lg:p-6 cursor-pointer relative overflow-hidden flex flex-col items-start transition-all duration-500 hover:-translate-y-1 h-full"
                                style={{
                                    background: `
                                        linear-gradient(180deg, rgba(9,6,15,0.85), rgba(13,14,34,0.65)),
                                        radial-gradient(1200px 500px at 20% 0%, rgba(32,16,55,0.28), transparent 60%)
                                    `,
                                    boxShadow: `
                                        inset 0 0 0 1px rgba(255,255,255,0.08),
                                        0 20px 50px rgba(0,0,0,0.45)
                                    `,
                                    borderRadius: '24px'
                                }}
                            >
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                
                                <div className="relative z-10 w-full">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300 shadow-inner">
                                        <IconComponent className="text-white group-hover:text-accentPurple transition-colors w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    
                                    <h3 
                                        className="text-base md:text-lg lg:text-xl font-bold mb-1.5 tracking-tight transition-colors line-clamp-1"
                                        style={{ color: 'rgba(255,255,255,0.92)' }}
                                    >
                                        {service.title}
                                    </h3>
                                    
                                    <p 
                                        className="leading-relaxed text-[11px] md:text-xs lg:text-sm line-clamp-2 md:line-clamp-3 font-medium"
                                        style={{ color: 'rgba(255,255,255,0.70)' }}
                                    >
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
