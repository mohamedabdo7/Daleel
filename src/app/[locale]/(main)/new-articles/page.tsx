"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Bell, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/common/Button";
import PageHeader from "@/app/components/common/PageHeader";
import { useRouter } from "next/navigation";

const NewArticles = () => {
  const router = useRouter();
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

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Reusable Header - WITH search */}
      <PageHeader
        title="Articles Sections"
        description="Browse Articles Sections of DaleelFM"
        iconSrc="/icons/articles-icon.svg"
        iconAlt="Articles Icon"
      />

      {/* Cards Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24">
            {/* Articles Summaries Card */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              className="group"
            >
              <motion.div
                variants={cardHoverVariants}
                className="relative h-full"
              >
                {/* Card Background with Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-[2px]">
                  <div className="h-full bg-white rounded-3xl" />
                </div>

                {/* Card Content */}
                <div className="relative h-full p-8 sm:p-10 lg:p-12 flex flex-col">
                  {/* Icon */}
                  <motion.div
                    variants={iconVariants}
                    className="mb-8 flex justify-center lg:justify-start"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                      <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                      Articles Summaries
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      Discover comprehensive summaries of the latest medical
                      articles, research papers, and clinical studies in family
                      medicine.
                    </p>
                  </div>

                  {/* Button */}
                  <div className="flex justify-center lg:justify-start">
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => router.push("/en/articles")}
                      rightIcon={
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      }
                      className="group-hover:shadow-2xl group-hover:shadow-blue-500/25 transition-shadow duration-300"
                    >
                      View all articles
                    </Button>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                </div>
              </motion.div>
            </motion.div>

            {/* Articles Alert Card */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              className="group"
            >
              <motion.div
                variants={cardHoverVariants}
                className="relative h-full"
              >
                {/* Card Background with Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-[2px]">
                  <div className="h-full bg-white rounded-3xl" />
                </div>

                {/* Card Content */}
                <div className="relative h-full p-8 sm:p-10 lg:p-12 flex flex-col">
                  {/* Icon */}
                  <motion.div
                    variants={iconVariants}
                    className="mb-8 flex justify-center lg:justify-start"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                      <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
                        <Bell className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                      Articles Alert
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      Stay updated with real-time notifications about new
                      publications, breaking medical news, and important updates
                      in your field.
                    </p>
                  </div>

                  {/* Button */}
                  <div className="flex justify-center lg:justify-start">
                    <Button
                      variant="secondary"
                      size="lg"
                      rightIcon={
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                          }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      }
                      className="group-hover:shadow-2xl group-hover:shadow-emerald-500/25 transition-shadow duration-300"
                    >
                      View all article alerts
                    </Button>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-300" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default NewArticles;
