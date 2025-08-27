"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "../common/SectionHeader";

const testimonials = [
  {
    name: "Dr. Ahmed Younies",
    title: "Family Medicine Specialist",
    date: "25 May 2023",
    image: "/images/ahmed.png",
    text: `DaleelFM is a game-changer for anyone in Family Medicine. The updated textbooks, unlimited MCQs, and structured flashcards make studying efficient and focused. I found everything I needed in one place — it's truly a must-have resource for doctors and medical students alike.`,
  },
  {
    name: "Dr. Sara Khaled",
    title: "Resident Doctor",
    date: "12 June 2023",
    image: "",
    text: `The MCQs and flashcards are so helpful! DaleelFM made my exam prep much easier and less stressful. Highly recommended for all medical students.`,
  },
  {
    name: "Dr. Omar Fathy",
    title: "Medical Student",
    date: "03 July 2023",
    image: "",
    text: `I love the structured content and the easy navigation. DaleelFM is my go-to resource for quick revision and in-depth study.`,
  },
  {
    name: "Dr. Ahmed Younies",
    title: "Family Medicine Specialist",
    date: "25 May 2023",
    image: "/images/ahmed.png",
    text: `DaleelFM is a game-changer for anyone in Family Medicine. The updated textbooks, unlimited MCQs, and structured flashcards make studying efficient and focused. I found everything I needed in one place — it's truly a must-have resource for doctors and medical students alike.`,
  },
  {
    name: "Dr. Sara Khaled",
    title: "Resident Doctor",
    date: "12 June 2023",
    image: "",
    text: `The MCQs and flashcards are so helpful! DaleelFM made my exam prep much easier and less stressful. Highly recommended for all medical students.`,
  },
  {
    name: "Dr. Omar Fathy",
    title: "Medical Student",
    date: "03 July 2023",
    image: "",
    text: `I love the structured content and the easy navigation. DaleelFM is my go-to resource for quick revision and in-depth study.`,
  },
  // Add more testimonials as needed
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
  hover: {
    scale: 1.05,
    backgroundColor: "#E6F0FA",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
  disabled: {
    opacity: 0.3,
    scale: 1,
    transition: {
      duration: 0.2,
    },
  },
};

const dotVariants = {
  inactive: {
    scale: 1,
    backgroundColor: "#C7E2F6",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  active: {
    scale: 1.2,
    backgroundColor: "#1976D2",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const avatarVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.3,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.4,
    },
  },
};

const TestimonialSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);

  // Update cards per page based on screen size
  useEffect(() => {
    const updateCardsPerPage = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 640) {
          setCardsPerPage(1); // Mobile: 1 card
        } else if (window.innerWidth < 1024) {
          setCardsPerPage(2); // Tablet: 2 cards
        } else {
          setCardsPerPage(3); // Desktop: 3 cards
        }
      }
    };

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  // Reset to first page when cards per page changes
  useEffect(() => {
    setCurrentPage(0);
  }, [cardsPerPage]);

  const totalPages = Math.ceil(testimonials.length / cardsPerPage);
  const startIndex = currentPage * cardsPerPage;
  const visibleTestimonials = testimonials.slice(
    startIndex,
    startIndex + cardsPerPage
  );

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  return (
    <motion.section
      className="w-full py-12 px-4 md:px-8 lg:px-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <motion.div variants={cardVariants} className="max-w-7xl mx-auto">
        <SectionHeader
          primaryText="What did they say about"
          secondaryText="DaleelFM"
          className="mb-8 md:mb-10"
        />

        <div className="flex justify-center items-center gap-4">
          {/* Previous Button */}
          <motion.button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="rounded-full bg-white shadow-md border border-[#E6F0FA] text-[#1976D2] 
                     hover:bg-[#E6F0FA] transition w-10 h-10 flex items-center justify-center
                     disabled:pointer-events-none"
            aria-label="Previous"
            variants={buttonVariants}
            initial="hidden"
            animate={currentPage === 0 ? "disabled" : "visible"}
            whileHover={currentPage === 0 ? {} : "hover"}
            whileTap={currentPage === 0 ? {} : "tap"}
          >
            <svg width="24" height="24" fill="none">
              <path
                d="M15 6l-6 6 6 6"
                stroke="#1976D2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>

          {/* Cards Grid */}
          <div className="flex-1 max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {visibleTestimonials.map((item, idx) => (
                  <motion.div
                    key={startIndex + idx}
                    className="bg-[#E6F3FE] rounded-3xl w-full max-w-[350px] min-h-[340px] 
                             flex flex-col items-center px-4 py-6 shadow-sm"
                    variants={cardVariants}
                    layout
                  >
                    {/* Avatar */}
                    <motion.div
                      className="flex justify-center mb-4"
                      variants={avatarVariants}
                    >
                      {item.image ? (
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#1976D2] text-2xl font-bold">
                          {item.name.charAt(0)}
                        </div>
                      )}
                    </motion.div>

                    {/* Name & Title */}
                    <motion.div className="text-center" variants={textVariants}>
                      <div className="text-[#1A345A] font-bold text-lg">
                        {item.name}
                      </div>
                      <div className="text-[#1A345A] text-sm">{item.title}</div>
                      <div className="text-[#1A345A] text-xs mt-1">
                        {item.date}
                      </div>
                    </motion.div>

                    {/* Testimonial */}
                    <motion.div
                      className="text-[#1976D2] text-sm mt-4 text-center leading-relaxed flex-1"
                      variants={textVariants}
                    >
                      {item.text}
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next Button */}
          <motion.button
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
            className="rounded-full bg-white shadow-md border border-[#E6F0FA] text-[#1976D2] 
                     hover:bg-[#E6F0FA] transition w-10 h-10 flex items-center justify-center
                     disabled:pointer-events-none"
            aria-label="Next"
            variants={buttonVariants}
            initial="hidden"
            animate={currentPage >= totalPages - 1 ? "disabled" : "visible"}
            whileHover={currentPage >= totalPages - 1 ? {} : "hover"}
            whileTap={currentPage >= totalPages - 1 ? {} : "tap"}
          >
            <svg width="24" height="24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="#1976D2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>

        {/* Dots Pagination - Page Indicators */}
        <motion.div
          className="flex justify-center gap-1 mt-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Array.from({ length: totalPages }).map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => goToPage(idx)}
              className="w-2 h-2 rounded-full transition-all duration-200 cursor-pointer"
              variants={dotVariants}
              animate={idx === currentPage ? "active" : "inactive"}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default TestimonialSection;
