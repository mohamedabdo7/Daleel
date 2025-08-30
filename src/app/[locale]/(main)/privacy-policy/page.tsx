// privacy/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Users,
  Globe,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { getPrivacyPolicy } from "@/lib/api/policy.service";
import { qk } from "@/lib/queryKeys";

// Enhanced utility function to split content by sections and add IDs
const processPrivacyContent = (htmlContent: string) => {
  if (!htmlContent) return { processedContent: "", sections: [] };

  const sectionMapping = [
    {
      regex: /Interpretation and Definitions/i,
      id: "interpretation",
      title: "Interpretation and Definitions",
    },
    {
      regex: /Collecting and Using Your Personal Data/i,
      id: "collecting-data",
      title: "Collecting and Using Your Personal Data",
    },
    {
      regex: /Use of Your Personal Data/i,
      id: "use-data",
      title: "Use of Your Personal Data",
    },
    {
      regex: /Retention of Your Personal Data/i,
      id: "retention",
      title: "Retention of Your Personal Data",
    },
    {
      regex: /Transfer of Your Personal Data/i,
      id: "transfer",
      title: "Transfer of Your Personal Data",
    },
    {
      regex: /Security of Your Personal Data/i,
      id: "security",
      title: "Security of Your Personal Data",
    },
    {
      regex: /Children's Privacy/i,
      id: "children",
      title: "Children's Privacy",
    },
    { regex: /Contact Us/i, id: "contact", title: "Contact Us" },
  ];

  let processedContent = htmlContent;

  // Add IDs to sections
  sectionMapping.forEach(({ regex, id }) => {
    processedContent = processedContent.replace(
      new RegExp(`(<h2[^>]*>)(.*?${regex.source}.*?)(</h2>)`, "gi"),
      `$1<span id="${id}"></span>$2$3`
    );
  });

  // Split content into sections
  const sections = [];
  const h2Regex = /<h2[^>]*>.*?<\/h2>/gi;
  const h2Matches = Array.from(processedContent.matchAll(h2Regex));

  for (let i = 0; i < h2Matches.length; i++) {
    const currentMatch = h2Matches[i];
    const nextMatch = h2Matches[i + 1];

    const startIndex = currentMatch.index;
    const endIndex = nextMatch ? nextMatch.index : processedContent.length;

    const sectionContent = processedContent.substring(startIndex, endIndex);

    // Find matching section info
    const matchedSection = sectionMapping.find(({ regex }) =>
      regex.test(currentMatch[0])
    );

    if (matchedSection) {
      sections.push({
        id: matchedSection.id,
        title: matchedSection.title,
        content: sectionContent,
      });
    }
  }

  // Get intro content (before first h2)
  const firstH2Index = processedContent.search(h2Regex);
  const introContent =
    firstH2Index > 0 ? processedContent.substring(0, firstH2Index) : "";

  return { processedContent, sections, introContent };
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

const collapseVariants = {
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.3,
        ease: "easeOut",
      },
      opacity: {
        duration: 0.25,
        delay: 0.1,
      },
    },
  },
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.3,
        ease: "easeIn",
      },
      opacity: {
        duration: 0.2,
      },
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

