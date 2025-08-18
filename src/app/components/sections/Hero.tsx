"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "../common/Button";
import SectionHeader from "../common/SectionHeader";

const Hero = () => {
  // Simplified, lightweight animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Letter animation variants for the headline
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
      transformOrigin: "center bottom",
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className="relative pt-20 pb-8 sm:pt-24 sm:pb-12 lg:pt-20 lg:pb-16 bg-white min-h-screen">
      {/* Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10 relative">
        {/* Headline with letter-by-letter animation */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          className="mb-4 sm:mb-6"
        >
          <motion.h1 className="font-sharpGrotesk font-normal text-[32px] xs:text-[40px] sm:text-[48px] md:text-[64px] lg:text-[80px] xl:text-[96px] leading-[1] tracking-normal text-center">
            <motion.div className="block text-primary overflow-hidden">
              {"Explore".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
            <motion.div className="block overflow-hidden">
              <motion.span className="inline-block">
                <motion.span className="text-secondary">
                  {"DaleelFM App".split("").map((letter, index) => (
                    <motion.span
                      key={index}
                      variants={letterVariants}
                      className="inline-block"
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                  ))}
                </motion.span>{" "}
                <motion.span className="text-primary">
                  {"Now!".split("").map((letter, index) => (
                    <motion.span
                      key={index}
                      variants={letterVariants}
                      className="inline-block"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.span>
              </motion.span>
            </motion.div>
          </motion.h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="text-[#0A1F4B] text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto font-medium px-4"
        >
          Get access to updated and enhanced versions of Family Medicine
          reference books, unlimited MCQs, lectures, flashcards, and more.
        </motion.p>

        {/* Download Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-col items-center mb-6 sm:mb-8"
        >
          <motion.div
            variants={fadeInUp}
            className="text-center text-primary font-light text-base sm:text-[18px] mb-3 sm:mb-4 leading-[152%] tracking-normal"
          >
            Download DaleelFM App Now!
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 items-center"
          >
            <motion.a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/icons/google-play-badge.png"
                alt="Get it on Google Play"
                width={140}
                height={42}
                className="h-10 sm:h-12 w-auto"
              />
            </motion.a>
            <motion.a
              href="https://apps.apple.com/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/icons/app-store-badge.png"
                alt="Download on the App Store"
                width={140}
                height={42}
                className="h-10 sm:h-12 w-auto"
              />
            </motion.a>
          </motion.div>

          <motion.div variants={fadeInUp} className="mb-3 sm:mb-4">
            <SectionHeader
              primaryText="Our"
              secondaryText="Strategic Partners"
            />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-row items-center gap-6 sm:gap-8"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/icons/tawuniya.svg"
                alt="Tawuniya"
                width={80}
                height={32}
                className="h-8 sm:h-10 w-auto"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/icons/tawuniya.svg"
                alt="AGFUND"
                width={80}
                height={32}
                className="h-8 sm:h-10 w-auto"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Hero Image - Responsive Implementation */}
      <motion.div
        className="relative w-full overflow-hidden mt-2 sm:mt-4 lg:-mt-16 xl:-mt-20"
        variants={scaleIn}
        initial="hidden"
        animate="visible"
      >
        {/* Mobile and Tablet View */}
        <div className="block lg:hidden">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
            <Image
              src="/images/hero.png"
              alt="DaleelFM Hero Image"
              fill
              className="object-contain object-center"
              priority
              sizes="100vw"
            />
          </div>
        </div>

        {/* Desktop View - Keep original full viewport width styling */}
        <div className="hidden lg:block">
          <div className="relative w-screen h-[700px] xl:h-[900px] -ml-[50vw] left-1/2">
            <Image
              src="/images/hero.png"
              alt="DaleelFM Hero Image"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          </div>
        </div>
      </motion.div>

      {/* Search Form - Clean and simple */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 lg:-mt-8 xl:-mt-12 relative z-10">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 bg-transparent"
        >
          <motion.div
            className="flex-1 flex items-center bg-[#C7E2F6] border border-[#136FB7] rounded-xl px-4 py-3 sm:py-2 transition-all duration-300"
            whileHover={{
              boxShadow: "0 4px 12px rgba(19, 111, 183, 0.15)",
              borderColor: "#0d5aa7",
            }}
          >
            <svg
              className="w-5 h-5 text-[#136FB7] mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search in DaleelFM Books, Articles, Protocols or lectures"
              className="flex-1 bg-transparent outline-none text-primary text-sm sm:text-base font-medium
               placeholder:text-[#136FB7] placeholder:text-[12px] sm:placeholder:text-[14px] placeholder:font-normal"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
            className="w-full sm:w-auto" // full width on mobile, auto on ≥sm
          >
            <Button
              type="submit"
              size="lg"
              fullWidth // keep for mobile
              containerClassName="w-full sm:w-auto" // override at ≥sm
              className="
      sm:ml-4
      rounded-full bg-primary hover:bg-[#0d5aa7] text-white
      px-6 py-3 text-sm                         // mobile
      sm:px-6 sm:py-2 sm:text-sm sm:h-10        // smaller on ≥sm (like Figma)
      shadow-lg hover:shadow-xl transition-all duration-300
    "
            >
              Search
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
};

export default Hero;
