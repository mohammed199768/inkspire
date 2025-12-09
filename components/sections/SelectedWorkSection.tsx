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
                            className="!w-[300px] md:!w-[500px] !h-[400px] md:!h-[600px] rounded-2xl overflow-hidden transition-all duration-500 relative cursor-pointer"
                        >
                            <Image
                                src={work.imageUrl}
                                alt={work.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 300px, 500px"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent z-10">
                                <h3 className="text-2xl font-bold">{work.title}</h3>
                                <p className="text-gray-300">{work.subtitle}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
