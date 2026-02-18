import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <LandingNavbar />
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
