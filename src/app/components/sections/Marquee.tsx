"use client";
import React from "react";
import SectionHeader from "../common/SectionHeader";
import Image from "next/image";

const ENDORSED_LOGOS = [
  { src: "/images/dman.png", alt: "Council of Health Insurance" },
  { src: "/images/saudi-health.png", alt: "Saudi Health Council" },
  { src: "/images/vision.png", alt: "Saudi Vision 2030" },
  {
    src: "/images/suadi-commesion.png",
    alt: "Saudi Commission for Health Specialties",
  },
  { src: "/images/Ministry-of-Health.png", alt: "Ministry of Health" },
  {
    src: "/images/92499d4c-08d0-48db-900d-d9fcb40e210c.png",
    alt: "Saudi Center (unspecified)",
  },
];

const MarqueeSection: React.FC = () => {
  return (
    <section className="w-full bg-white px-2 md:px-0">
      <SectionHeader
        primaryText="DaleelFM"
        secondaryText="Endorsed By"
        className="mb-6"
      />

      {/* CSS-only smooth marquee */}
      <div className="overflow-hidden relative w-full h-16">
        <div className="absolute flex animate-marquee-smooth hover:pause-marquee">
          {/* Repeat logos 5 times for perfect coverage */}
          {Array.from({ length: 5 }).flatMap((_, setIndex) =>
            ENDORSED_LOGOS.map((logo, logoIndex) => (
              <div
                key={`${setIndex}-${logoIndex}`}
                className="flex-shrink-0 mx-3 flex items-center justify-center"
                style={{ width: "110px" }}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={110}
                  height={60}
                  className="w-[120px] h-12 object-contain transition duration-300"
                  loading="lazy"
                />
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-smooth {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-20%);
          }
        }

        .animate-marquee-smooth {
          animation: marquee-smooth 25s linear infinite;
          width: 500%;
          will-change: transform;
        }

        .pause-marquee:hover .animate-marquee-smooth {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default MarqueeSection;
