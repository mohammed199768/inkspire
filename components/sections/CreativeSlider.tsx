"use client";

import { siteContent } from "@/data/siteContent";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function CreativeSlider() {
    return (
        <section
            id="work"
            className="relative py-20 px-6 md:px-12 overflow-hidden min-h-screen flex flex-col justify-center"
        >
            <div className="max-w-7xl mx-auto w-full mb-12">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 relative inline-block">
                    Selected Works
                    <span className="absolute bottom-0 left-0 w-12 h-1 bg-inkspirePurple rounded-full" />
                </h2>
                <p className="text-white/60 text-lg mt-6 max-w-2xl">
                    A curated selection of our finest digital experiences. Swipe to explore our portfolio of award-winning projects.
                </p>
            </div>

            <div className="w-full max-w-[1600px] mx-auto relative px-4 md:px-12">
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                        slideShadows: true,
                    }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                    className="w-full py-12"
                >
                    {siteContent.gallery.items.map((item) => (
                        <SwiperSlide
                            key={item.id}
                            className="!w-[300px] md:!w-[600px] !h-[450px] md:!h-[600px] rounded-3xl overflow-hidden border border-white/10 bg-gray-900 shadow-2xl relative group"
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 300px, 600px"
                                // Optimization: Only priority the first image if loop wasn't issue, 
                                // but with Swiper loop, simpler to lazy load (default).
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase bg-inkspirePurple text-white rounded-full">
                                    {item.type}
                                </span>
                                <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-gray-300 mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                                    Experience the perfect blend of creativity and technology. This project showcases our commitment to excellence.
                                </p>
                                <button className="flex items-center gap-2 text-white font-semibold group/btn">
                                    View Project
                                    <span className="bg-white text-black rounded-full p-1 transition-transform duration-300 group-hover/btn:translate-x-2">
                                        <ArrowRight size={16} />
                                    </span>
                                </button>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Buttons */}
                <button aria-label="Previous Slide" className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-inkspirePurple hover:border-inkspirePurple transition-all duration-300 interactive">
                    <ArrowLeft size={24} />
                </button>
                <button aria-label="Next Slide" className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-inkspirePurple hover:border-inkspirePurple transition-all duration-300 interactive">
                    <ArrowRight size={24} />
                </button>
            </div>

            <style jsx global>{`
                .swiper-pagination-bullet {
                    background: rgba(255, 255, 255, 0.5);
                    opacity: 1;
                }
                .swiper-pagination-bullet-active {
                    background: #8b5cf6;
                    width: 24px;
                    border-radius: 4px;
                }
            `}</style>
        </section>
    );
}
