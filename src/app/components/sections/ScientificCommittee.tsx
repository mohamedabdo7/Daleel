"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "../common/SectionHeader";
import { Button } from "../common/Button";
import Image from "next/image";

// Type definitions
interface ScientificCommitteeMember {
  name: string;
  image: string;
  desc: string;
}

interface ScientificCommitteeData {
  name: string;
  data: ScientificCommitteeMember[];
}

interface ScientificCommitteeProps {
  scientificCommittee: ScientificCommitteeData[];
}

const VISIBLE = 5; // Number of cards visible at once

const ScientificCommittee: React.FC<ScientificCommitteeProps> = ({
  scientificCommittee,
}) => {
  // Get the first committee's data, or use empty array as fallback
  const members = scientificCommittee[0]?.data || [];
  const [activeIndex, setActiveIndex] = useState(2);
  const [isClient, setIsClient] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState<
    Record<string, "loading" | "loaded" | "error">
  >({});

  // Ensure we're on the client side before rendering
  useEffect(() => {
    setIsClient(true);
    // Initialize image states
    const initialStates: Record<string, "loading" | "loaded" | "error"> = {};
    members.forEach((member) => {
      initialStates[member.name] = "loading";
    });
    setImageLoadStates(initialStates);
  }, [members]);

  // Don't render anything until we're sure we're on the client
  if (!isClient || members.length === 0) {
    return (
      <section className="w-full bg-white py-10 px-2 md:px-0">
        <div className="flex justify-center">
          <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
        </div>
      </section>
    );
  }

  // Ensure activeIndex is valid for the current members array
  const validActiveIndex = Math.min(
    Math.max(0, activeIndex),
    members.length - 1
  );

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : members.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < members.length - 1 ? prev + 1 : 0));
  };

  const handleImageLoad = (memberName: string) => {
    console.log(`Image loaded for: ${memberName}`);
    setImageLoadStates((prev) => ({ ...prev, [memberName]: "loaded" }));
  };

  const handleImageError = (memberName: string, imageUrl: string) => {
    console.error(`Image failed to load for: ${memberName}, URL: ${imageUrl}`);
    setImageLoadStates((prev) => ({ ...prev, [memberName]: "error" }));
  };

  // Calculate visible cards around the active card
  const getVisibleCards = () => {
    const cards = [];
    const halfVisible = Math.floor(VISIBLE / 2);

    for (let i = -halfVisible; i <= halfVisible; i++) {
      let index = validActiveIndex + i;

      // Handle wrapping for infinite scroll effect
      if (index < 0) index = members.length + index;
      if (index >= members.length) index = index - members.length;

      cards.push({
        member: members[index],
        originalIndex: index,
        position: i,
        isActive: i === 0,
      });
    }

    return cards;
  };

  const visibleCards = getVisibleCards();

  const MemberImage = ({
    member,
    isActive,
  }: {
    member: ScientificCommitteeMember;
    isActive: boolean;
  }) => {
    const imageState = imageLoadStates[member.name];
    const size = isActive ? 96 : 64;

    // Always show fallback if no image URL or if image failed to load
    if (!member.image || imageState === "error") {
      return (
        <div className="w-full h-full bg-[#B5E2DD] flex items-center justify-center text-white font-bold text-lg rounded-full">
          {member.name.charAt(0).toUpperCase()}
        </div>
      );
    }

    // Show loading state
    if (imageState === "loading") {
      return (
        <>
          <div className="w-full h-full bg-[#B5E2DD] animate-pulse rounded-full" />
          {/* Hidden image for loading */}
          <Image
            src={member.image}
            alt={member.name}
            width={size}
            height={size}
            className="hidden"
            onLoad={() => handleImageLoad(member.name)}
            onError={() => handleImageError(member.name, member.image)}
            unoptimized={true} // Disable Next.js optimization for external URLs
          />
        </>
      );
    }

    // Show loaded image
    return (
      <Image
        src={member.image}
        alt={member.name}
        width={size}
        height={size}
        className="w-full h-full object-cover rounded-full"
        onLoad={() => handleImageLoad(member.name)}
        onError={() => handleImageError(member.name, member.image)}
        priority={isActive}
        unoptimized={true}
      />
    );
  };

  return (
    <section className="w-full bg-white py-10 px-2 md:px-0">
      <SectionHeader
        primaryText="DaleelFM Scientific"
        secondaryText="Committee"
        className="mb-8 md:mb-10"
      />

      <div className="relative flex justify-center items-center w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-center">
          {visibleCards.map((card, idx) => {
            const { member, position, isActive } = card;

            // Determine spacing - more space around active card
            let marginClass = "";
            if (position === -1) marginClass = "mr-12";
            else if (position === 1) marginClass = "ml-12";
            else if (position === -2) marginClass = "mr-4";
            else if (position === 2) marginClass = "ml-4";
            else if (position === 0) marginClass = "mx-8";

            return (
              <div
                key={`${member.name}-${position}-${validActiveIndex}`}
                className={`relative flex items-center ${marginClass}`}
              >
                {/* Left Arrow */}
                {position === -1 && (
                  <button
                    className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={handlePrev}
                    aria-label="Previous member"
                    type="button"
                  >
                    <ChevronLeft size={16} />
                  </button>
                )}

                {/* Card */}
                <div
                  className={`flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-[#F3F8FE] shadow-lg scale-105 w-48 h-64"
                      : "bg-[#F3F8FE] opacity-70 w-40 h-56"
                  }`}
                >
                  {/* Member Image */}
                  <div
                    className={`flex items-center justify-center rounded-full bg-[#B5E2DD] mb-4 overflow-hidden ${
                      isActive ? "w-24 h-24" : "w-16 h-16"
                    }`}
                  >
                    <MemberImage member={member} isActive={isActive} />
                  </div>

                  {/* Member Name */}
                  <div
                    className={`text-center font-bold ${
                      isActive
                        ? "text-lg md:text-xl text-[#1A345A]"
                        : "text-base text-[#1A345A]"
                    }`}
                  >
                    {member.name}
                  </div>

                  {/* Member Title/Description */}
                  <div
                    className={`text-center mt-1 px-2 ${
                      isActive
                        ? "text-[#009688] text-sm md:text-base font-semibold"
                        : "text-[#009688] text-xs"
                    }`}
                  >
                    {member.desc}
                  </div>
                </div>

                {/* Right Arrow */}
                {position === 1 && (
                  <button
                    className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={handleNext}
                    aria-label="Next member"
                    type="button"
                  >
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots Navigation */}
      {/* <div className="flex justify-center gap-1 mt-6">
        {members.map((_, idx) => (
          <button
            key={`dot-${idx}`}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              idx === validActiveIndex ? "bg-[#1976D2]" : "bg-[#C7E2F6]"
            }`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            type="button"
          />
        ))}
      </div> */}

      <div className="flex justify-center mt-8">
        <Button
          className="text-white rounded-full px-8 py-3 text-base font-normal shadow-none hover:brightness-110"
          size="lg"
        >
          Full DaleelFM Scientific Committee
        </Button>
      </div>
    </section>
  );
};

export default ScientificCommittee;
