"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadImageShape } from "@tsparticles/shape-image";
import { particlesConfig } from "@/data/particlesConfig";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

export default function BackgroundParticles() {
    const isTouch = useIsTouchDevice();
    const [init, setInit] = useState(false);

    useEffect(() => {
        if (init || isTouch !== false) return;

        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
            await loadImageShape(engine);
        }).then(() => {
            setInit(true);
        });
    }, [init, isTouch]);

    if (!init || isTouch) return null;

    return (
        <div
            aria-hidden
            className="fixed inset-0 -z-10 pointer-events-none"
        >
            <Particles id="tsparticles" options={particlesConfig} />
        </div>
    );
}
