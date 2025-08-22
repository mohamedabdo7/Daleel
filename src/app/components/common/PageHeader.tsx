"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
  // Search related props - all optional
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  iconSrc,
  iconAlt,
  // Search props with defaults
  searchPlaceholder = "",
  onSearch,
  showSearch = false, // Default to false - search is opt-in
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full ml-8 sm:ml-12 lg:ml-16"
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-[#136fb7] to-[#0a2c75] rounded-l-[4rem] sm:rounded-l-[5rem] lg:rounded-l-[6rem]">
        {/* Subtle animated background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative px-8 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-18">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col lg:flex-row items-center max-w-7xl pr-8 sm:pr-12 lg:pr-16"
          >
            {/* Image Container */}
            <motion.div variants={itemVariants} className="flex-shrink-0">
              <div className="relative">
                <img
                  src={iconSrc}
                  alt={iconAlt}
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              </div>
            </motion.div>

            {/* Content - Title and Description */}
            <motion.div
              variants={itemVariants}
              className="text-center lg:text-left flex-1"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 lg:mb-4 leading-tight">
                {title}
              </h1>
              <p className="text-lg sm:text-xl text-blue-100/80 font-medium mb-8">
                {description}
              </p>
            </motion.div>

            {/* Search Input - Only show if showSearch is true */}
            {showSearch && (
              <motion.div
                variants={itemVariants}
                className="flex-shrink-0 lg:ml-8"
              >
                <div className="bg-white rounded-full flex items-center overflow-hidden shadow-lg max-w-md">
                  <div className="flex items-center flex-1">
                    <div className="pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-3 py-3 text-gray-700 focus:outline-none bg-transparent min-w-0"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-8 py-3 m-1 font-semibold text-white transition-colors rounded-full hover:opacity-90"
                    style={{ backgroundColor: "#136FB7" }}
                  >
                    Search
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default PageHeader;
