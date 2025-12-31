import { projects } from "./projects";
import { clients as newClients } from "./clients";

export const works = projects.map(p => ({
    id: p.id,
    source: "work",
    title: p.title,
    subtitle: p.subtitle || "",
    description: p.description || "",
    imageUrl: p.coverImage || "/works/placeholder.webp",
    social: {
        behanceUrl: p.links?.behance || "#",
        instagramUrl: p.links?.instagram || "#",
        facebookUrl: p.links?.facebook || "#",
        twitterUrl: p.links?.twitter || "#"
    }
}));

export const clients = newClients.map(c => c.logo);
