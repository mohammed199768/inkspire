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

export function buildPopupFromWork(item: { src: string; alt?: string, category?: string }): PopupPayload {
    return {
        id: `work-${item.src}`,
        source: "work",
        title: item.alt || "Featured Project",
        subtitle: item.category || "Portfolio",
        imageUrl: item.src,
        description: "A closer look at this featured project. We focused on delivering a high-impact visual experience.",
    };
}
