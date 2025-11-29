"use client";

import { siteContent } from "@/data/siteContent";

export default function StoryScrollytelling() {
    return (
        <section id="story" className="relative z-10">
            {siteContent.storySections.map((section) => (
                <div
                    key={section.id}
                    className="scene min-h-screen flex items-center justify-center px-6 py-20 border-t border-white/5"
                >
                    <div className="scene-content max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="text-right md:text-left">
                            <span className="text-inkspirePurple text-8xl md:text-9xl font-black opacity-20 block mb-4">
                                {section.label}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                                {section.title}
                            </h2>
                            <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed">
                                {section.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}
