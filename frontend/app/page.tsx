import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-bg-deep overflow-y-auto w-full max-w-full flex flex-col"
      id="page-landing"
    >
      <LandingNav />
      <Hero />
      <FeaturesGrid />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
