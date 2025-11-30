"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards, EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Star, CheckCircle, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
    { title: "Brand Identity", desc: "Forging memorable brands that stand the test of time." },
    { title: "Web Development", desc: "Building high-performance, scalable digital solutions." },
    { title: "Motion Graphics", desc: "Bringing static stories to life with fluid animation." },
    { title: "Digital Marketing", desc: "Strategic campaigns that drive real growth." },
];

const team = [
    {
        name: "Mohammad Aldomi",
        role: "Full-stack Developer",
        image: "https://api.dicebear.com/9.x/adventurer/svg?seed=MohammadAldomi"
    },
    {
        name: "Sultan",
        role: "Creative Director",
        image: "https://api.dicebear.com/9.x/adventurer/svg?seed=SultanCreative"
    },
    {
        name: "Mahmoud",
        role: "Graphic Designer",
        image: "https://api.dicebear.com/9.x/adventurer/svg?seed=MahmoudDesigner"
    },
];

const clients = [
    "Padel Me Club", "Quattro Village", "Jordan Pioneers", "Slate Film Services", "Jaljal Contracting", "Bibars Stores", "Al Ghaf Catering", "Avant Clinics", "HAMC Medical Complex", "U Medical Clinic", "Curevie", "Bituti Restaurant", "Yalla Mansaf", "Dimois Training Institute"
];
const reviews = [
    { name: "Sarah J.", text: "Inkspire transformed our brand completely. The attention to detail is unmatched.", company: "TechFlow" },
    { name: "David M.", text: "The best creative team we've ever worked with. Simply stunning results.", company: "Apex Corp" },
    { name: "Emily R.", text: "Professional, innovative, and incredibly talented. Highly recommended.", company: "Lumina" },
];

const AnimatedCounter = ({ value, label }: { value: string, label: string }) => {
    const countRef = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const numValue = parseInt(value.replace(/\D/g, ''));
    const suffix = value.replace(/[0-9]/g, '');

    useEffect(() => {
        const el = countRef.current;
        const container = containerRef.current;
        if (!el || !container) return;

        // Start at 0
        el.innerText = "0" + suffix;

        const ctx = gsap.context(() => {
            // Entrance animation for the container
            gsap.from(container, {
                scrollTrigger: {
                    trigger: container,
                    start: "top 85%",
                    once: true
                },
                y: 50,
                opacity: 0,
                scale: 0.9,
                duration: 0.8,
                ease: "back.out(1.7)"
            });

            // Number counting animation
            const proxy = { val: 0 };

            gsap.to(proxy, {
                val: numValue,
                duration: 2.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: container,
                    start: "top 85%",
                    once: true,
                },
                onUpdate: () => {
                    el.innerText = Math.ceil(proxy.val) + suffix;
                }
            });
        }, container);

        return () => ctx.revert();
    }, [value, numValue, suffix]);

    return (
        <div ref={containerRef} className="counter-item p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:scale-105 hover:border-purple-500/30 transition-all duration-300 cursor-default group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 ref={countRef} className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2 relative z-10">
                0{suffix}
            </h3>
            <p className="text-gray-400 uppercase tracking-widest text-sm font-semibold relative z-10 group-hover:text-white transition-colors">{label}</p>
        </div>
    );
};

