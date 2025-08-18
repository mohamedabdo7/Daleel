"use client";
import { motion } from "framer-motion";
import React from "react";

interface SectionHeaderProps {
  primaryText: string; // e.g. "DaleelFM"
  secondaryText: string; // e.g. "Endorsed By"
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  primaryText,
  secondaryText,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-full text-center py-2 ${className}`}
    >
      <h3 className="text-base md:text-lg font-medium tracking-wide">
        <span className="text-primary">{primaryText}</span>{" "}
        <span className="text-secondary font-semibold">{secondaryText}</span>
      </h3>
    </motion.div>
  );
};

export default SectionHeader;
