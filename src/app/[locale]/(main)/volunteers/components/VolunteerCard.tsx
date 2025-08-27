"use client";

import React from "react";
import { motion } from "framer-motion";

// Animation variants
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
};

interface VolunteerMember {
  name: string;
  image?: string;
  desc?: string;
}

interface VolunteerCardProps {
  member: VolunteerMember;
  groupName: string;
}

export const VolunteerCard: React.FC<VolunteerCardProps> = ({
  member,
  groupName,
}) => {
  return (
    <motion.div
      className="group relative bg-card rounded-3xl border border-border shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      layout
    >
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/20 flex-shrink-0">
              <img
                src={member.image || "/api/placeholder/64/64"}
                alt={member.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/api/placeholder/64/64";
                }}
              />
            </div>
            {/* Status indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-chart-2 rounded-full border-2 border-card" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
              {member.name}
            </h3>
            <p className="text-sm text-primary font-medium mb-2 bg-primary/10 px-3 py-1 rounded-full inline-block">
              {groupName}
            </p>
            {member.desc && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {member.desc}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-3xl ring-2 ring-primary/20 ring-offset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

export default VolunteerCard;
