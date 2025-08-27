"use client";
import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../common/SectionHeader";
import Image from "next/image";

const FounderSection: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smooth motion
      },
    },
  };

  const circleVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      rotate: -180,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1.5,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      x: 30,
      y: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const paragraphVariants = {
    hidden: {
      opacity: 0,
      y: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="w-full bg-white px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20 py-8 sm:py-12 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.div variants={titleVariants}>
          <SectionHeader
            primaryText="DaleelFM"
            secondaryText="Founder"
            className="mb-6 sm:mb-8 md:mb-10 text-center"
          />
        </motion.div>

        <div className="flex justify-center min-h-[400px] items-center">
          <div className="w-full max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-12 justify-center">
              {/* Founder Image with Circle BG */}
              <motion.div
                className="flex-shrink-0 relative flex items-center justify-center lg:justify-start"
                variants={imageVariants}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
              >
                {/* Small circular background positioned behind image */}
                <motion.div
                  className="absolute bottom-0 w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full bg-[#B5E2DD] z-0"
                  variants={circleVariants}
                />

                {/* Founder image positioned over the circle */}
                <motion.div
                  className="relative z-10 bg-transparent"
                  whileHover={{
                    y: -2,
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                >
                  <Image
                    src="/images/founder.png"
                    alt="Dr. Hadi Alenazy"
                    width={180}
                    height={240}
                    className="w-28 h-40 sm:w-32 sm:h-48 md:w-36 md:h-52 lg:w-40 lg:h-56 object-cover"
                    priority
                  />
                </motion.div>
              </motion.div>

              {/* Founder Info */}
              <motion.div
                className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl"
                variants={textVariants}
              >
                {/* Name with original styling */}
                <motion.h2
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-primary mb-3 sm:mb-4 leading-tight"
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                >
                  Dr. Hadi Alenazy
                </motion.h2>

                {/* Content with original styling */}
                <motion.div
                  className="text-secondary text-xs sm:text-sm md:text-base font-medium leading-relaxed space-y-3 sm:space-y-4"
                  variants={containerVariants}
                >
                  <motion.p variants={paragraphVariants}>
                    <span className="font-semibold">
                      Founder and Editor-In-Chief of{" "}
                      <motion.a
                        href="https://www.DaleelFM.com"
                        className="underline text-secondary hover:text-primary transition-colors duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{
                          scale: 1.05,
                          transition: { duration: 0.2, ease: "easeOut" },
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        www.DaleelFM.com
                      </motion.a>
                    </span>
                    , currently serving as Executive Director, Planning and
                    Quality at Health and Life Sector, Tawuniya.
                  </motion.p>

                  <motion.p variants={paragraphVariants}>
                    Dr. Hadi Saeed Alenazy is a highly experienced Consultant in
                    Family Medicine, Medical Education, and Healthcare Quality
                    and Patient Safety.
                  </motion.p>

                  <motion.p variants={paragraphVariants}>
                    His extensive expertise in the healthcare sector has led to
                    numerous national roles supporting the Kingdom&apos;s
                    healthcare transformation, including Deputy-Chair and Member
                    of the Family Medicine Scientific Council, SCFHS, and Board
                    Member and Head of Scientific Committee, SSFCM.
                  </motion.p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FounderSection;
