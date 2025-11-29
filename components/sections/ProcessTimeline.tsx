"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteContent } from "@/data/siteContent";

export default function ProcessTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const steps = containerRef.current?.querySelectorAll(".process-step");

        steps?.forEach((step) => {
            gsap.fromTo(
                step,
                { opacity: 0, x: -50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: step,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        });
    }, []);

    return (
        <section id="process" className="py-24 px-6 md:px-12 relative z-10">
            <div className="max-w-5xl mx-auto" ref={containerRef}>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-20 text-center">
                    Our Process
                </h2>

                <div className="relative border-l border-white/10 ml-4 md:ml-0 md:pl-0 space-y-16">
                    {siteContent.process.steps.map((step) => (
                        <div
                            key={step.id}
                            className="process-step relative pl-12 md:pl-24"
                        >
                            <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-inkspirePurple shadow-[0_0_10px_#6b4092]" />

                            <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8">
                                <span className="text-6xl md:text-8xl font-black text-white/5">
                                    {step.id}
                                </span>
                                <div>
                                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
                                        {step.title}
                                    </h3>
                                    <p className="text-lg text-white/60 font-light max-w-xl">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
