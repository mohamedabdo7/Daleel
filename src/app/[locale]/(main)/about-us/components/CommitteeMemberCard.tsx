// components/about/CommitteeMemberCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

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

interface CommitteeMember {
  name: string;
  desc?: string;
  image?: string;
}

interface CommitteeMemberCardProps {
  member: CommitteeMember;
}

const CommitteeMemberCard: React.FC<CommitteeMemberCardProps> = ({
  member,
}) => (
  <motion.div
    className="bg-white rounded-xl border border-gray-200/60 shadow-sm p-4 hover:shadow-md transition-all duration-300"
    variants={cardVariants}
    whileHover={{ scale: 1.01 }}
  >
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
        {/* <Image
          src={member.image || "/api/placeholder/96/96"}
          alt={member.name}
          width={48}
          height={48}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/api/placeholder/48/48";
          }}
        /> */}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {member.name}
        </h4>
        {member.desc && (
          <p className="text-xs text-gray-500 mt-1">{member.desc}</p>
        )}
      </div>
    </div>
  </motion.div>
);

export default CommitteeMemberCard;
