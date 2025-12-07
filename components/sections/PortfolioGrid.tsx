"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const projects = [
    { id: 1, title: "Neon Horizon", category: "Web Design", image: "https://picsum.photos/seed/101/800/600" },
    { id: 2, title: "Quantum Leap", category: "Development", image: "https://picsum.photos/seed/102/800/600" },
    { id: 3, title: "Cyber Pulse", category: "Motion Graphics", image: "https://picsum.photos/seed/103/800/600" },
    { id: 4, title: "Stellar Drift", category: "Branding", image: "https://picsum.photos/seed/104/800/600" },
    { id: 5, title: "Echo Valley", category: "Web Design", image: "https://picsum.photos/seed/105/800/600" },
    { id: 6, title: "Nebula Core", category: "Development", image: "https://picsum.photos/seed/106/800/600" },
];

export default function PortfolioGrid() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const items = gsap.utils.toArray(".portfolio-item");

            gsap.from(items, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <div key={project.id} className="portfolio-item group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer transition-all duration-500">
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                            <h3 className="text-2xl font-bold text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{project.title}</h3>
                            <p className="text-purple-400 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{project.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
