export type PopupSource = "client" | "service" | "team" | "work" | "testimonial";

export interface PopupSocialLinks {
    facebookUrl?: string;
    instagramUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    behanceUrl?: string;
}

export interface PopupPayload {
    id: string; // Unique ID for keying/animations if needed
    source: PopupSource;
    title: string;
    subtitle?: string; // Role, Company, or Service Category
    description?: string;
    imageUrl?: string;
    projectSlug?: string;
    social?: PopupSocialLinks;
    // Optional extra fields for specific rendering logic
    date?: string;
    tags?: string[];
}
