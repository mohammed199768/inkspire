export interface Story {
    id: string;
    name: string;
    sub: string;
    avatar: string;
    projectSlug: string | null;
    stories: {
        type: "image" | "video";
        src: string;
        tag: string;
    }[];
}

export const HIGHLIGHTS: Story[] = [
    {
        id: "h1",
        name: "Brand Identity",
        sub: "Inkspire • Studio",
        avatar: "/reels/3.webp",
        projectSlug: "neon-cybernetic",
        stories: [
            { type: "image", src: "/reels/3.webp", tag: "Creative Direction" },
            { type: "image", src: "/reels/4.webp", tag: "Visual Language" },
        ]
    },
    {
        id: "h2",
        name: "Web Experience",
        sub: "Amman • Jordan",
        avatar: "/reels/5.webp",
        projectSlug: "abstract-flow",
        stories: [
            { type: "image", src: "/reels/5.webp", tag: "Modern UI/UX" },
            { type: "image", src: "/reels/6.webp", tag: "Interactive Motion" },
        ]
    },
    {
        id: "h3",
        name: "Client Success",
        sub: "Global Projects",
        avatar: "/reels/7.webp",
        projectSlug: null,
        stories: [
            { type: "image", src: "/reels/7.webp", tag: "Strategic Growth" },
            { type: "image", src: "/reels/8.webp", tag: "Digital Transformation" },
        ]
    },
    {
        id: "h4",
        name: "Agency Life",
        sub: "Inkspire Team",
        avatar: "/reels/9.webp",
        projectSlug: null,
        stories: [
            { type: "image", src: "/reels/9.webp", tag: "Our Studio" },
            { type: "image", src: "/reels/10.webp", tag: "Team Synergy" },
        ]
    },
    {
        id: "h5",
        name: "Latest Work",
        sub: "December 2025",
        avatar: "/reels/11.webp",
        projectSlug: "urban-glitch",
        stories: [
            { type: "image", src: "/reels/11.webp", tag: "Modern Aesthetics" },
            { type: "image", src: "/reels/12.webp", tag: "Final Masterpiece" },
        ]
    }
];
