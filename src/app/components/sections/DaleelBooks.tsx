"use client";
import React, { useState, useEffect } from "react";
import SectionHeader from "../common/SectionHeader";
import { Download } from "lucide-react";
import Image from "next/image";
import { Button } from "../common/Button";
import { motion, AnimatePresence } from "framer-motion";

const books = [
  {
    id: 1,
    title: "Urgent Care Manual",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    image: "/images/book1.png",
    download: "#",
  },
  {
    id: 2,
    title: "Antimicrobial Guide",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    image: "/images/book2.png",
    download: "#",
  },
  {
    id: 3,
    title: "Emergency Protocols",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    image: "/images/book1.png",
    download: "#",
  },
  {
    id: 4,
    title: "Pediatric Care Guide",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    image: "/images/book2.png",
    download: "#",
  },
  {
    id: 5,
    title: "Critical Care Handbook",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    image: "/images/book1.png",
    download: "#",
  },
  {
    id: 6,
    title: "Surgical Manual",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    image: "/images/book2.png",
    download: "#",
  },
];

const DaleelBooks: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(books.length / 2);

  const handleDotClick = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const getCurrentBooks = () => {
    const startIndex = currentSlide * 2;
    return books.slice(startIndex, startIndex + 2);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  const bookVariants = {
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
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.9,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section className="w-full bg-white py-16 px-4 md:px-8">
      <SectionHeader
        primaryText="DaleelFM"
        secondaryText="Books"
        className="mb-12"
      />

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
                className="flex flex-col lg:flex-row gap-8 justify-center items-stretch"
              >
                {getCurrentBooks().map((book, index) => (
                  <motion.div
                    key={book.id}
                    variants={bookVariants}
                    className="flex flex-col bg-white rounded-2xl p-8 w-full max-w-md shadow-lg border border-[#E5F3FF] hover:shadow-xl transition-all duration-300"
                    whileHover={{
                      y: -5,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="flex flex-row gap-6 items-start mb-6">
                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          rotateY: 5,
                          transition: { duration: 0.3 },
                        }}
                      >
                        <Image
                          src={book.image}
                          alt={book.title}
                          width={140}
                          height={180}
                          className="rounded-xl object-cover shadow-lg flex-shrink-0"
                        />
                      </motion.div>

                      <div className="flex-1">
                        <motion.h3
                          className="text-primary text-xl font-bold mb-4 leading-tight"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {book.title}
                        </motion.h3>
                        <motion.p
                          className="text-[#1A345A] text-sm leading-relaxed line-clamp-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {book.description}
                        </motion.p>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button
                        fullWidth
                        leftIcon={<Download size={20} />}
                        className="rounded-xl py-4 bg-primary font-medium text-base shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                        size="lg"
                      >
                        <a href={book.download} download className="text-white">
                          Download full book
                        </a>
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots - Exact Figma Style */}
          <div className="flex justify-center items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <motion.button
                key={index}
                // whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 ${
                  currentSlide === index
                    ? "w-4 h-4 bg-primary rounded-full shadow-md"
                    : "w-3 h-3 bg-[#B8D4F1] hover:bg-primary/60 rounded-full"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                {currentSlide === index && (
                  <motion.div
                    layoutId="activeDot"
                    className="w-full h-full bg-primary rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DaleelBooks;
