// components/about/TeamMemberCard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image?: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  const [isClient, setIsClient] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Ensure hydration safety
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <motion.div
      className="bg-white rounded-2xl border border-gray-200/60 shadow-lg p-6 hover:shadow-xl transition-all duration-300"
      variants={cardVariants}
      whileHover="hover"
    >
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 relative">
          {/* Always render placeholder first to avoid hydration mismatch */}
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {getInitials(member.name)}
              </span>
            </div>
          </div>

          {/* Only render image after client-side hydration */}
          {isClient && member.image && !imageError && (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full" />
              )}
              <Image
                src={member.image}
                alt={member.name}
                width={96}
                height={96}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(false);
                }}
                unoptimized
              />
            </>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {member.name}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {member.position}
        </p>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;
