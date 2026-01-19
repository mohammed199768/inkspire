"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { CheckCircle } from "lucide-react";

interface ServiceCardProps {
    icon: string;
    title: string;
    desc?: string;
    selected: boolean;
    onClick: () => void;
}

const iconMap: Record<string, any> = {
    Fingerprint: LucideIcons.Fingerprint,
    Clapperboard: LucideIcons.Clapperboard,
    Laptop: LucideIcons.Laptop,
    CalendarCheck: LucideIcons.CalendarCheck,
    PenTool: LucideIcons.PenTool,
    Megaphone: LucideIcons.Megaphone,
};

export const ServiceCard = ({ icon, title, desc, selected, onClick }: ServiceCardProps) => {
    const Icon = iconMap[icon] || CheckCircle;

    return (
        <div
            onClick={onClick}
            className={`relative cursor-pointer group p-6 rounded-2xl border transition-all duration-500 ${
                selected 
                ? "bg-purple-500/20 border-purple-400/50 shadow-[0_0_50px_rgba(160,160,255,0.2)] scale-[1.03]" 
                : "bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.02]"
            }`}
        >
            <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500 ${
                selected ? "border-purple-400 bg-purple-400 scale-100 rotate-0" : "border-white/20 scale-50 opacity-0 group-hover:opacity-100 -rotate-90"
            }`}>
                {selected && <CheckCircle size={14} className="text-black" />}
            </div>
            
            <div className={`mb-5 p-3 rounded-xl inline-block transition-all duration-500 ${selected ? "bg-purple-500/30 text-purple-300 scale-110" : "bg-white/5 text-gray-500 group-hover:text-white group-hover:rotate-12"}`}>
                <Icon size={28} />
            </div>

            <h4 className={`text-base md:text-lg font-bold tracking-tight mb-2 ${selected ? "text-white" : "text-gray-400 transition-colors group-hover:text-white"}`}>{title}</h4>
            
            {desc && (
                <p className={`text-[11px] leading-snug transition-opacity duration-500 font-light ${selected ? "text-purple-200/60" : "text-gray-600 group-hover:text-gray-400"}`}>
                    {desc.split('.')[0]}.
                </p>
            )}
        </div>
    );
};