export default function StoryScrollytelling() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate each element individually for better reliability
            const fadeElements = gsap.utils.toArray(".fade-up");

            fadeElements.forEach((el: any, index) => {
                gsap.fromTo(el,
                    {
                        opacity: 0,
                        y: 30  // Reduced from 50 for subtler effect
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6, // Faster animation
                        ease: "power2.out", // Lighter ease
                        scrollTrigger: {
                            trigger: el,
                            start: "top 90%", // Trigger earlier
                            once: true,
                            toggleActions: "play none none none"
                        },
                        delay: (index % 4) * 0.05 // Subtle stagger within groups
                    }
                );
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative z-10 text-white overflow-hidden">

            {/* COUNTERS SECTION */}
            <div className="min-h-[50vh] flex items-center justify-center py-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center w-full max-w-6xl px-6">
                    {[
                        { val: "150+", label: "Projects" },
                        { val: "50+", label: "Clients" },
                        { val: "10+", label: "Awards" },
                        { val: "5", label: "Years" }
                    ].map((item, i) => (
                        <AnimatedCounter key={i} value={item.val} label={item.label} />
                    ))}
                </div>
            </div>

            {/* ABOUT US SECTION */}
            <div className="min-h-screen flex items-center py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="fade-up">
                        <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                            We Craft <span className="text-purple-500">Digital</span> <br /> Masterpieces.
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            At Inkspire, we don't just build websites; we create immersive digital experiences that tell your story.
                            Our passion lies in the intersection of design, technology, and emotion.
                        </p>
                        <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300 flex items-center gap-2">
                            Learn More <ArrowRight size={20} />
                        </button>
                    </div>
                    <div className="fade-up relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-900/20 aspect-video">
                        <iframe
                            className="w-full h-full object-cover"
                            src=""
                            title="Inkspire Studio Showreel"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* SERVICES SECTION */}
            <div className="min-h-screen flex flex-col justify-center py-20 px-6 bg-gradient-to-b from-transparent to-black/20">
                <div className="max-w-7xl mx-auto w-full">
                    <h2 className="fade-up text-4xl md:text-6xl font-bold mb-16 text-center">Our <span className="text-purple-400">Intelligent</span> Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, i) => (
                            <div key={i} className="fade-up group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <CheckCircle className="text-purple-400" size={24} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                                    <p className="text-gray-400 group-hover:text-gray-200 transition-colors">{service.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* OUR WORK SECTION */}
            <div className="min-h-screen flex flex-col justify-center py-20 overflow-hidden">
                <h2 className="fade-up text-4xl md:text-6xl font-bold mb-12 text-center">Selected <span className="text-pink-500">Work</span></h2>
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
                        {[1, 2, 3, 4, 5].map((num) => (
                            <SwiperSlide key={num} className="!w-[300px] md:!w-[500px] !h-[400px] md:!h-[600px] rounded-2xl overflow-hidden border border-white/20 bg-gray-900">
                                <img
                                    src={`https://picsum.photos/seed/${num + 10}/800/1000`}
                                    alt={`Work ${num}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
                                    <h3 className="text-2xl font-bold">Project {num}</h3>
                                    <p className="text-gray-300">Design & Development</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* OUR TEAM SECTION */}
            <div className="min-h-screen flex flex-col justify-center py-20 px-6">
                <h2 className="fade-up text-4xl md:text-6xl font-bold mb-16 text-center">Meet The <span className="text-blue-400">Team</span></h2>
                <div className="flex flex-wrap justify-center gap-10 max-w-7xl mx-auto">
                    {team.map((member, i) => (
                        <div key={i} className="fade-up group relative w-full md:w-[350px] h-[500px] rounded-3xl overflow-hidden transition-all duration-500 opacity-50 hover:opacity-100 hover:scale-105 cursor-pointer border border-white/10">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-3xl font-bold text-white mb-1">{member.name}</h3>
                                <p className="text-purple-400 font-medium tracking-wide">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* OUR CLIENTS SECTION */}
            <div className="py-20 bg-white/5 backdrop-blur-sm border-y border-white/10">
                <div className="max-w-[100vw] overflow-hidden">
                    <div className="flex gap-16 animate-marquee whitespace-nowrap">
                        {[...clients, ...clients].map((client, i) => ( // Reduced duplication for performance
                            <div key={i} className="flex items-center gap-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
                                <span className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 uppercase">
                                    {client}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* REVIEWS SECTION */}
            <div className="min-h-[80vh] flex flex-col justify-center py-20 px-6">
                <h2 className="fade-up text-4xl md:text-6xl font-bold mb-16 text-center">Client <span className="text-yellow-400">Stories</span></h2>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <div key={i} className="fade-up p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 relative">
                            <div className="flex gap-1 mb-6 text-yellow-400">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                            </div>
                            <p className="text-lg text-gray-300 mb-8 leading-relaxed">"{review.text}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xl">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold">{review.name}</h4>
                                    <p className="text-sm text-gray-500">{review.company}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite; /* Slower for smoother performance */
                    will-change: transform;
                }
            `}</style>
        </section>
    );
}
