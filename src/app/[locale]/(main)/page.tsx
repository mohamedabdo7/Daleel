"use client";

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
import { api } from "@/lib/api/client";
import React, { useEffect, useState } from "react";

// Type definitions based on your API response
interface ScientificCommitteeMember {
  name: string;
  image: string;
  desc: string;
}

interface ScientificCommitteeData {
  name: string;
  data: ScientificCommitteeMember[];
}

interface ApiResponse {
  data: {
    scientific_committee: ScientificCommitteeData[];
    // Add other section types here as you implement them
    // founder_section?: any[];
    // daleel_books?: any[];
    // testimonials?: any[];
    // etc...
  };
}

const Page = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.fetch<ApiResponse>("/user/home_pluck_apis"); // Adjust endpoint
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Hero />
      <MarqueeSection />
      <DaleelSections />
      <DaleelBooks />
      <FounderSection />
      <CommitteeSection />
      <EssentialBookCommittee />
      <ScientificCommittee
        scientificCommittee={data?.data?.scientific_committee || []}
      />
      <LatestNewsSection />
      <TestimonialSection />
      <ContactSection />
    </div>
  );
};

export default Page;

// import CommitteeSection from "@/app/components/sections/CommitteeSection";
// import ContactSection from "@/app/components/sections/ContactUs";
// import DaleelBooks from "@/app/components/sections/DaleelBooks";
// import DaleelSections from "@/app/components/sections/DaleelSections";
// import EssentialBookCommittee from "@/app/components/sections/EssentialBookCommittee";
// import FounderSection from "@/app/components/sections/FounderSection";
// import Hero from "@/app/components/sections/Hero";
// import MarqueeSection from "@/app/components/sections/Marquee";
// import LatestNewsSection from "@/app/components/sections/News";
// import ScientificCommittee from "@/app/components/sections/ScientificCommittee";
// import TestimonialSection from "@/app/components/sections/TestimonialSection";
// import React from "react";

// const page = () => {
//   return (
//     <>
//       <div className="min-h-screen relative overflow-hidden">
//         <Hero />
//         <MarqueeSection />
//         <DaleelSections />
//         <DaleelBooks />
//         <FounderSection />
//         <CommitteeSection />
//         <EssentialBookCommittee />
//         <ScientificCommittee />
//         <LatestNewsSection />
//         <TestimonialSection />
//         <ContactSection />
//       </div>
//     </>
//   );
// };

// export default page;
