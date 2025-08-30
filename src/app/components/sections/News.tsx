"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "../common/SectionHeader";

// Type definitions
export interface NewsItem {
  id: number;
  uuid: string;
  title: string;
  desc: string;
  file: string;
  created_at: string;
}

interface LatestNewsSectionProps {
  latestNews: NewsItem[];
}

const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({
  latestNews,
}) => {
  const [start, setStart] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(3);
  const [isClient, setIsClient] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState<
    Record<string, "loading" | "loaded" | "error">
  >({});

  // Reset image states when news data changes
  useEffect(() => {
    const initialStates: Record<string, "loading" | "loaded" | "error"> = {};
    latestNews.forEach((item) => {
      // Use a unique key combining title and image URL to detect changes
      const key = getImageKey(item);
      initialStates[key] = "loading";
    });
    setImageLoadStates(initialStates);
  }, [latestNews]);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Responsive cards count
  useEffect(() => {
    const updateCardsVisible = () => {
      if (window.innerWidth < 640) {
        setCardsVisible(1);
      } else if (window.innerWidth < 1024) {
        setCardsVisible(2);
      } else {
        setCardsVisible(3);
      }
    };

    updateCardsVisible();
    window.addEventListener("resize", updateCardsVisible);
    return () => window.removeEventListener("resize", updateCardsVisible);
  }, []);

  // Auto-adjust start index when screen size changes
  useEffect(() => {
    if (start > latestNews.length - cardsVisible) {
      setStart(Math.max(0, latestNews.length - cardsVisible));
    }
  }, [cardsVisible, start, latestNews.length]);

  const getImageKey = useCallback((item: NewsItem) => {
    return `${item.title}_${item.file}_${item.id}`;
  }, []);

  const handleImageLoad = useCallback(
    (item: NewsItem) => {
      const key = getImageKey(item);
      setImageLoadStates((prev) => ({ ...prev, [key]: "loaded" }));
    },
    [getImageKey]
  );

  const handleImageError = useCallback(
    (item: NewsItem) => {
      const key = getImageKey(item);
      console.error(
        `Image failed to load for ${item.title}. URL: ${item.file}`
      );
      setImageLoadStates((prev) => ({ ...prev, [key]: "error" }));
    },
    [getImageKey]
  );

  const handlePrev = () => {
    setStart((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setStart((prev) =>
      prev < latestNews.length - cardsVisible ? prev + 1 : prev
    );
  };

  const visibleNews = latestNews.slice(start, start + cardsVisible);
  const maxDots = latestNews.length - cardsVisible + 1;

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

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
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
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
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
      scale: 1.1,
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

  const NewsImage = ({ item, idx }: { item: NewsItem; idx: number }) => {
    const imageKey = getImageKey(item);
    const imageState = imageLoadStates[imageKey];
    const size = 320; // Match the card width for fill prop

    // Validate image URL
    const isValidImageUrl =
      item.file &&
      (item.file.startsWith("http://") || item.file.startsWith("https://"));

    // Show fallback if no image URL, invalid URL, or if image failed to load
    if (!isValidImageUrl || imageState === "error") {
      return (
        <div className="w-full h-full bg-[#B5E2DD] flex items-center justify-center text-white font-bold text-2xl rounded-3xl">
          {item.title.charAt(0).toUpperCase()}
        </div>
      );
    }

    // Show loading state
    if (imageState === "loading") {
      return (
        <div className="relative w-full h-full">
          <div className="w-full h-full bg-[#B5E2DD] animate-pulse rounded-3xl" />
          <Image
            key={imageKey} // Force re-render when image changes
            src={item.file}
            alt={item.title}
            width={size}
            height={size}
            className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-0"
            onLoad={() => handleImageLoad(item)}
            onError={() => handleImageError(item)}
            unoptimized={true}
            loading="eager"
          />
        </div>
      );
    }

    // Show loaded image
    return (
      <Image
        key={imageKey} // Force re-render when image changes
        src={item.file}
        alt={item.title}
        fill
        className="object-cover w-full h-full rounded-3xl transition-opacity duration-200"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onLoad={() => handleImageLoad(item)}
        onError={() => handleImageError(item)}
        unoptimized={true}
        priority={idx < cardsVisible}
        loading="eager"
      />
    );
  };

  if (!isClient || latestNews.length === 0) {
    return (
      <motion.section
        className="w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <motion.div variants={cardVariants} className="max-w-7xl mx-auto">
        <SectionHeader
          primaryText="Latest"
          secondaryText="News"
          className="mb-8 md:mb-12"
        />

        <div className="flex justify-center items-center gap-3 sm:gap-6">
          {/* Previous Button */}
          <motion.button
            onClick={handlePrev}
            disabled={start === 0}
            className="rounded-full bg-white shadow-lg border border-[#E6F0FA] text-[#1976D2] 
                     w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center
                     disabled:pointer-events-none backdrop-blur-sm"
            aria-label="Previous"
            variants={buttonVariants}
            initial="hidden"
            animate={start === 0 ? "disabled" : "visible"}
            whileHover={start === 0 ? {} : "hover"}
            whileTap={start === 0 ? {} : "tap"}
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </motion.button>

          {/* Cards Container */}
          <div className="flex-1 max-w-6xl">
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={start}
                  className="flex gap-4 sm:gap-6 justify-center"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {visibleNews.map((item, idx) => {
                    return (
                      <motion.div
                        key={`${item.id}_${item.file}_${start}`} // Better unique key
                        className="bg-[#F3F8FE] rounded-2xl 
                                 w-full sm:w-[280px] lg:w-[320px] h-[320px] sm:h-[360px] 
                                 flex flex-col shadow-sm overflow-hidden"
                        variants={cardVariants}
                        layout
                      >
                        <div className="relative flex-1">
                          <NewsImage item={item} idx={idx} />

                          <div className="absolute bottom-0 left-0 w-full">
                            <motion.div
                              className="bg-[#E6F3FE] rounded-2xl p-4 flex flex-col"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                            >
                              <div className="text-[#1976D2] text-sm font-medium mb-4 leading-snug">
                                {item.title}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-[#1976D2] mt-auto">
                                <span className="flex items-center gap-1">
                                  <Calendar size={16} className="opacity-70" />
                                  {new Date(item.created_at).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                                <span className="flex items-center gap-1">
                                  <User size={16} className="opacity-70" />
                                  {/* Author not available in API, using title as fallback */}
                                  {item.title.split(" ")[0]}
                                </span>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Next Button */}
          <motion.button
            onClick={handleNext}
            disabled={start >= latestNews.length - cardsVisible}
            className="rounded-full bg-white shadow-lg border border-[#E6F0FA] text-[#1976D2]
                     w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center
                     disabled:pointer-events-none backdrop-blur-sm"
            aria-label="Next"
            variants={buttonVariants}
            initial="hidden"
            animate={
              start >= latestNews.length - cardsVisible ? "disabled" : "visible"
            }
            whileHover={
              start >= latestNews.length - cardsVisible ? {} : "hover"
            }
            whileTap={start >= latestNews.length - cardsVisible ? {} : "tap"}
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </motion.button>
        </div>

        {/* Pagination Dots */}
        {maxDots > 1 && (
          <motion.div
            className="flex justify-center gap-2 mt-6 sm:mt-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {Array.from({ length: maxDots }).map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setStart(idx)}
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300
                         hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#1976D2]/30"
                variants={dotVariants}
                animate={idx === start ? "active" : "inactive"}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
};

export default LatestNewsSection;

// "use client";
// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import SectionHeader from "../common/SectionHeader";

// // Type definitions
// export interface NewsItem {
//   id: number;
//   uuid: string;
//   title: string;
//   desc: string;
//   file: string;
//   created_at: string;
// }

// interface LatestNewsSectionProps {
//   latestNews: NewsItem[];
// }

// const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({
//   latestNews,
// }) => {
//   const [start, setStart] = useState(0);
//   const [cardsVisible, setCardsVisible] = useState(3);
//   const [isClient, setIsClient] = useState(false);
//   const [imageLoadStates, setImageLoadStates] = useState<
//     Record<string, "loading" | "loaded" | "error">
//   >({});

//   // Responsive cards count
//   useEffect(() => {
//     const updateCardsVisible = () => {
//       if (window.innerWidth < 640) {
//         setCardsVisible(1);
//       } else if (window.innerWidth < 1024) {
//         setCardsVisible(2);
//       } else {
//         setCardsVisible(3);
//       }
//     };

//     updateCardsVisible();
//     window.addEventListener("resize", updateCardsVisible);
//     return () => window.removeEventListener("resize", updateCardsVisible);
//   }, []);

//   // Ensure client-side rendering and initialize image states
//   useEffect(() => {
//     setIsClient(true);
//     const initialStates: Record<string, "loading" | "loaded" | "error"> = {};
//     latestNews.forEach((item) => {
//       initialStates[item.title] = "loading";
//     });
//     setImageLoadStates(initialStates);
//   }, [latestNews]);

//   // Auto-adjust start index when screen size changes
//   useEffect(() => {
//     if (start > latestNews.length - cardsVisible) {
//       setStart(Math.max(0, latestNews.length - cardsVisible));
//     }
//   }, [cardsVisible, start, latestNews.length]);

//   const handlePrev = () => {
//     setStart((prev) => (prev > 0 ? prev - 1 : 0));
//   };

//   const handleNext = () => {
//     setStart((prev) =>
//       prev < latestNews.length - cardsVisible ? prev + 1 : prev
//     );
//   };

//   const visibleNews = latestNews.slice(start, start + cardsVisible);
//   const maxDots = latestNews.length - cardsVisible + 1;

//   const handleImageLoad = (title: string) => {
//     setImageLoadStates((prev) => ({ ...prev, [title]: "loaded" }));
//   };

//   const handleImageError = (title: string, imageUrl: string) => {
//     console.error(`Image failed to load for ${title}. URL: ${imageUrl}`);
//     setImageLoadStates((prev) => ({ ...prev, [title]: "error" }));
//   };

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const cardVariants = {
//     hidden: {
//       opacity: 0,
//       y: 30,
//       scale: 0.95,
//     },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15,
//         duration: 0.6,
//       },
//     },
//     exit: {
//       opacity: 0,
//       y: -20,
//       scale: 0.95,
//       transition: {
//         duration: 0.3,
//       },
//     },
//   };

//   const buttonVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: {
//         type: "spring",
//         stiffness: 200,
//         damping: 15,
//       },
//     },
//     hover: {
//       scale: 1.1,
//       backgroundColor: "#E6F0FA",
//       transition: {
//         type: "spring",
//         stiffness: 400,
//         damping: 17,
//       },
//     },
//     tap: {
//       scale: 0.95,
//       transition: {
//         duration: 0.1,
//       },
//     },
//     disabled: {
//       opacity: 0.3,
//       scale: 1,
//       transition: {
//         duration: 0.2,
//       },
//     },
//   };

//   const dotVariants = {
//     inactive: {
//       scale: 1,
//       backgroundColor: "#C7E2F6",
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 20,
//       },
//     },
//     active: {
//       scale: 1.2,
//       backgroundColor: "#1976D2",
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 20,
//       },
//     },
//   };

//   if (!isClient || latestNews.length === 0) {
//     return (
//       <motion.section
//         className="w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8"
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, amount: 0.2 }}
//       >
//         <div className="max-w-7xl mx-auto">
//           <div className="flex justify-center">
//             <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
//           </div>
//         </div>
//       </motion.section>
//     );
//   }

//   return (
//     <motion.section
//       className="w-full py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8"
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true, amount: 0.2 }}
//       variants={containerVariants}
//     >
//       <motion.div variants={cardVariants} className="max-w-7xl mx-auto">
//         <SectionHeader
//           primaryText="Latest"
//           secondaryText="News"
//           className="mb-8 md:mb-12"
//         />

//         <div className="flex justify-center items-center gap-3 sm:gap-6">
//           {/* Previous Button */}
//           <motion.button
//             onClick={handlePrev}
//             disabled={start === 0}
//             className="rounded-full bg-white shadow-lg border border-[#E6F0FA] text-[#1976D2]
//                      w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center
//                      disabled:pointer-events-none backdrop-blur-sm"
//             aria-label="Previous"
//             variants={buttonVariants}
//             initial="hidden"
//             animate={start === 0 ? "disabled" : "visible"}
//             whileHover={start === 0 ? {} : "hover"}
//             whileTap={start === 0 ? {} : "tap"}
//           >
//             <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
//           </motion.button>

//           {/* Cards Container */}
//           <div className="flex-1 max-w-6xl">
//             <div className="relative overflow-hidden">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={start}
//                   className="flex gap-4 sm:gap-6 justify-center"
//                   variants={containerVariants}
//                   initial="hidden"
//                   animate="visible"
//                   exit="exit"
//                 >
//                   {visibleNews.map((item, idx) => {
//                     const imageState = imageLoadStates[item.title];
//                     const size = 320; // Match the card width for fill prop

//                     return (
//                       <motion.div
//                         key={item.id}
//                         className="bg-[#F3F8FE] rounded-2xl
//                                  w-full sm:w-[280px] lg:w-[320px] h-[320px] sm:h-[360px]
//                                  flex flex-col shadow-sm overflow-hidden"
//                         variants={cardVariants}
//                         layout
//                       >
//                         <div className="relative flex-1">
//                           {!item.file || imageState === "error" ? (
//                             <div className="w-full h-full bg-[#B5E2DD] flex items-center justify-center text-white font-bold text-2xl rounded-3xl">
//                               {item.title.charAt(0).toUpperCase()}
//                             </div>
//                           ) : imageState === "loading" ? (
//                             <>
//                               <div className="w-full h-full bg-[#B5E2DD] animate-pulse rounded-3xl" />
//                               <Image
//                                 src={item.file}
//                                 alt={item.title}
//                                 width={size}
//                                 height={size}
//                                 className="hidden"
//                                 onLoadingComplete={() =>
//                                   handleImageLoad(item.title)
//                                 }
//                                 onError={() =>
//                                   handleImageError(item.title, item.file)
//                                 }
//                                 unoptimized={true}
//                               />
//                             </>
//                           ) : (
//                             <Image
//                               src={item.file}
//                               alt={item.title}
//                               fill
//                               className="object-cover w-full h-full rounded-3xl"
//                               sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                               onLoadingComplete={() =>
//                                 handleImageLoad(item.title)
//                               }
//                               onError={() =>
//                                 handleImageError(item.title, item.file)
//                               }
//                               unoptimized={true}
//                               priority={idx < cardsVisible}
//                             />
//                           )}

//                           <div className="absolute bottom-0 left-0 w-full">
//                             <motion.div
//                               className="bg-[#E6F3FE] rounded-2xl p-4 flex flex-col"
//                               initial={{ opacity: 0, y: 20 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               transition={{ delay: 0.3, duration: 0.5 }}
//                             >
//                               <div className="text-[#1976D2] text-sm font-medium mb-4 leading-snug">
//                                 {item.title}
//                               </div>
//                               <div className="flex items-center gap-4 text-xs text-[#1976D2] mt-auto">
//                                 <span className="flex items-center gap-1">
//                                   <Calendar size={16} className="opacity-70" />
//                                   {new Date(item.created_at).toLocaleDateString(
//                                     "en-GB",
//                                     {
//                                       day: "2-digit",
//                                       month: "2-digit",
//                                       year: "numeric",
//                                     }
//                                   )}
//                                 </span>
//                                 <span className="flex items-center gap-1">
//                                   <User size={16} className="opacity-70" />
//                                   {/* Author not available in API, using title as fallback */}
//                                   {item.title.split(" ")[0]}
//                                 </span>
//                               </div>
//                             </motion.div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Next Button */}
//           <motion.button
//             onClick={handleNext}
//             disabled={start >= latestNews.length - cardsVisible}
//             className="rounded-full bg-white shadow-lg border border-[#E6F0FA] text-[#1976D2]
//                      w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center
//                      disabled:pointer-events-none backdrop-blur-sm"
//             aria-label="Next"
//             variants={buttonVariants}
//             initial="hidden"
//             animate={
//               start >= latestNews.length - cardsVisible ? "disabled" : "visible"
//             }
//             whileHover={
//               start >= latestNews.length - cardsVisible ? {} : "hover"
//             }
//             whileTap={start >= latestNews.length - cardsVisible ? {} : "tap"}
//           >
//             <ChevronRight size={20} className="sm:w-6 sm:h-6" />
//           </motion.button>
//         </div>

//         {/* Pagination Dots */}
//         {maxDots > 1 && (
//           <motion.div
//             className="flex justify-center gap-2 mt-6 sm:mt-8"
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//           >
//             {Array.from({ length: maxDots }).map((_, idx) => (
//               <motion.button
//                 key={idx}
//                 onClick={() => setStart(idx)}
//                 className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300
//                          hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#1976D2]/30"
//                 variants={dotVariants}
//                 animate={idx === start ? "active" : "inactive"}
//                 whileHover={{ scale: 1.3 }}
//                 whileTap={{ scale: 0.9 }}
//                 aria-label={`Go to slide ${idx + 1}`}
//               />
//             ))}
//           </motion.div>
//         )}
//       </motion.div>
//     </motion.section>
//   );
// };

// export default LatestNewsSection;
