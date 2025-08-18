"use client";
import { useState } from "react";
import Image from "next/image";
import { Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "../common/SectionHeader";

const news = [
  {
    image: "/images/news1.png",
    title:
      '"Seha" Virtual Hospital Activates the Use of Artificial Intelligence to',
    date: "01.07.2023",
    author: "Usama Omar",
  },
  {
    image: "/images/news2.png",
    title:
      '"Seha" Virtual Hospital Activates the Use of Artificial Intelligence to',
    date: "01.07.2023",
    author: "Usama Omar",
  },
  {
    image: "/images/news3.png",
    title:
      '"Seha" Virtual Hospital Activates the Use of Artificial Intelligence to',
    date: "01.07.2023",
    author: "Usama Omar",
  },
  {
    image: "/images/news1.png",
    title:
      '"Seha" Virtual Hospital Activates the Use of Artificial Intelligence to',
    date: "01.07.2023",
    author: "Usama Omar",
  },
  {
    image: "/images/news2.png",
    title:
      '"Seha" Virtual Hospital Activates the Use of Artificial Intelligence to',
    date: "01.07.2023",
    author: "Usama Omar",
  },
  {
    image: "/images/news3.png",
    title:
      '"Seha" Virtual Hospital Activates the Use of Artificial Intelligence to',
    date: "01.07.2023",
    author: "Usama Omar",
  },
];

const CARDS_VISIBLE = 3;

const LatestNewsSection = () => {
  const [start, setStart] = useState(0);

  const handlePrev = () => {
    setStart((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setStart((prev) => (prev < news.length - CARDS_VISIBLE ? prev + 1 : prev));
  };

  const visibleNews = news.slice(start, start + CARDS_VISIBLE);

  return (
    <section className="w-full py-12 px-2 md:px-0">
      <SectionHeader
        primaryText="Latest"
        secondaryText="News"
        className="mb-8 md:mb-10"
      />
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={start === 0}
          className={`rounded-full bg-white shadow-md border border-[#E6F0FA] text-[#1976D2] hover:bg-[#E6F0FA] transition w-10 h-10 flex items-center justify-center ${
            start === 0 ? "opacity-30 pointer-events-none" : ""
          }`}
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-6 flex-wrap justify-center max-w-5xl">
          {visibleNews.map((item, idx) => (
            <div
              key={idx + start}
              className="bg-[#F3F8FE] rounded-2xl w-[300px] h-[340px] flex flex-col shadow-sm overflow-hidden"
            >
              <div className="relative flex-1">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover w-full h-full rounded-3xl"
                  sizes="300px"
                />
                <div className="absolute bottom-0 left-0 w-full">
                  <div className="bg-[#E6F3FE] rounded-2xl p-4 flex flex-col">
                    <div className="text-[#1976D2] text-sm font-medium mb-4 leading-snug">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#1976D2] mt-auto">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} className="opacity-70" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={16} className="opacity-70" />
                        {item.author}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={start >= news.length - CARDS_VISIBLE}
          className={`rounded-full bg-white shadow-md border border-[#E6F0FA] text-[#1976D2] hover:bg-[#E6F0FA] transition w-10 h-10 flex items-center justify-center ${
            start >= news.length - CARDS_VISIBLE
              ? "opacity-30 pointer-events-none"
              : ""
          }`}
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-1 mt-6">
        {Array.from({ length: news.length - CARDS_VISIBLE + 1 }).map(
          (_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                idx === start ? "bg-[#1976D2]" : "bg-[#C7E2F6]"
              }`}
            />
          )
        )}
      </div>
    </section>
  );
};

export default LatestNewsSection;
