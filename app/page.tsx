import HeroScene from "@/components/hero/HeroScene";
import CinematicWrapper from "@/components/layout/CinematicWrapper";
import dynamic from "next/dynamic";

// Static imports for improved LCP and reduced layout shift for top sections
import StatsSection from "@/components/sections/StatsSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";

// Dynamically import below-the-fold sections to drastically reduce initial JS bundle size.
const SelectedWorkSection = dynamic(() => import("@/components/sections/SelectedWorkSection"));
const TeamSection = dynamic(() => import("@/components/sections/TeamSection"));
const ClientsMarquee = dynamic(() => import("@/components/sections/ClientsMarquee"));
const TestimonialsSection = dynamic(() => import("@/components/sections/TestimonialsSection"));

const ProcessTimeline = dynamic(() => import("@/components/sections/ProcessTimeline"));
const FinalCTA = dynamic(() => import("@/components/sections/FinalCTA"));

export default function Home() {
    return (
        <main className="flex flex-col w-full">
            {/* Critical LCP Section - Rendered immediately */}
            <HeroScene />

            {/* Client-side Cinematic Transitions Wrapper for subsequent sections */}
            <CinematicWrapper>
                <div className="cinematic-section">
                    <StatsSection />
                </div>

                <div className="cinematic-section">
                    <AboutSection />
                </div>

                <div className="cinematic-section">
                    <ServicesSection />
                </div>

                <div className="cinematic-section">
                    <SelectedWorkSection />
                </div>

                <div className="cinematic-section">
                    <TeamSection />
                </div>

                <div className="cinematic-section">
                    <ClientsMarquee />
                </div>

                <div className="cinematic-section">
                    <TestimonialsSection />
                </div>


                {/* <div className="cinematic-section">
                    <ProcessTimeline />
                </div> */}
                <div className="cinematic-section">
                    <FinalCTA />
                </div>
            </CinematicWrapper>
        </main>
    );
}
