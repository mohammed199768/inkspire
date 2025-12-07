"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { siteContent } from "@/data/siteContent";

export default function NavbarFullMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll when menu is open
            document.body.style.overflow = "hidden";

            gsap.to(menuRef.current, {
                opacity: 1,
                pointerEvents: "all",
                duration: 0.5,
                ease: "power2.out",
            });

            const links = linksRef.current?.children;
            if (links) {
                gsap.fromTo(
                    links,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        stagger: 0.1,
                        delay: 0.2,
                        ease: "power2.out",
                    }
                );
            }
        } else {
            // Re-enable body scroll when menu closes
            document.body.style.overflow = "";

            gsap.to(menuRef.current, {
                opacity: 0,
                pointerEvents: "none",
                duration: 0.5,
                ease: "power2.in",
            });
        }
    }, [isOpen]);

    const handleLinkClick = (href: string) => {
        setIsOpen(false);

        // Smooth scroll to section if it's an anchor link
        if (href.includes("#")) {
            const targetId = href.split("#")[1];
            setTimeout(() => {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 500); // Wait for menu close animation
        }
    };

    return (
        <>
            {/* Top Navbar - Always visible */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm" />

                <Link
                    href="/"
                    className="relative z-10 interactive hover:brightness-125 transition-all"
                >
                    <Image
                        src="/logos/Inkspire logos/Untitled-2-03.webp"
                        alt="Inkspire"
                        width={180}
                        height={60}
                        className="w-auto h-10 md:h-14 object-contain"
                    />
                </Link>

                <button
                    onClick={() => setIsOpen(true)}
                    className="relative z-10 text-sm font-medium uppercase tracking-widest text-white hover:text-inkspirePurple transition-all interactive"
                >
                    Menu
                </button>
            </nav>

            {/* Fullscreen Menu Overlay */}
            <div
                ref={menuRef}
                className="fixed inset-0 z-[100] bg-gradient-to-br from-inkspirePurple to-inkspireIndigo opacity-0 pointer-events-none flex flex-col items-center justify-center"
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 text-white text-sm font-medium uppercase tracking-widest hover:scale-110 transition-all interactive group"
                >
                    <span className="mr-2">✕</span>
                    Close
                </button>

                {/* Menu Links */}
                <div ref={linksRef} className="flex flex-col items-center gap-6 md:gap-8">
                    {siteContent.navigation.menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => handleLinkClick(item.href)}
                            className="text-5xl md:text-7xl font-bold text-white hover:text-white/70 transition-all interactive relative group"
                        >
                            {item.label}
                            <span className="absolute -bottom-2 left-0 w-0 h-1 bg-white group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}
                </div>

                {/* Footer text */}
                <div className="absolute bottom-6 text-white/50 text-sm">
                    {siteContent.global.footerText}
                </div>
            </div>
        </>
    );
}
