"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCreative, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import SectionTitle from "@/components/ui/SectionTitle";
import { useGSAPFade } from "@/hooks/useGSAPFade";
import { usePopup } from "@/hooks/usePopup";
import { buildPopupFromProject } from "@/lib/popupMappers";

import { projects } from "@/data/projects";

export default function SelectedWorkSection() {
    const containerRef = useGSAPFade();
    const { openPopup } = usePopup();

    // Use a subset of projects for Selected Work
    const selectedWorks = projects.slice(0, 6);

    return (
        <section 
            ref={containerRef} 
            className="h-[100dvh] w-full flex flex-col relative isolate overflow-hidden bg-transparent"
        >
            {/* 1. Title Rail - High priority visibility */}
            <div className="relative z-50 pt-16 md:pt-24 pb-4 md:pb-6 isolate flex-shrink-0 pointer-events-none">
                <SectionTitle 
                    title="Selected" 
                    highlight="Work" 
                    highlightColor="text-pink-500" 
                    className="!mb-0"
                />
            </div>

            {/* 2. Slider Rail - Flexes to fill remaining height */}
            <div className="flex-grow w-full max-w-[1700px] mx-auto px-4 flex items-center justify-center overflow-visible pb-12 md:pb-20">
                <div className="w-full h-full max-h-[500px] md:max-h-[700px] flex items-center">
                    <Swiper
                        effect={'creative'}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        creativeEffect={{
                            perspective: true,
                            limitProgress: 2,
                            prev: {
                                translate: ['-90%', 0, -400],
                                rotate: [0, 0, -5],
                                opacity: 0.6,
                                scale: 0.85,
                            },
                            next: {
                                translate: ['90%', 0, -400],
                                rotate: [0, 0, 5],
                                opacity: 0.6,
                                scale: 0.85,
                            },
                            shadowPerProgress: false
                        }}
                        pagination={true}
                        modules={[EffectCreative, Pagination, Autoplay]}
                        className="w-full h-full !overflow-visible"
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop={true}
                        speed={1000}
                    >
                        {selectedWorks.map((work, index) => (
                            <SwiperSlide
                                key={index}
                                onClick={() => openPopup(buildPopupFromProject(work))}
                                className="!w-[85vw] md:!w-[1100px] !h-full relative cursor-pointer"
                            >
                                {/* Floating Plane Wrapper */}
                                <div className="selectedwork-plane w-full h-full relative">
                                    <Image
                                        src={work.coverImage || "/works/placeholder.webp"}
                                        alt={work.title}
                                        fill
                                        className="object-cover rounded-md"
                                        sizes="(max-width: 768px) 90vw, 1200px"
                                        quality={95}
                                        priority={index < 3}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
