import CommitteeSection from "@/app/components/sections/CommitteeSection";
import ContactSection from "@/app/components/sections/ContactUs";
import DaleelBooks from "@/app/components/sections/DaleelBooks";
import DaleelSections from "@/app/components/sections/DaleelSections";
import EssentialBookCommittee from "@/app/components/sections/EssentialBookCommittee";
import FounderSection from "@/app/components/sections/FounderSection";
import Hero from "@/app/components/sections/Hero";
import MarqueeSection from "@/app/components/sections/Marquee";
import LatestNewsSection from "@/app/components/sections/News";
import ScientificCommittee from "@/app/components/sections/ScientificCommittee";
import TestimonialSection from "@/app/components/sections/TestimonialSection";
import React from "react";

const page = () => {
  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        <Hero />
        <MarqueeSection />
        <DaleelSections />
        <DaleelBooks />
        <FounderSection />
        <CommitteeSection />
        <EssentialBookCommittee />
        <ScientificCommittee />
        <LatestNewsSection />
        <TestimonialSection />
        <ContactSection />
      </div>
    </>
  );
};

export default page;
