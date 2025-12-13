"use client";

import { usePopup } from "@/hooks/usePopup";
import { buildPopupFromWork } from "@/lib/popupMappers";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCreative, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
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
            <div className="fade-up w-full max-w-[1600px] mx-auto px-4 h-[600px] md:h-[800px] flex items-center">
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
                    {works.map((work, index) => (
                        <SwiperSlide
                            key={index}
                            onClick={() => openPopup(buildPopupFromWork(work))}
                            className="!w-[85vw] md:!w-[1100px] !h-[50vh] md:!h-[650px] relative cursor-pointer"
                        >
                            {/* Floating Plane Wrapper */}
                            <div className="selectedwork-plane w-full h-full relative">
                                <Image
                                    src={work.imageUrl}
                                    alt={work.title}
                                    fill
                                    className="object-cover rounded-md" // Subtle rounding for aesthetics, optional per user 'no hard card look'
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
    );
}
