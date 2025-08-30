"use client";
import React, { useState } from "react";
import SectionHeader from "../common/SectionHeader";
import { Download } from "lucide-react";
import Image from "next/image";
import { Button } from "../common/Button";
import { motion, AnimatePresence, useInView } from "framer-motion";

const books = [
  {
    id: 1,
    title: "Urgent Care Manual",
    description:
      "Comprehensive guide for urgent care in family medicine, covering resuscitation, cardiovascular emergencies, gastrointestinal issues, respiratory problems, and more. Includes detailed protocols for managing life-threatening conditions in primary care settings.",
    image: "/images/book1.png",
    download:
      "https://cdn.daleelfm.com/category/rgentdalel_1692665292dalel_@2025.pdf",
  },
  {
    id: 2,
    title: "PHC Antimicrobial Manual",
    description:
      "Guidelines for antimicrobial use in primary health care, including treatment protocols for respiratory tract infections, urinary tract infections, skin infections, and more. Focuses on evidence-based antibiotic stewardship to combat resistance.",
    image: "/images/book2.png",
    download:
      "https://cdn.daleelfm.com/category/ntiv1dalel_1693000761dalel_@2025.pdf",
  },
];

const DaleelBooks: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(books.length / 2);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const handleDotClick = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const getCurrentBooks = () => {
    const startIndex = currentSlide * 2;
    return books.slice(startIndex, startIndex + 2);
  };

  // Enhanced animation variants
  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.3,
      },
    },
  };

  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        duration: 0.3,
      },
    },
  };

  const bookVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.85,
      rotateX: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth feel
      },
    },
    exit: {
      opacity: 0,
      y: -60,
      scale: 0.85,
      rotateX: -20,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateY: -15,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      x: -30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.5,
      },
    },
  };

  const paginationVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="w-full bg-gradient-to-b from-white to-blue-50/30 py-16 px-4 md:px-8 relative overflow-hidden"
    >
      {/* Subtle background animation */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage:
            "radial-gradient(circle, #3B82F6 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      <motion.div variants={headerVariants}>
        <SectionHeader
          primaryText="DaleelFM"
          secondaryText="Books"
          className="mb-12"
        />
      </motion.div>

      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          {/* Books Slider */}
          <div className="relative mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col lg:flex-row gap-8 lg:gap-4 xl:gap-4 justify-center items-center lg:items-stretch"
              >
                {getCurrentBooks().map((book) => (
                  <motion.div
                    key={`${book.id}-${currentSlide}`}
                    variants={bookVariants}
                    className="flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md mx-auto shadow-lg border border-[#E5F3FF] hover:shadow-xl transition-all duration-300 relative"
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                      rotateX: 5,
                      transition: {
                        duration: 0.3,
                        ease: "easeOut",
                      },
                    }}
                    style={{
                      transformStyle: "preserve-3d",
                      perspective: "1000px",
                    }}
                  >
                    {/* Subtle glow effect on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="flex flex-col sm:flex-row gap-6 items-start mb-6 relative z-10">
                      <motion.div
                        variants={imageVariants}
                        whileHover={{
                          scale: 1.08,
                          rotateY: 8,
                          rotateX: -5,
                          transition: { duration: 0.3 },
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <Image
                          src={book.image}
                          alt={book.title}
                          width={140}
                          height={180}
                          className="rounded-xl object-cover shadow-lg flex-shrink-0 border-2 border-white/50 mx-auto sm:mx-0"
                        />
                      </motion.div>

                      <div className="flex-1 text-center sm:text-left">
                        <motion.h3
                          variants={textVariants}
                          className="text-primary text-xl font-bold mb-4 leading-tight"
                        >
                          {book.title}
                        </motion.h3>
                        <motion.p
                          variants={textVariants}
                          className="text-[#1A345A] text-sm leading-relaxed line-clamp-6"
                        >
                          {book.description}
                        </motion.p>
                      </div>
                    </div>

                    <motion.div
                      variants={buttonVariants}
                      className="relative z-10"
                    >
                      <Button
                        fullWidth
                        leftIcon={<Download size={20} />}
                        className="rounded-xl py-4 bg-primary font-medium text-base shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 relative overflow-hidden"
                        size="lg"
                      >
                        {/* Button shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{
                            x: "100%",
                            transition: { duration: 0.6 },
                          }}
                        />
                        <a
                          href={book.download}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white relative z-10"
                        >
                          Download full book
                        </a>
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Enhanced Pagination Dots - commented out as per requirements */}
          {/* <motion.div
            variants={paginationVariants}
            className="flex justify-center items-center gap-3"
          >
            {Array.from({ length: totalSlides }).map((_, index) => (
              <motion.button
                key={index}
                variants={dotVariants}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => handleDotClick(index)}
                className={`relative transition-all duration-500 ease-out ${
                  currentSlide === index ? "w-4 h-4" : "w-3 h-3"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                <motion.div
                  className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                    currentSlide === index
                      ? "bg-primary shadow-md shadow-primary/30"
                      : "bg-[#B8D4F1] hover:bg-primary/60"
                  }`}
                  animate={{
                    scale: currentSlide === index ? 1 : 0.8,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />

                {currentSlide === index && (
                  <>
                    <motion.div
                      className="absolute inset-0 bg-primary rounded-full"
                      layoutId="activeDot"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-primary rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 0, 0.7],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </>
                )}
              </motion.button>
            ))}
          </motion.div> */}
        </div>
      </div>
    </motion.section>
  );
};

export default DaleelBooks;