// CollapsibleSection component for mobile
const CollapsibleSection = ({
  section,
  index,
}: {
  section: any;
  index: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(index === 0); // First section expanded by default

  return (
    <motion.div
      className="border-b border-gray-200 last:border-b-0"
      initial={false}
      variants={itemVariants}
    >
      <motion.button
        className={`w-full flex items-center justify-between p-4 text-left transition-colors duration-200 ${
          isExpanded
            ? "bg-gradient-to-r from-[#1D4671] to-[#153654] text-white"
            : "hover:bg-gray-50 text-gray-900"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
        whileTap={{ scale: 0.98 }}
      >
        <h3
          className={`text-lg font-semibold pr-4 ${
            isExpanded ? "text-white" : "text-gray-900"
          }`}
        >
          {section.title}
        </h3>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={collapseVariants}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div
                className="prose prose-gray max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
                  prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
                  prose-h4:text-base prose-h4:mt-3 prose-h4:mb-2
                  prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-3 prose-p:text-sm
                  prose-ul:text-gray-600 prose-ul:mb-3 prose-ul:text-sm
                  prose-li:mb-1
                  prose-strong:text-gray-800 prose-strong:font-semibold
                  prose-a:text-[#1D4671] prose-a:no-underline hover:prose-a:underline
                  prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-xs"
                dangerouslySetInnerHTML={{
                  __html: section.content,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

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

  // Process the HTML content to add navigation IDs and split into sections
  const { processedContent, sections, introContent } = useMemo(() => {
    if (!privacyData?.privacy_policy?.value)
      return { processedContent: "", sections: [], introContent: "" };
    return processPrivacyContent(privacyData.privacy_policy.value);
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
            {/* Desktop Sidebar - Table of Contents (hidden on mobile) */}
            <motion.div
              className="hidden lg:block lg:col-span-3"
              variants={itemVariants}
            >
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
                    {sections.map((section) => (
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
                  <>
                    {/* Desktop View - Full Content */}
                    <motion.div
                      className="hidden lg:block p-8 lg:p-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      {/* Last Updated Badge */}
                      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        Last updated: April 14, 2025
                      </div>

                      {/* Intro Content */}
                      {introContent && (
                        <div
                          className="prose prose-gray max-w-none mb-8
                            prose-headings:text-gray-900 prose-headings:font-bold
                            prose-h1:text-3xl prose-h1:mb-6
                            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                            prose-strong:text-gray-800 prose-strong:font-semibold
                            prose-a:text-[#1D4671] prose-a:no-underline hover:prose-a:underline"
                          dangerouslySetInnerHTML={{ __html: introContent }}
                        />
                      )}

                      {/* Full Content */}
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

                    {/* Mobile View - Collapsible Sections */}
                    <motion.div
                      className="lg:hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      {/* Last Updated Badge */}
                      <div className="p-4 pb-0">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-full text-xs font-medium border border-blue-200">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          Last updated: April 14, 2025
                        </div>
                      </div>

                      {/* Intro Content */}
                      {introContent && (
                        <div className="p-4">
                          <div
                            className="prose prose-gray max-w-none
                              prose-headings:text-gray-900 prose-headings:font-bold
                              prose-h1:text-2xl prose-h1:mb-4
                              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-3 prose-p:text-sm
                              prose-strong:text-gray-800 prose-strong:font-semibold
                              prose-a:text-[#1D4671] prose-a:no-underline hover:prose-a:underline"
                            dangerouslySetInnerHTML={{ __html: introContent }}
                          />
                        </div>
                      )}

                      {/* Mobile Help Text */}
                      <div className="p-4 pt-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                          <ChevronDown className="w-4 h-4" />
                          <span>
                            Tap on sections below to expand and read the content
                          </span>
                        </div>
                      </div>

                      {/* Collapsible Sections */}
                      <div className="divide-y divide-gray-200">
                        {sections.map((section, index) => (
                          <CollapsibleSection
                            key={section.id}
                            section={section}
                            index={index}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Contact Section */}
              {!isLoading && !isError && (
                <motion.div
                  className="mt-8 bg-gradient-to-r from-[#1D4671] to-[#153654] rounded-2xl p-6 lg:p-8 text-white"
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold mb-2">
                        Questions about your privacy?
                      </h3>
                      <p className="text-blue-100 mb-4 text-sm lg:text-base">
                        If you have any questions about this Privacy Policy or
                        how we handle your data, don't hesitate to reach out to
                        us.
                      </p>
                      <a
                        href="mailto:info@daleelfm.com"
                        className="inline-flex items-center gap-2 bg-white text-[#1D4671] px-4 py-2 lg:px-6 lg:py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 text-sm lg:text-base"
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
