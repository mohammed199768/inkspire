export interface Project {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    logo: string | null;
    coverImage: string | null;
    gallery: string[] | null;
    clientName: string | null;
    year: string | null;
    services: string[] | null;
    tags: string[] | null;
    links: {
        website: string | null;
        behance: string | null;
        instagram: string | null;
        facebook?: string | null;
        twitter?: string | null;
    } | null;
}
