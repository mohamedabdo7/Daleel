"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import SectionHeader from "../common/SectionHeader";

const testimonials = [
  {
    name: "Dr. Ahmed Younies",
    title: "Family Medicine Specialist",
    date: "25 May 2023",
    image: "/images/ahmed.png",
    text: `DaleelFM is a game-changer for anyone in Family Medicine. The updated textbooks, unlimited MCQs, and structured flashcards make studying efficient and focused. I found everything I needed in one place — it&apos;s truly a must-have resource for doctors and medical students alike.`,
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
    text: `DaleelFM is a game-changer for anyone in Family Medicine. The updated textbooks, unlimited MCQs, and structured flashcards make studying efficient and focused. I found everything I needed in one place — it&apos;s truly a must-have resource for doctors and medical students alike.`,
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
    <section className="w-full py-12 px-4 md:px-8 lg:px-0">
      <SectionHeader
        primaryText="What did they say about"
        secondaryText="DaleelFM"
        className="mb-8 md:mb-10"
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center gap-4">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`rounded-full bg-white shadow-md border border-[#E6F0FA] text-[#1976D2] hover:bg-[#E6F0FA] transition w-10 h-10 flex items-center justify-center ${
              currentPage === 0 ? "opacity-30 pointer-events-none" : ""
            }`}
            aria-label="Previous"
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
          </button>

          {/* Cards Grid */}
          <div className="flex-1 max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {visibleTestimonials.map((item, idx) => (
                <div
                  key={startIndex + idx}
                  className="bg-[#E6F3FE] rounded-3xl w-full max-w-[350px] min-h-[340px] flex flex-col items-center px-4 py-6 shadow-sm"
                >
                  {/* Avatar */}
                  <div className="flex justify-center mb-4">
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
                  </div>

                  {/* Name & Title */}
                  <div className="text-center">
                    <div className="text-[#1A345A] font-bold text-lg">
                      {item.name}
                    </div>
                    <div className="text-[#1A345A] text-sm">{item.title}</div>
                    <div className="text-[#1A345A] text-xs mt-1">
                      {item.date}
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="text-[#1976D2] text-sm mt-4 text-center leading-relaxed flex-1">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
            className={`rounded-full bg-white shadow-md border border-[#E6F0FA] text-[#1976D2] hover:bg-[#E6F0FA] transition w-10 h-10 flex items-center justify-center ${
              currentPage >= totalPages - 1
                ? "opacity-30 pointer-events-none"
                : ""
            }`}
            aria-label="Next"
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
          </button>
        </div>

        {/* Dots Pagination - Page Indicators */}
        <div className="flex justify-center gap-1 mt-6">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${
                idx === currentPage ? "bg-[#1976D2]" : "bg-[#C7E2F6]"
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
