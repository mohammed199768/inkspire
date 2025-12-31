import { PopupPayload, PopupSocialLinks } from "@/types/popup";

interface Service {
    icon: string;
    title: string;
    desc: string;
    social?: PopupSocialLinks;
}

interface TeamMember {
    name: string;
    role: string;
    image: string;
    social?: PopupSocialLinks;
    bio?: string;
}

interface Client {
    path: string;
}

interface Review {
    name: string;
    text: string;
    company: string;
    image?: string;
    social?: PopupSocialLinks;
}

export function buildPopupFromService(service: Service): PopupPayload {
    return {
        id: `service-${service.title}`,
        source: "service",
        title: service.title,
        subtitle: "Key Service",
        description: service.desc,
        social: service.social,
    };
}

export function buildPopupFromTeamMember(member: TeamMember): PopupPayload {
    return {
        id: `team-${member.name}`,
        source: "team",
        title: member.name,
        subtitle: member.role,
        description: member.bio || `${member.name} is a key part of our team, contributing as a ${member.role}.`,
        imageUrl: member.image,
        social: member.social,
    };
}

export function buildPopupFromClient(clientPath: string, index: number): PopupPayload {
    const nameMatch = clientPath.match(/\/([^/]+)\.webp$/);
    const clientName = nameMatch ? nameMatch[1].replace(/%20/g, " ") : "Partner";

    return {
        id: `client-${index}`,
        source: "client",
        title: "Strategic Partner",
        subtitle: clientName,
        imageUrl: clientPath,
        description: "We are proud to have collaborated with this amazing partner to deliver exceptional results.",
    };
}

export function buildPopupFromReview(review: Review): PopupPayload {
    return {
        id: `review-${review.name}`,
        source: "testimonial",
        title: review.name,
        subtitle: review.company,
        description: `"${review.text}"`,
        imageUrl: review.image,
        social: review.social,
    };
}

import { Project } from "@/types/project";

export function buildPopupFromProject(project: Project): PopupPayload {
    return {
        id: project.id,
        source: "work",
        title: project.title,
        subtitle: project.subtitle || "Project",
        description: project.description || "A closer look at this featured project.",
        imageUrl: project.coverImage || "/works/placeholder.webp",
        projectSlug: project.slug,
        social: project.links ? {
            behanceUrl: project.links.behance || undefined,
            instagramUrl: project.links.instagram || undefined,
            facebookUrl: project.links.facebook || undefined,
            twitterUrl: project.links.twitter || undefined,
        } : undefined
    };
}

export function buildPopupFromWork(item: any): PopupPayload {
    return {
        id: item.id || `work-${item.imageUrl}`,
        source: "work",
        title: item.title || "Featured Project",
        subtitle: item.subtitle || "Portfolio",
        imageUrl: item.imageUrl || item.src,
        description: item.description || "A closer look at this featured project.",
        projectSlug: item.slug,
        social: item.social,
    };
}
