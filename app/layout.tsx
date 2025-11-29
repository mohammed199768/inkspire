import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import BackgroundParticles from "@/components/ui/BackgroundParticles";
import Cursor from "@/components/ui/Cursor";
import NavbarFullMenu from "@/components/layout/NavbarFullMenu";
import MotionLayout from "@/components/layout/MotionLayout";
import SmoothScroll from "@/components/layout/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: "Inkspire Studio | Cinematic Digital Experiences",
    description: "We turn raw ideas into cinematic digital experiences.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className="antialiased overflow-x-hidden bg-black text-white selection:bg-inkspirePurple selection:text-white">
                <SmoothScroll>
                    <BackgroundParticles />
                    <Cursor />
                    <NavbarFullMenu />
                    <MotionLayout>
                        {children}
                    </MotionLayout>
                </SmoothScroll>
            </body>
        </html>
    );
}
