/**
 * UNIFIED STORY DATA LAYER
 * All cinematic moments are now unified into a single master narrative.
 */

export interface StoryMoment {
    type: "image" | "video";
    src: string;
    tag: string;
}

export interface Story {
    id: string;
    name: string;
    sub: string;
    avatar: string;
    projectSlug: string | null;
    stories: StoryMoment[];
}

// Internal Master Narrative Structure (Semantic organization)
const MASTER_ODYSSEY_MOMENTS: StoryMoment[] = [
    // --- CHAPTER 1: BRAND IDENTITY ---
    { type: "image", src: "/reels/3.webp", tag: "Brand Identity // Creative Direction" },
    { type: "image", src: "/reels/4.webp", tag: "Brand Identity // Visual Language" },

    // --- CHAPTER 2: WEB EXPERIENCE ---
    { type: "image", src: "/reels/5.webp", tag: "Web Experience // Modern UI/UX" },
    { type: "image", src: "/reels/6.webp", tag: "Web Experience // Interactive Motion" },

    // --- CHAPTER 3: CLIENT SUCCESS ---
    { type: "image", src: "/reels/7.webp", tag: "Client Success // Strategic Growth" },
    { type: "image", src: "/reels/8.webp", tag: "Client Success // Digital Transformation" },

    // --- CHAPTER 4: AGENCY LIFE ---
    { type: "image", src: "/reels/9.webp", tag: "Agency Life // Our Studio" },
    { type: "image", src: "/reels/10.webp", tag: "Agency Life // Team Synergy" },

    // --- CHAPTER 5: LATEST WORK ---
    { type: "image", src: "/reels/11.webp", tag: "Latest Work // Modern Aesthetics" },
    { type: "image", src: "/reels/12.webp", tag: "Latest Work // Final Masterpiece" },
];

/**
 * EXPORTED HIGHLIGHTS
 * Optimized for UI rendering: Containing exactly ONE master story.
 * This naturally triggers the UI to show a single prominent story bubble.
 */
export const HIGHLIGHTS: Story[] = [
    {
        id: "inkspire-master-story",
        name: "Inkspire Stories",
        sub: "The Full Odyssey",
        avatar: "/reels/3.webp",
        projectSlug: null,
        stories: MASTER_ODYSSEY_MOMENTS
    }
];

// Semantic Source of Truth
export const INKSPIRE_STORY = {
    id: "inkspire-odyssey",
    title: "Inkspire Stories",
    chapters: MASTER_ODYSSEY_MOMENTS
};
