// components/about/CollapsibleSection.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import CommitteeMemberCard from "./CommitteeMemberCard";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

interface SectionData {
  name: string;
  desc?: string;
  image?: string;
}

interface CollapsibleSectionData {
  name: string;
  data: SectionData[];
}

interface CollapsibleSectionProps {
  section: CollapsibleSectionData;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ section }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-2xl border border-gray-200/60 shadow-lg overflow-hidden"
      variants={itemVariants}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
      >
        <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {section.data.length} members
          </span>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.data.map((member: SectionData, index: number) => (
              <CommitteeMemberCard key={index} member={member} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CollapsibleSection;
