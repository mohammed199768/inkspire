"use client";

import { useState, useRef, useEffect } from "react";
import { siteContent } from "@/data/siteContent";

export default function CreativeSlider() {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const handleWheel = (e: WheelEvent) => {
            const rect = section.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;

            if (!isInView) return;

            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;
            const isAtLastCard = activeIndex === siteContent.gallery.items.length - 1;
            const isAtFirstCard = activeIndex === 0;

            // Allow natural scroll to next section if at last card and scrolling down
            if (isScrollingDown && isAtLastCard) {
                return; // Don't prevent default, let it scroll to next section
            }

            // Allow natural scroll to previous section if at first card and scrolling up
            if (isScrollingUp && isAtFirstCard) {
                return; // Don't prevent default, let it scroll to previous section
            }

            // We're in the middle of cards, prevent default scroll and change cards
            e.preventDefault();

            // Clear previous timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Debounce the scroll to prevent too rapid changes
            scrollTimeoutRef.current = setTimeout(() => {
                if (isScrollingDown) {
                    // Scrolling down - next card
                    setActiveIndex((prev) =>
                        prev < siteContent.gallery.items.length - 1 ? prev + 1 : prev
                    );
                } else {
                    // Scrolling up - previous card
                    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
                }
            }, 50);
        };

        // Add wheel event listener with passive: false to allow preventDefault
        section.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            section.removeEventListener("wheel", handleWheel);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [activeIndex]); // Add activeIndex as dependency

    return (
        <section
            id="work"
            ref={sectionRef}
            className="relative py-20 px-6 md:px-12 overflow-hidden min-h-screen flex items-center"
        >
            <div className="max-w-7xl mx-auto w-full">
                {/* Section Title */}
                <div className="mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 relative inline-block">
                        Selected Works
                        <span className="absolute bottom-0 left-0 w-12 h-1 bg-inkspirePurple rounded-full" />
                    </h2>
                    <p className="text-white/60 text-lg mt-6">
                        A curated selection of our finest digital experiences.
                    </p>
                    <p className="text-white/40 text-sm mt-2">
                        Scroll to explore 👇
                    </p>
                </div>

                {/* Expandable Cards */}
                <div className="flex gap-4 justify-center items-center">
                    {siteContent.gallery.items.map((item, index) => (
                        <div
                            key={item.id}
                            onClick={() => setActiveIndex(index)}
                            className={`
                relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer interactive
                transition-all duration-700 ease-out
                ${activeIndex === index
                                    ? "w-[90vw] md:w-[600px] lg:w-[700px] shadow-2xl scale-105"
                                    : "w-[60vw] md:w-[280px] lg:w-[320px] opacity-70 hover:opacity-90"
                                }
                h-[450px] md:h-[500px]
              `}
                            style={{
                                backgroundImage: `url(${item.imageUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                            {/* Content */}
                            <div
                                className={`
                  absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10
                  transition-transform duration-700 ease-out
                  ${activeIndex === index
                                        ? "translate-y-0"
                                        : "translate-y-[calc(100%-80px)]"
                                    }
                `}
                            >
                                {/* Type Badge */}
                                <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-widest uppercase bg-inkspirePurple/80 backdrop-blur-sm rounded-full">
                                    {item.type}
                                </span>

                                {/* Title */}
                                <h3 className="text-3xl md:text-5xl font-bold mb-4">
                                    {item.title}
                                </h3>

                                {/* Description - Only visible when active */}
                                <p
                                    className={`
                    text-white/80 text-base md:text-lg leading-relaxed max-w-2xl
                    transition-all duration-700 delay-150
                    ${activeIndex === index
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-8"
                                        }
                  `}
                                >
                                    Experience the perfect blend of creativity and technology.
                                    This project showcases our commitment to delivering
                                    exceptional digital experiences that captivate and inspire.
                                </p>

                                {/* View Project Button - Only visible when active */}
                                <button
                                    className={`
                    mt-6 px-8 py-3 bg-white text-inkspirePurple font-semibold rounded-full
                    hover:bg-inkspirePurple hover:text-white
                    transition-all duration-300
                    ${activeIndex === index
                                            ? "opacity-100 translate-y-0 delay-200"
                                            : "opacity-0 translate-y-8 pointer-events-none"
                                        }
                  `}
                                >
                                    View Project →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Dots with Counter */}
                <div className="flex flex-col items-center gap-4 mt-12">
                    <div className="text-white/50 text-sm font-medium">
                        {activeIndex + 1} / {siteContent.gallery.items.length}
                    </div>
                    <div className="flex justify-center gap-2">
                        {siteContent.gallery.items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${activeIndex === index
                                        ? "w-8 bg-inkspirePurple"
                                        : "bg-white/30 hover:bg-white/50"
                                    }
                `}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
