"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { clients } from "@/data/clients";
import { usePopup } from "@/hooks/usePopup";
import { buildPopupFromProject } from "@/lib/popupMappers";
import { projects } from "@/data/projects";

export default function ClientsSection() {
    const router = useRouter();
    const { openPopup } = usePopup();

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
                            {clients.slice(0, 16).map((client) => (
                                <div
                                    key={client.id}
                                    onClick={() => {
                                        if (client.projectSlug) {
                                            const project = projects.find(p => p.slug === client.projectSlug);
                                            if (project) {
                                                openPopup(buildPopupFromProject(project));
                                                return;
                                            }
                                        }
                                        // "أي اشي عشوائي من البروجيكتس" - Random project if no slug or project not found
                                        const randomProject = projects[Math.floor(Math.random() * projects.length)];
                                        if (randomProject) {
                                            openPopup(buildPopupFromProject(randomProject));
                                        }
                                    }}
                                    className={`group relative h-32 md:h-40 border-r border-b border-white/5 flex items-center justify-center p-8 transition-all duration-500 overflow-hidden cursor-pointer
                                        ${client.projectSlug
                                            ? 'hover:bg-white/[0.06]'
                                            : 'hover:bg-white/[0.02]'}`}
                                >
                                    {/* Animated Shine Sweep - Visible for all logos */}
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out skew-x-12" />
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent transition-opacity duration-700" />
                                    </div>

                                    {/* Logo Container - Lift & Scale on Hover */}
                                    <div className={`relative w-full h-full flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2
                                        ${client.projectSlug
                                            ? 'grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100'
                                            : 'grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-60'}`}>
                                        <Image
                                            src={client.logo}
                                            alt={client.name || "Client Logo"}
                                            fill
                                            className="object-contain transition-all duration-500 brightness-0 invert group-hover:brightness-[2] group-hover:drop-shadow-[0_10px_20px_rgba(255,255,255,0.3)]"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                    </div>

                                    {/* Bottom underline indicator - Only for items with projects */}
                                    {client.projectSlug && (
                                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
