import type { ISourceOptions } from "@tsparticles/engine";

export const particlesConfig: ISourceOptions = {
    background: {
        color: "transparent",
    },
    fullScreen: {
        enable: false,
    },
    fpsLimit: 60,
    particles: {
        number: {
            value: 40,
            density: {
                enable: true,
                width: 1000,
            },
        },
        color: {
            value: ["#6b4092", "#f2e9ff"],
        },
        shape: {
            type: "circle",
        },
        opacity: {
            value: { min: 0.3, max: 0.6 },
            animation: {
                enable: true,
                speed: 0.5,
                sync: false,
            },
        },
        size: {
            value: { min: 4, max: 12 },
            animation: {
                enable: true,
                speed: 2,
                sync: false,
            },
        },
        links: {
            enable: false,
        },
        move: {
            enable: true,
            speed: 1,
            direction: "top",
            random: true,
            straight: false,
            outModes: {
                default: "out",
                top: "destroy",
                bottom: "none",
            },
            attract: {
                enable: false,
            },
        },
        life: {
            duration: {
                sync: false,
                value: 15,
            },
            count: 0,
            delay: {
                random: {
                    enable: true,
                    min: 0.5,
                },
                value: 1,
            },
        },
    },
    interactivity: {
        events: {
            onHover: {
                enable: true,
                mode: "bubble",
            },
            onClick: {
                enable: true,
                mode: "repulse",
            },
            resize: {
                enable: true,
                delay: 0.5,
            },
        },
        modes: {
            bubble: {
                distance: 200,
                duration: 2,
                opacity: 0.8,
                size: 15,
            },
            repulse: {
                distance: 100,
                duration: 0.4,
            },
        },
    },
    detectRetina: true,
};
