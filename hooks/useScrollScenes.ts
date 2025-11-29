"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useScrollScenes() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const scenes = document.querySelectorAll(".scene");

        scenes.forEach((scene) => {
            const content = scene.querySelector(".scene-content");
            if (content) {
                gsap.fromTo(
                    content,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: scene,
                            start: "top 60%",
                            end: "bottom 20%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);
}
