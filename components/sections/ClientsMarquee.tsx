"use client";

import Image from "next/image";
import { clients } from "@/data/staticData";

export default function ClientsSection() {
    return (
        <section className="py-24 relative border-y border-white/5 bg-white/[0.02]">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-wrap lg:flex-nowrap">

                    {/* Left Column: Title */}
                    <div className="w-full lg:w-1/3 mb-12 lg:mb-0 lg:pr-12 flex flex-col justify-center">
                        <div className="relative">
                            <h6 className="text-sm font-medium text-purple-400 uppercase tracking-[0.2em] mb-4">
                                Partners
                            </h6>
                            <h3 className="text-4xl md:text-5xl font-bold leading-tight brand-font text-white">
                                Our <br /> Clients
                            </h3>
                            <div className="mt-6 w-16 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-80" />
                        </div>
                    </div>

                    {/* Right Column: Logos Grid */}
                    <div className="w-full lg:w-2/3">
                        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-white/5">
                            {clients.slice(0, 16).map((client, i) => (
                                <div
                                    key={i}
                                    className="group relative h-32 md:h-40 border-r border-b border-white/5 flex items-center justify-center p-6 transition-all duration-500 hover:bg-white/[0.03]"
                                >
                                    <div className="relative w-full h-full flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                                        <Image
                                            src={client}
                                            alt="Client Logo"
                                            fill
                                            className="object-contain opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 brightness-0 invert group-hover:filter-none"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
