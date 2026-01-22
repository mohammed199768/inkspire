"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { clients } from "@/data/clients";
import { usePopup } from "@/hooks/usePopup";
import { buildPopupFromProject } from "@/lib/popupMappers";
import { projects } from "@/data/projects";
import { useResponsiveMode } from "@/hooks/useResponsiveMode";

// Dynamic import for the 3D scene (Desktop only heavyweight)
const OrbitalClientsScene = dynamic(() => import("./clients/OrbitalClientsScene"), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-white/20">Loading Orbital System...</div>
});

export default function ClientsSection() {
    const router = useRouter();
    const { openPopup } = usePopup();
    const { hasTouch, render3D, scrollMode } = useResponsiveMode();

    // Safari detection for performance and rendering optimization
    const isSafari = typeof navigator !== 'undefined' && 
                     /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // Show grid on touch devices or native scroll mode
    const showGrid = hasTouch || scrollMode === "native";
    // Show 3D only on desktop cinematic mode with render3D enabled
    const show3D = render3D && scrollMode === "cinematic";

    return (
        <section className="min-h-[100dvh] w-full flex items-start bg-white/[0.02] border-y border-white/5 relative overflow-visible pt-0">

            {/* 1. 3D BACKGROUND LAYER (Active on Desktop cinematic mode) */}
            {show3D && (
                <div className="absolute inset-0 z-0 overflow-visible pointer-events-auto">
                     <OrbitalClientsScene />
                </div>
            )}

            {/* 2. CONTENT LAYER (z-10) */}
            <div className="w-full h-full flex flex-col lg:flex-row relative z-10 pointer-events-none overflow-visible">

                {/* Left Column: Title */}
                <div className="w-full lg:w-1/3 p-6 md:p-12 flex flex-col justify-start pt-16 md:pt-20 pb-8 border-b lg:border-b-0 lg:border-r border-white/5 relative z-20 bg-black/20 backdrop-blur-sm pointer-events-auto">
                    <div className="relative">
                        <h6 className="text-sm font-medium text-purple-400 uppercase tracking-[0.2em] mb-4">
                            Partners
                        </h6>
                        <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight brand-font text-white">
                            Our <br /> Clients
                        </h3>
                        <div className="mt-8 w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-80" />

                        <p className="mt-6 text-white/50 max-w-sm text-lg">
                            Trusted by innovative brands worldwide to bring their vision to life.
                        </p>
                    </div>
                </div>

                {/* Right Column: Interaction Area */}
                <div className="w-full lg:w-2/3 relative min-h-[500px] lg:min-h-screen">
                    
                    {/* Grid for touch/native scroll mode */}
                    {showGrid && (
                        <div className="w-full h-full pointer-events-auto">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none z-0" />
                            <div className="grid grid-cols-2 md:grid-cols-4 h-full border-t lg:border-t-0 border-l border-white/5">
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
                                            const randomProject = projects[Math.floor(Math.random() * projects.length)];
                                            if (randomProject) {
                                                openPopup(buildPopupFromProject(randomProject));
                                            }
                                        }}
                                        className={`group relative min-h-[160px] lg:min-h-[25vh] border-r border-b border-white/5 flex items-center justify-center p-8 transition-all duration-500 overflow-visible cursor-pointer hover:z-30
                                            ${client.projectSlug
                                                ? 'hover:bg-white/[0.06]'
                                                : 'hover:bg-white/[0.02]'}`}
                                    >
                                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-in-out skew-x-12" />
                                        </div>
                                        <div className={`relative z-10 w-full h-full flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2
                                            ${isSafari ? 'opacity-40 group-hover:opacity-100' : ''}
                                            ${!isSafari ? (client.projectSlug
                                                ? 'grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100'
                                                : 'grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-60') : ''}`}>
                                            <Image
                                                src={client.logo}
                                                alt={client.name || "Client Logo"}
                                                fill
                                                className={`object-contain transition-all duration-500 ${
                                                    isSafari ? 'safari-logo-fix' : 'brightness-0 invert group-hover:brightness-[2]'
                                                }`}
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
