"use client";

import { usePopup } from "@/hooks/usePopup";
import { buildPopupFromWork } from "@/lib/popupMappers";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/pagination";
import SectionTitle from "@/components/ui/SectionTitle";
import { useGSAPFade } from "@/hooks/useGSAPFade";

import { works } from "@/data/staticData";

export default function SelectedWorkSection() {
    const containerRef = useGSAPFade();
    const { openPopup } = usePopup();

    return (
        <div ref={containerRef} className="min-h-screen flex flex-col justify-center py-20 overflow-hidden">
            <SectionTitle title="Selected" highlight="Work" highlightColor="text-pink-500" />
            <div className="fade-up w-full max-w-[1400px] mx-auto px-4">
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    pagination={true}
                    modules={[EffectCoverflow, Pagination, Autoplay]}
                    className="w-full py-12"
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop={true}
                    speed={800}
                >
                    {works.map((work, index) => (
                        <SwiperSlide
                            key={index}
                            onClick={() => openPopup(buildPopupFromWork(work))}
                            className="!w-[300px] md:!w-[500px] !h-[400px] md:!h-[600px] rounded-2xl overflow-hidden transition-all duration-500 relative cursor-pointer group"
                        >
                            {/* Visual Strategy: Blurred Background to fill space + Contained Image to show full work */}

                            {/* 1. Blurred Background Layer - Fills the container */}
                            <div className="absolute inset-0 z-0 overflow-hidden">
                                <Image
                                    src={work.imageUrl}
                                    alt=""
                                    fill
                                    className="object-cover blur-xl scale-110 opacity-50"
                                    aria-hidden="true"
                                    sizes="(max-width: 768px) 100px, 200px" // Low res needed for blur
                                />
                                <div className="absolute inset-0 bg-black/20" /> {/* Slight tint */}
                            </div>

                            {/* 2. Main Image - Fully visible, no cropping */}
                            <div className="absolute inset-0 z-10 p-2 md:p-4 flex items-center justify-center">
                                <div className="relative w-full h-full shadow-2xl rounded-lg overflow-hidden">
                                    <Image
                                        src={work.imageUrl}
                                        alt={work.title}
                                        fill
                                        className="object-cover md:object-contain" // Cover on mobile for impact, contain on desktop for detail? Or consistent? Let's stick to contain for "no cropping" constraint.
                                        style={{ objectFit: "contain" }} // Enforce contain to prevent cropping
                                        sizes="(max-width: 768px) 600px, 1000px" // High res for main image
                                        quality={90}
                                        priority={index < 3} // Prioritize first few slides
                                    />
                                </div>
                            </div>

                            {/* 3. Text Overlay - Preserved */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none">
                                <h3 className="text-2xl font-bold text-white drop-shadow-md">{work.title}</h3>
                                <p className="text-gray-200 font-medium drop-shadow-sm">{work.subtitle}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
