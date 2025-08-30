"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  HelpCircle,
  Activity,
  Presentation,
  Video,
  Image,
  Shield,
  Calendar,
  CreditCard,
} from "lucide-react";
import SectionHeader from "../common/SectionHeader";
import { ROUTES } from "@/app/constants/routes";

interface Section {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DaleelSections: React.FC = () => {
  const params = useParams();
  const lang = params?.lang || "en";

  // Helper function to create localized routes
  const getLocalizedRoute = (route: string) => {
    if (route === "/") {
      return `/${lang}`;
    }
    return `/${lang}${route}`;
  };

  // Main sections matching the Figma design
  const sections: Section[] = [
    {
      label: "The Book",
      href: getLocalizedRoute(ROUTES.THE_ESSENTIALS),
      icon: BookOpen,
    },
    {
      label: "Articles",
      href: getLocalizedRoute(ROUTES.NEW_ARTICLES),
      icon: FileText,
    },
    {
      label: "MCQs",
      href: getLocalizedRoute(ROUTES.MCQS),
      icon: HelpCircle,
    },
    {
      label: "Protocols",
      href: getLocalizedRoute(ROUTES.PROTOCOLS),
      icon: Activity,
    },
    {
      label: "PowerPoints",
      href: getLocalizedRoute(ROUTES.POWER_POINTS),
      icon: Presentation,
    },
    {
      label: "Lectures",
      href: getLocalizedRoute(ROUTES.LECTURES),
      icon: Video,
    },
    {
      label: "Pictionary",
      href: getLocalizedRoute(ROUTES.PICTIONARY),
      icon: Image,
    },
    {
      label: "Policies",
      href: getLocalizedRoute(ROUTES.POLICIES),
      icon: Shield,
    },
    {
      label: "Events",
      href: getLocalizedRoute(ROUTES.EVENTS),
      icon: Calendar,
    },
    {
      label: "Flashcards",
      href: getLocalizedRoute(ROUTES.FLASHCARDS),
      icon: CreditCard,
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: 0.1 + i * 0.07, duration: 0.5, type: "spring" },
    }),
  };

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          primaryText="DaleelFM"
          secondaryText="Sections"
          className="mb-10"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-8 sm:gap-x-8 sm:gap-y-10"
        >
          {sections.map((section, i) => {
            const IconComponent = section.icon;

            return (
              <motion.div
                key={section.href}
                custom={i}
                variants={itemVariants}
                className="flex flex-col items-center group cursor-pointer"
              >
                <Link
                  href={section.href}
                  className="flex flex-col items-center text-center space-y-3 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Circular Icon Container - matching Figma design */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300"
                    style={{
                      backgroundColor: "#6497E238",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#03847D3D";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#6497E238";
                    }}
                  >
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-[#136FB7] group-hover:text-[#03847D] transition-colors duration-300" />
                  </motion.div>

                  {/* Section Label */}
                  <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-[#136FB7] transition-colors duration-300">
                    {section.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default DaleelSections;

// "use client";
// import React from "react";
// import SectionHeader from "../common/SectionHeader";
// import { motion } from "framer-motion";
// import CustomSvg from "../common/CustomSvg";

// // Assuming you will paste the bookSvgCode from the previous message here
// const bookSvgCode = `
// <svg width="65" height="84" viewBox="0 0 65 84" fill="none" xmlns="http://www.w3.org/2000/svg">
// <g clip-path="url(#clip0_310_173)">
// <path d="M0.743164 41.9771C0.743164 31.464 0.743164 20.9509 0.743164 10.4377C0.743164 5.37722 3.79867 1.43713 8.5496 0.316723C9.35074 0.129988 10.2078 0.0366211 11.0462 0.0366211C25.3362 0.0366211 39.6449 0.0366211 53.935 0.0366211C59.9342 0.0366211 64.2566 4.38753 64.2753 10.4004C64.2753 25.6566 64.2753 40.9128 64.2753 56.169C64.2753 60.8186 62.0582 64.0678 57.7916 65.8791C57.3072 66.0845 57.2327 66.346 57.2327 66.7941C57.2327 69.035 57.2327 71.2758 57.2327 73.5166C57.2141 79.4921 52.8358 83.8803 46.8738 83.899C34.9685 83.899 23.0446 83.899 11.1393 83.899C5.10285 83.899 0.761795 79.5668 0.743164 73.4979C0.743164 62.9848 0.743164 52.4716 0.743164 41.9585L0.743164 41.9771ZM19.691 2.83764V63.7504C20.0264 63.7504 20.3058 63.7877 20.5853 63.7877C31.6522 63.7877 42.7191 63.7877 53.786 63.7877C58.3692 63.7877 61.462 60.7066 61.462 56.1316C61.462 40.9128 61.462 25.6752 61.462 10.4564C61.462 9.89619 61.462 9.33599 61.3502 8.81313C60.6608 5.24651 57.7358 2.87498 54.0095 2.85631C42.8495 2.85631 31.7081 2.85631 20.548 2.85631C20.2872 2.85631 20.0264 2.85631 19.691 2.85631V2.83764ZM16.7846 63.7877V2.83764C14.8842 2.83764 13.0583 2.83764 11.2325 2.83764C6.59334 2.83764 3.53783 5.88141 3.53783 10.5498C3.53783 28.9804 3.53783 47.4111 3.53783 65.8418C3.53783 66.1219 3.57509 66.3833 3.59373 66.7008C7.22679 64.0118 7.97204 63.7691 12.4994 63.7691H16.7846V63.7877ZM54.2704 66.5701C54.0095 66.5701 53.6742 66.5701 53.3202 66.5701C46.4639 66.5701 39.6077 66.5701 32.7701 66.5701C25.3735 66.5701 17.9583 66.5327 10.5618 66.5887C6.64923 66.6261 3.55646 69.8753 3.55646 73.7967C3.55646 77.7554 6.66786 81.0606 10.6177 81.0606C22.8769 81.098 35.1176 81.098 47.3769 81.0606C50.9354 81.0606 53.9909 78.353 54.3076 74.8237C54.5498 72.1347 54.4008 69.4271 54.4194 66.7195C54.4194 66.7008 54.3822 66.6821 54.289 66.5514L54.2704 66.5701Z" fill="#03847D"/>
// <path d="M40.5019 12.9214C44.3399 12.9214 48.1593 12.9214 51.9973 12.9214C53.4878 12.9214 53.8977 13.3509 53.8977 14.8447C53.8977 19.7559 53.8977 24.6857 53.8977 29.5968C53.8977 31.0906 53.4691 31.5388 51.9787 31.5388C44.3213 31.5388 36.6452 31.5388 28.9879 31.5388C27.4601 31.5388 27.0688 31.1467 27.0688 29.6528C27.0688 24.7043 27.0688 19.7559 27.0688 14.8074C27.0688 13.3135 27.4787 12.9214 29.0065 12.9214C32.8445 12.9214 36.6639 12.9214 40.5019 12.9214ZM51.0657 15.7784H29.9194V28.7004H51.0657V15.7784Z" fill="#03847D"/>
// <path d="M40.4275 43.7324C43.6506 43.7324 46.8738 43.7324 50.097 43.7324C50.4324 43.7324 50.805 43.7511 51.1217 43.8818C51.7365 44.1246 52.1092 44.6661 51.9042 45.2636C51.7365 45.7305 51.2521 46.1226 50.8422 46.4774C50.7118 46.5895 50.3951 46.5334 50.1715 46.5334C43.7065 46.5334 37.2229 46.5334 30.7579 46.5334C30.348 46.5334 29.8822 46.4401 29.5282 46.216C28.9693 45.8799 28.8575 45.2636 29.0811 44.6661C29.3233 43.9752 29.9009 43.7324 30.6089 43.7324C33.8879 43.7324 37.167 43.7324 40.4461 43.7324H40.4275Z" fill="#03847D"/>
// <path d="M40.4831 39.6244C37.2413 39.6244 33.9808 39.6244 30.739 39.6244C29.6212 39.6244 29.0622 39.1762 29.0063 38.3359C28.9504 37.6077 29.379 37.0288 30.1056 36.8981C30.4223 36.842 30.739 36.842 31.0558 36.842C37.3158 36.842 43.5945 36.842 49.8546 36.842C51.2892 36.842 51.9599 37.2715 51.9599 38.2239C51.9599 39.1762 51.2892 39.6431 49.8918 39.6431C46.7618 39.6431 43.6318 39.6431 40.4831 39.6431V39.6244Z" fill="#03847D"/>
// </g>
// <defs>
// <clipPath id="clip0_310_173">
// <rect width="63.5321" height="83.8624" fill="white" transform="translate(0.743164 0.0366211)"/>
// </clipPath>
// </defs>
// </svg>
// `;

// const sections = [
//   { label: "The Book", svgCode: bookSvgCode },
//   { label: "Articles", svgCode: bookSvgCode }, // Replace with appropriate SVG code
//   { label: "MCQs", svgCode: bookSvgCode }, // Replace with appropriate SVG code
//   { label: "Protocols", svgCode: bookSvgCode }, // Replace with appropriate SVG code
//   { label: "PowerPoints", svgCode: bookSvgCode }, // Replace with appropriate SVG code
//   { label: "Lectures", svgCode: bookSvgCode }, // Replace with appropriate SVG code
//   { label: "Pictionary", svgCode: bookSvgCode }, // Replace with appropriate SVG code
//   { label: "Policies", svgCode: bookSvgCode }, // Replace with appropriate SVG code
//   { label: "Events", svgCode: bookSvgCode }, // Replace with appropriate SVG code
//   { label: "Flashcards", svgCode: bookSvgCode }, // Replace with appropriate SVG code
// ];

// const itemVariants = {
//   hidden: { opacity: 0, y: 30, scale: 0.95 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { delay: 0.1 + i * 0.07, duration: 0.5, type: "spring" },
//   }),
// };

// const DaleelSections: React.FC = () => (
//   <section className="w-full bg-white py-10 px-2 md:px-0">
//     <SectionHeader
//       primaryText="DaleelFM"
//       secondaryText="Sections"
//       className="mb-8"
//     />
//     <motion.div
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true }}
//       className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-8 gap-x-4 max-w-4xl mx-auto"
//     >
//       {sections.map((section, i) => (
//         <motion.div
//           key={section.label}
//           custom={i}
//           variants={itemVariants}
//           className="flex flex-col items-center group cursor-pointer"
//         >
//           <div
//             className={`flex items-center justify-center w-20 h-20 rounded-full mb-3 transition-all duration-300
//               bg-[#E6F0FA] group-hover:bg-[#B5E2DD]/60
//               group-hover:scale-105`}
//           >
//             <CustomSvg
//               svgCode={section.svgCode}
//               size={44}
//               color="#136FB7"
//               hoverColor="#03847D"
//               className="transition-all duration-300"
//             />
//           </div>
//           <span
//             className={`text-[17px] font-medium transition-colors duration-300
//               text-primary group-hover:text-secondary`}
//           >
//             {section.label}
//           </span>
//         </motion.div>
//       ))}
//     </motion.div>
//   </section>
// );

// export default DaleelSections;
