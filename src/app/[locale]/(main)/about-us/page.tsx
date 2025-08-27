// about/page.tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, Heart, Award, UserCheck, AlertCircle } from "lucide-react";
import { getAboutData } from "@/lib/api/about.service";
import { qk } from "@/lib/queryKeys";
import TeamMemberCard from "./components/TeamMemberCard";
import CollapsibleSection from "./components/CollapsibleSection";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

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

// Stats data
const statsData = [
  {
    icon: Users,
    title: "Team Members",
    description: "Dedicated professionals",
    color: "bg-blue-500",
    gradient: "from-blue-50 to-blue-100",
  },
  {
    icon: Award,
    title: "Scientific Committees",
    description: "Expert review panels",
    color: "bg-green-500",
    gradient: "from-green-50 to-green-100",
  },
  {
    icon: Heart,
    title: "Volunteers",
    description: "Contributing members",
    color: "bg-purple-500",
    gradient: "from-purple-50 to-purple-100",
  },
  {
    icon: UserCheck,
    title: "Contributors",
    description: "Over 600 physicians nationwide",
    color: "bg-indigo-500",
    gradient: "from-indigo-50 to-indigo-100",
  },
];

export default function AboutPage() {
  const {
    data: aboutData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: qk.about.data,
    queryFn: ({ signal }) => getAboutData(signal),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Hero Section */}
        <motion.section variants={itemVariants} className="text-center mb-16">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#1D4671] to-[#153654] rounded-2xl mb-6"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Users className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            About DaleelFM
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Your comprehensive resource for family medicine and primary care
            excellence
          </p>
        </motion.section>

        {/* Stats Cards */}
        <motion.section variants={itemVariants} className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.title}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${stat.gradient} border border-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}
                variants={cardVariants}
                whileHover="hover"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${stat.color} rounded-xl mb-4`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {stat.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* About Content */}
        <motion.section variants={itemVariants} className="mb-16">
          <div className="bg-white rounded-2xl border border-gray-200/60 shadow-lg p-8 lg:p-12">
            {isLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/3" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-4/6" />
                </div>
              </div>
            ) : isError ? (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Failed to load content
                </h3>
                <p className="text-gray-600">
                  Please try refreshing the page or contact support if the
                  problem persists.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <div
                  className="prose prose-gray max-w-none
                    prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                    prose-strong:text-gray-800 prose-strong:font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: aboutData?.about || "",
                  }}
                />
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Team Section */}
        {!isLoading && !isError && aboutData?.team && (
          <motion.section variants={itemVariants} className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Our Team
              </h2>
              <p className="text-gray-600">
                Meet the founding permanent members driving our mission
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {aboutData.team.map((member, index) => (
                <TeamMemberCard key={member.id + index} member={member} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Scientific Committees */}
        {!isLoading && !isError && aboutData?.scientific_committee && (
          <motion.section variants={itemVariants} className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Scientific Committees
              </h2>
              <p className="text-gray-600">
                Expert panels ensuring the highest quality of content
              </p>
            </div>
            <div className="space-y-6">
              {aboutData.scientific_committee.map((section, index) => (
                <CollapsibleSection key={index} section={section} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Volunteers */}
        {!isLoading && !isError && aboutData?.volunteers && (
          <motion.section variants={itemVariants} className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Our Volunteers
              </h2>
              <p className="text-gray-600">
                Dedicated contributors making DaleelFM possible
              </p>
            </div>
            <div className="space-y-6">
              {aboutData.volunteers.map((section, index) => (
                <CollapsibleSection key={index} section={section} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Contact CTA */}
        {!isLoading && !isError && (
          <motion.div
            className="bg-gradient-to-r from-[#1D4671] to-[#153654] rounded-2xl p-8 text-white text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Be part of advancing family medicine and primary care in Saudi
              Arabia. Connect with us to learn more about contributing to
              DaleelFM.
            </p>
            <a
              href="mailto:info@daleelfm.com"
              className="inline-flex items-center gap-2 bg-white text-[#1D4671] px-8 py-4 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
            >
              Get in Touch
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
