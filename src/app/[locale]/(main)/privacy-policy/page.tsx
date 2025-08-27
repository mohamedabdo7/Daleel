// privacy/page.tsx
"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Users,
  Globe,
  AlertCircle,
} from "lucide-react";
import { getPrivacyPolicy } from "@/lib/api/policy.service";
import { qk } from "@/lib/queryKeys";

// Utility function to add IDs to headings in HTML content
const addNavigationIds = (htmlContent: string) => {
  if (!htmlContent) return htmlContent;

  const sectionMapping = [
    { regex: /Interpretation and Definitions/i, id: "interpretation" },
    {
      regex: /Collecting and Using Your Personal Data/i,
      id: "collecting-data",
    },
    { regex: /Use of Your Personal Data/i, id: "use-data" },
    { regex: /Retention of Your Personal Data/i, id: "retention" },
    { regex: /Transfer of Your Personal Data/i, id: "transfer" },
    { regex: /Security of Your Personal Data/i, id: "security" },
    { regex: /Children's Privacy/i, id: "children" },
    { regex: /Contact Us/i, id: "contact" },
  ];

  let processedContent = htmlContent;

  sectionMapping.forEach(({ regex, id }) => {
    // Add IDs to h2 tags that match our navigation sections
    processedContent = processedContent.replace(
      new RegExp(`(<h2[^>]*>)(.*?${regex.source}.*?)(</h2>)`, "gi"),
      `$1<span id="${id}"></span>$2$3`
    );
  });

  return processedContent;
};

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

// Feature cards data
const privacyFeatures = [
  {
    icon: Lock,
    title: "Data Protection",
    description: "Your personal information is encrypted and securely stored",
    color: "bg-blue-500",
    gradient: "from-blue-50 to-blue-100",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Clear information about what data we collect and why",
    color: "bg-green-500",
    gradient: "from-green-50 to-green-100",
  },
  {
    icon: Users,
    title: "Your Rights",
    description: "Full control over your data with easy deletion options",
    color: "bg-purple-500",
    gradient: "from-purple-50 to-purple-100",
  },
  {
    icon: Globe,
    title: "Global Standards",
    description: "Compliance with international privacy regulations",
    color: "bg-indigo-500",
    gradient: "from-indigo-50 to-indigo-100",
  },
];

export default function PrivacyPage() {
  const {
    data: privacyData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: qk.policy.privacy,
    queryFn: ({ signal }) => getPrivacyPolicy(signal),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Process the HTML content to add navigation IDs
  const processedContent = useMemo(() => {
    if (!privacyData?.privacy_policy?.value) return "";
    return addNavigationIds(privacyData.privacy_policy.value);
  }, [privacyData?.privacy_policy?.value]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Hero Section with Features */}
        <motion.section variants={itemVariants} className="mb-12 lg:mb-16">
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#1D4671] to-[#153654] rounded-2xl mb-6"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in transparency. Here's how we protect your data and
              respect your privacy.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {privacyFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}
                variants={cardVariants}
                whileHover="hover"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-xl mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Main Content */}
        <motion.section variants={itemVariants}>
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sidebar - Table of Contents */}
            <motion.div className="lg:col-span-3" variants={itemVariants}>
              <div className="sticky top-24 bg-white rounded-2xl border border-gray-200/60 shadow-lg p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-5 h-5 text-[#1D4671]" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Quick Navigation
                  </h3>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-4 bg-gray-200 rounded animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <nav className="space-y-2">
                    {[
                      {
                        title: "Interpretation and Definitions",
                        id: "interpretation",
                      },
                      {
                        title: "Collecting and Using Your Personal Data",
                        id: "collecting-data",
                      },
                      { title: "Use of Your Personal Data", id: "use-data" },
                      {
                        title: "Retention of Your Personal Data",
                        id: "retention",
                      },
                      {
                        title: "Transfer of Your Personal Data",
                        id: "transfer",
                      },
                      {
                        title: "Security of Your Personal Data",
                        id: "security",
                      },
                      { title: "Children's Privacy", id: "children" },
                      { title: "Contact Us", id: "contact" },
                    ].map((section) => (
                      <motion.button
                        key={section.id}
                        onClick={() => {
                          const element = document.getElementById(section.id);
                          if (element) {
                            element.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }}
                        className="block w-full text-left text-sm text-gray-600 hover:text-[#1D4671] hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-200 border-l-2 border-transparent hover:border-[#1D4671]"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {section.title}
                      </motion.button>
                    ))}
                  </nav>
                )}
              </div>
            </motion.div>

            {/* Main Content Area */}
            <motion.div className="lg:col-span-9" variants={itemVariants}>
              <div className="bg-white rounded-2xl border border-gray-200/60 shadow-lg backdrop-blur-sm overflow-hidden">
                {isLoading ? (
                  <div className="p-8 lg:p-12">
                    <div className="animate-pulse space-y-6">
                      <div className="h-8 bg-gray-200 rounded w-1/3" />
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                        <div className="h-4 bg-gray-200 rounded w-4/6" />
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-1/4" />
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                      </div>
                    </div>
                  </div>
                ) : isError ? (
                  <motion.div
                    className="p-8 lg:p-12 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Failed to load privacy policy
                    </h3>
                    <p className="text-gray-600">
                      Please try refreshing the page or contact support if the
                      problem persists.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    className="p-8 lg:p-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {/* Last Updated Badge */}
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      Last updated: April 14, 2025
                    </div>

                    {/* Content */}
                    <div
                      className="prose prose-gray max-w-none
                        prose-headings:text-gray-900 prose-headings:font-bold
                        prose-h1:text-3xl prose-h1:mb-6
                        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3
                        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                        prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-2
                        prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                        prose-ul:text-gray-600 prose-ul:mb-4
                        prose-li:mb-2
                        prose-strong:text-gray-800 prose-strong:font-semibold
                        prose-a:text-[#1D4671] prose-a:no-underline hover:prose-a:underline
                        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm"
                      dangerouslySetInnerHTML={{
                        __html: processedContent,
                      }}
                    />
                  </motion.div>
                )}
              </div>

              {/* Contact Section */}
              {!isLoading && !isError && (
                <motion.div
                  className="mt-8 bg-gradient-to-r from-[#1D4671] to-[#153654] rounded-2xl p-8 text-white"
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Questions about your privacy?
                      </h3>
                      <p className="text-blue-100 mb-4">
                        If you have any questions about this Privacy Policy or
                        how we handle your data, don't hesitate to reach out to
                        us.
                      </p>
                      <a
                        href="mailto:info@daleelfm.com"
                        className="inline-flex items-center gap-2 bg-white text-[#1D4671] px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
                      >
                        Contact Us
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
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
