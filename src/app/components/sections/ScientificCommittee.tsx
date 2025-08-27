"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "../common/SectionHeader";
import { Button } from "../common/Button";

// Type definitions
interface ScientificCommitteeMember {
  name: string;
  image: string;
  desc: string; // This maps to "title" in your original component
}

interface ScientificCommitteeData {
  name: string;
  data: ScientificCommitteeMember[];
}

interface ScientificCommitteeProps {
  scientificCommittee: ScientificCommitteeData[];
}

const VISIBLE = 5; // Number of cards visible at once

const ScientificCommittee: React.FC<ScientificCommitteeProps> = ({
  scientificCommittee,
}) => {
  // Get the first committee's data, or use empty array as fallback
  const members = scientificCommittee[0]?.data || [];
  const [activeIndex, setActiveIndex] = useState(2); // Start with middle card active

  // If no members, don't render the component
  if (members.length === 0) {
    return null;
  }

  // Ensure activeIndex is valid for the current members array
  const validActiveIndex = Math.min(activeIndex, members.length - 1);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : members.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < members.length - 1 ? prev + 1 : 0));
  };

  // Calculate visible cards around the active card
  const getVisibleCards = () => {
    const cards = [];
    const halfVisible = Math.floor(VISIBLE / 2);

    for (let i = -halfVisible; i <= halfVisible; i++) {
      let index = validActiveIndex + i;

      // Handle wrapping for infinite scroll effect
      if (index < 0) index = members.length + index;
      if (index >= members.length) index = index - members.length;

      cards.push({
        member: members[index],
        originalIndex: index,
        position: i,
        isActive: i === 0,
      });
    }

    return cards;
  };

  const visibleCards = getVisibleCards();

  return (
    <section className="w-full bg-white py-10 px-2 md:px-0">
      <SectionHeader
        primaryText="DaleelFM Scientific"
        secondaryText="Committee"
        className="mb-8 md:mb-10"
      />

      <div className="relative flex justify-center items-center w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-center">
          {visibleCards.map((card, idx) => {
            const { member, position, isActive } = card;

            // Determine spacing - more space around active card
            let marginClass = "";
            if (position === -1) marginClass = "mr-12"; // Left adjacent card
            else if (position === 1)
              marginClass = "ml-12"; // Right adjacent card
            else if (position === -2) marginClass = "mr-4"; // Far left card
            else if (position === 2) marginClass = "ml-4"; // Far right card
            else if (position === 0) marginClass = "mx-8"; // Active card

            return (
              <div
                key={`${member.name}-${idx}`}
                className={`relative flex items-center ${marginClass}`}
              >
                {/* Left Arrow - shows only for the card immediately left of active */}
                {position === -1 && (
                  <button
                    className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={handlePrev}
                    aria-label="Previous member"
                  >
                    <ChevronLeft size={16} />
                  </button>
                )}

                {/* Card */}
                <div
                  className={`flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-[#F3F8FE] shadow-lg scale-105 w-48 h-64"
                      : "bg-[#F3F8FE] opacity-70 w-40 h-56"
                  }`}
                >
                  {/* Member Image */}
                  <div
                    className={`flex items-center justify-center rounded-full bg-[#B5E2DD] mb-4 overflow-hidden ${
                      isActive ? "w-24 h-24" : "w-16 h-16"
                    }`}
                  >
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to colored circle if image fails to load
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#B5E2DD]" />
                    )}
                  </div>

                  {/* Member Name */}
                  <div
                    className={`text-center font-bold ${
                      isActive
                        ? "text-lg md:text-xl text-[#1A345A]"
                        : "text-base text-[#1A345A]"
                    }`}
                  >
                    {member.name}
                  </div>

                  {/* Member Title/Description */}
                  <div
                    className={`text-center mt-1 px-2 ${
                      isActive
                        ? "text-[#009688] text-sm md:text-base font-semibold"
                        : "text-[#009688] text-xs"
                    }`}
                  >
                    {member.desc}
                  </div>
                </div>

                {/* Right Arrow - shows only for the card immediately right of active */}
                {position === 1 && (
                  <button
                    className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={handleNext}
                    aria-label="Next member"
                  >
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-1 mt-6">
        {members.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              idx === validActiveIndex ? "bg-[#1976D2]" : "bg-[#C7E2F6]"
            }`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          className="text-white rounded-full px-8 py-3 text-base font-normal shadow-none hover:brightness-110"
          size="lg"
        >
          Full DaleelFM Scientific Committee
        </Button>
      </div>
    </section>
  );
};

export default ScientificCommittee;

// "use client";
// import { useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import SectionHeader from "../common/SectionHeader";
// import { Button } from "../common/Button";

// const members = [
//   { name: "Dr. Doctor Name1", title: "Doctor title Doctor title" },
//   { name: "Dr. Doctor Name2", title: "Doctor title Doctor title" },
//   { name: "Dr. Doctor Name3", title: "Doctor title Doctor title" },
//   { name: "Dr. Doctor Name4", title: "Doctor title Doctor title" },
//   { name: "Dr. Doctor Name", title: "Doctor title Doctor title" },
//   { name: "Dr. Doctor Name", title: "Doctor title Doctor title" },
//   { name: "Dr. Doctor Name", title: "Doctor title Doctor title" },
// ];

// const VISIBLE = 5; // Number of cards visible at once

// const ScientificCommittee = () => {
//   const [activeIndex, setActiveIndex] = useState(2); // Start with middle card active

//   const handlePrev = () => {
//     setActiveIndex((prev) => (prev > 0 ? prev - 1 : members.length - 1));
//   };

//   const handleNext = () => {
//     setActiveIndex((prev) => (prev < members.length - 1 ? prev + 1 : 0));
//   };

//   // Calculate visible cards around the active card
//   const getVisibleCards = () => {
//     const cards = [];
//     const halfVisible = Math.floor(VISIBLE / 2);

//     for (let i = -halfVisible; i <= halfVisible; i++) {
//       let index = activeIndex + i;

//       // Handle wrapping for infinite scroll effect
//       if (index < 0) index = members.length + index;
//       if (index >= members.length) index = index - members.length;

//       cards.push({
//         member: members[index],
//         originalIndex: index,
//         position: i,
//         isActive: i === 0,
//       });
//     }

//     return cards;
//   };

//   const visibleCards = getVisibleCards();

//   return (
//     <section className="w-full bg-white py-10 px-2 md:px-0">
//       <SectionHeader
//         primaryText="DaleelFM Scientific"
//         secondaryText="Committee"
//         className="mb-8 md:mb-10"
//       />

//       <div className="relative flex justify-center items-center w-full max-w-7xl mx-auto">
//         <div className="flex items-center justify-center">
//           {visibleCards.map((card, idx) => {
//             const { member, position, isActive } = card;

//             // Determine spacing - more space around active card
//             let marginClass = "";
//             if (position === -1) marginClass = "mr-12"; // Left adjacent card
//             else if (position === 1)
//               marginClass = "ml-12"; // Right adjacent card
//             else if (position === -2) marginClass = "mr-4"; // Far left card
//             else if (position === 2) marginClass = "ml-4"; // Far right card
//             else if (position === 0) marginClass = "mx-8"; // Active card

//             return (
//               <div
//                 key={idx}
//                 className={`relative flex items-center ${marginClass}`}
//               >
//                 {/* Left Arrow - shows only for the card immediately left of active */}
//                 {position === -1 && (
//                   <button
//                     className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
//                     onClick={handlePrev}
//                   >
//                     <ChevronLeft size={16} />
//                   </button>
//                 )}

//                 {/* Card */}
//                 <div
//                   className={`flex flex-col items-center justify-center rounded-2xl transition-all duration-300 ${
//                     isActive
//                       ? "bg-[#F3F8FE] shadow-lg scale-105 w-48 h-64"
//                       : "bg-[#F3F8FE] opacity-70 w-40 h-56"
//                   }`}
//                 >
//                   <div
//                     className={`flex items-center justify-center rounded-full bg-[#B5E2DD] mb-4 ${
//                       isActive ? "w-24 h-24" : "w-16 h-16"
//                     }`}
//                   />
//                   <div
//                     className={`text-center font-bold ${
//                       isActive
//                         ? "text-lg md:text-xl text-[#1A345A]"
//                         : "text-base text-[#1A345A]"
//                     }`}
//                   >
//                     {member.name}
//                   </div>
//                   <div
//                     className={`text-center mt-1 px-2 ${
//                       isActive
//                         ? "text-[#009688] text-sm md:text-base font-semibold"
//                         : "text-[#009688] text-xs"
//                     }`}
//                   >
//                     {member.title}
//                   </div>
//                 </div>

//                 {/* Right Arrow - shows only for the card immediately right of active */}
//                 {position === 1 && (
//                   <button
//                     className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
//                     onClick={handleNext}
//                   >
//                     <ChevronRight size={16} />
//                   </button>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Dots Navigation */}
//       <div className="flex justify-center gap-1 mt-6">
//         {members.map((_, idx) => (
//           <button
//             key={idx}
//             className={`w-2 h-2 rounded-full transition-all duration-200 ${
//               idx === activeIndex ? "bg-[#1976D2]" : "bg-[#C7E2F6]"
//             }`}
//             onClick={() => setActiveIndex(idx)}
//             aria-label={`Go to slide ${idx + 1}`}
//           />
//         ))}
//       </div>

//       <div className="flex justify-center mt-8">
//         <Button
//           className="text-white rounded-full px-8 py-3 text-base font-normal shadow-none hover:brightness-110"
//           size="lg"
//         >
//           Full DaleelFM Scientific Committee
//         </Button>
//       </div>
//     </section>
//   );
// };

// export default ScientificCommittee;
