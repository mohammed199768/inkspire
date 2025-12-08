import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import localFont from "next/font/local";
import "./globals.css";
import { siteContent } from '@/data/siteContent';
import NavbarFullMenu from "@/components/layout/NavbarFullMenu";
import MotionLayout from "@/components/layout/MotionLayout";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Preloader from "@/components/ui/Preloader";
import { PopupProvider } from "@/hooks/usePopup";
import InsightPopup from "@/components/popup/InsightPopup";

// Optimized Font Loading with next/font/local
const inter = localFont({
    src: "./fonts/InterVariable.woff2",
    variable: "--font-inter",
    display: "swap",
    weight: "100 900",
});

const outfit = localFont({
    src: [
        { path: "./fonts/Outfit-Regular.ttf", weight: "400", style: "normal" },
        { path: "./fonts/Outfit-Bold.ttf", weight: "700", style: "normal" },
    ],
    variable: "--font-outfit",
    display: "swap",
});

const ibrand = localFont({
    src: "./fonts/ibrand.otf",
    variable: "--font-ibrand",
    display: "swap",
});

// Lazy load heavy visual effects
const FloatingVectorParticles = dynamic(() => import("@/components/ui/FloatingVectorParticles"), { ssr: false });
const BackgroundParticles = dynamic(() => import("@/components/ui/BackgroundParticles"), { ssr: false });
const BlobBackground = dynamic(() => import("@/components/ui/BlobBackground"), { ssr: false });
const Cursor = dynamic(() => import("@/components/ui/Cursor"), { ssr: false });

export const metadata: Metadata = {
    metadataBase: new URL('https://inkspire.studio'),
    title: {
        default: "Inkspire Studio | Cinematic Digital Experiences",
        template: "%s | Inkspire Studio"
    },
    description: "We turn raw ideas into cinematic digital experiences. Expert web design, development, branding, and motion graphics in Amman, Jordan.",
    keywords: ["web design", "web development", "branding", "motion graphics", "digital agency", "creative studio", "Amman", "Jordan", "UI/UX design"],
    authors: [{ name: "Mohammad Aldomi" }],
    creator: "Inkspire Studio",
    publisher: "Inkspire Studio",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://inkspire.studio",
        title: "Inkspire Studio | Cinematic Digital Experiences",
        description: "We turn raw ideas into cinematic digital experiences. Expert web design, development, and branding.",
        siteName: "Inkspire Studio",
        images: [{
            url: "/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "Inkspire Studio"
        }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Inkspire Studio | Cinematic Digital Experiences",
        description: "We turn raw ideas into cinematic digital experiences.",
        images: ["/og-image.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export const viewport: Viewport = {
    themeColor: '#000000',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable} ${ibrand.variable}`}>
            <head>
                <link rel="icon" href="/logos/Inkspire logos/Untitled-2-01.png" type="image/png" />
                <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
            </head>
            <body className="antialiased overflow-x-hidden bg-black text-white selection:bg-inkspirePurple selection:text-white font-sans">
                <Preloader />
                <SmoothScroll>
                    <PopupProvider>
                        <BackgroundParticles />
                        <BlobBackground />
                        <FloatingVectorParticles />
                        <Cursor />
                        <NavbarFullMenu />
                        <MotionLayout>
                            {children}
                        </MotionLayout>
                        <InsightPopup />
                    </PopupProvider>
                </SmoothScroll>
            </body>
        </html>
    );
}
