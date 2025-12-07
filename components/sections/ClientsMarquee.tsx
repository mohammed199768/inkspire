"use client";

import Image from "next/image";
import { clients } from "@/data/staticData";

export default function ClientsMarquee() {
    return (
        <div className="py-24 border-y border-white/5 bg-transparent relative overflow-hidden group">
            {/* Gradient Masks (kept transparent as per design) */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-transparent to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-transparent via-transparent to-transparent z-10 pointer-events-none" />

            <div className="max-w-[100vw] overflow-hidden">
                <div className="flex gap-20 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused] items-center">
                    {/* Double the list for seamless loop */}
                    {[...clients, ...clients].map((client, i) => (
                        <div key={i} className="relative w-48 h-32 md:w-64 md:h-40 flex-shrink-0 flex items-center justify-center transition-all duration-500 hover:scale-125 cursor-pointer hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]">
                            <div className="relative w-full h-full">
                                <Image
                                    src={client}
                                    alt="Client Logo"
                                    fill
                                    className="object-contain brightness-0 invert hover:filter-none transition-all duration-500"
                                    sizes="(max-width: 768px) 192px, 256px"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 60s linear infinite;
                    will-change: transform;
                }
            `}</style>
        </div>
    );
}
