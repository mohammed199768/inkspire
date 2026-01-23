import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import localFont from "next/font/local";
import Script from "next/script";
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


const Cursor = dynamic(() => import("@/components/ui/Cursor"), { ssr: false });

export const metadata: Metadata = {
    metadataBase: new URL('https://inkspire.studio'),
    title: {
        default: "Inkspire Agency | Cinematic Digital Experiences",
        template: "%s | Inkspire Agency"
    },
    description: "We turn raw ideas into cinematic digital experiences. Expert web design, development, branding, and motion graphics in Amman, Jordan.",
    keywords: ["web design", "web development", "branding", "motion graphics", "digital agency", "creative studio", "Amman", "Jordan", "UI/UX design"],
    authors: [{ name: "Mohammad Aldomi" }],
    creator: "Inkspire Agency",
    publisher: "Inkspire Agency",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://inkspire.studio",
        title: "Inkspire Agency | Cinematic Digital Experiences",
        description: "We turn raw ideas into cinematic digital experiences. Expert web design, development, and branding.",
        siteName: "Inkspire Agency",
        images: [{
            url: "/logos/Inkspire logos/logo1.png",
            width: 1200,
            height: 630,
            alt: "Inkspire Agency"
        }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Inkspire Agency | Cinematic Digital Experiences",
        description: "We turn raw ideas into cinematic digital experiences.",
        images: ["/logos/Inkspire logos/logo1.png"],
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
                <link rel="icon" href="/logos/Inkspire logos/logo1.png" type="image/png" />
                <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
                {/* Google Tag Manager */}
                {/* STRICT VALIDATION: GTM ID must be present */}
                {(() => {
                    const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
                    if (!GTM_ID) {
                         // In production, this should ideally fail build, but at runtime it's a critical error for tracking.
                         // We throw to ensure visibility if this mandatory var is missing.
                         // (Only throws during rendering if missing)
                         if (process.env.NODE_ENV === 'production') {
                             throw new Error("CRITICAL: NEXT_PUBLIC_GTM_ID is missing. GTM cannot be initialized.");
                         }
                         console.error("WARNING: NEXT_PUBLIC_GTM_ID is missing.");
                    }
                    return null;
                })()}

                <Script id="gtm-script" strategy="beforeInteractive">
                    {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`}
                </Script>
            </head>
            <body className="antialiased overflow-x-hidden text-white selection:bg-inkspirePurple selection:text-white font-sans">
                {/* Google Tag Manager (noscript) */}
                <noscript>
                    <iframe
                        src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                    />
                </noscript>
                <Preloader />
                <SmoothScroll>
                    <PopupProvider>
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
