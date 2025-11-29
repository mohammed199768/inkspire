"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { particlesConfig } from "@/data/particlesConfig";

export default function BackgroundParticles() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    if (!init) return null;

    return (
        <div
            aria-hidden
            className="fixed inset-0 -z-10 pointer-events-none"
        >
            <Particles id="tsparticles" options={particlesConfig} />
        </div>
    );
}
