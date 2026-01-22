"use client";

import Image from "next/image";
import { team } from "@/data/staticData";
import SectionTitle from "@/components/ui/SectionTitle";
import { useGSAPFade } from "@/hooks/useGSAPFade";
import { usePopup } from "@/hooks/usePopup";
import { buildPopupFromTeamMember } from "@/lib/popupMappers";

export default function TeamSection() {
    const containerRef = useGSAPFade();
    const { openPopup } = usePopup();

    return (
        <div id="team" ref={containerRef} className="scroll-mt-24 min-h-[100svh] flex flex-col justify-start pt-12 sm:pt-14 md:pt-16 pb-8 px-4 md:px-6 relative overflow-visible">
            <SectionTitle 
                title="Meet The" 
                highlight="Team" 
                highlightColor="text-accentPurple" 
            />
            <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-2 md:gap-6 lg:gap-10 max-w-7xl mx-auto w-full">
                {team.map((member, i) => (
                    <div
                        key={i}
                        onClick={() => openPopup(buildPopupFromTeamMember(member))}
                        className="fade-up group relative w-full md:w-[260px] lg:w-[350px] h-[280px] md:h-[380px] lg:h-[500px] rounded-xl md:rounded-3xl overflow-hidden transition-all duration-500 md:hover:scale-105 cursor-pointer"
                    >
                        <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover object-top transition-all duration-500 grayscale-0 opacity-100 md:grayscale md:opacity-60 md:group-hover:grayscale-0 md:group-hover:opacity-100"
                            sizes="(max-width: 768px) 50vw, 350px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-6 lg:p-8 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300 z-10">
                            <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-1 leading-tight">{member.name}</h3>
                            <p className="text-accentPurple font-medium tracking-wide text-xs md:text-base">{member.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
