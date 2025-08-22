"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Bell, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/common/Button";
import PageHeader from "@/app/components/common/PageHeader";

const ArticlesPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Reusable Header - WITH search */}
      <PageHeader
        title="Articles Sections"
        description="Browse Articles Sections of DaleelFM"
        iconSrc="/icons/articles-icon.svg"
        iconAlt="Articles Icon"
      />

      {/* Cards Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24">
            {/* Articles Summaries Card */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              className="group"
            >
              <motion.div
                variants={cardHoverVariants}
                className="relative h-full"
              >
                {/* Card Background with Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-[2px]">
                  <div className="h-full bg-white rounded-3xl" />
                </div>

                {/* Card Content */}
                <div className="relative h-full p-8 sm:p-10 lg:p-12 flex flex-col">
                  {/* Icon */}
                  <motion.div
                    variants={iconVariants}
                    className="mb-8 flex justify-center lg:justify-start"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                      <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                      Articles Summaries
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      Discover comprehensive summaries of the latest medical
                      articles, research papers, and clinical studies in family
                      medicine.
                    </p>
                  </div>

                  {/* Button */}
                  <div className="flex justify-center lg:justify-start">
                    <Button
                      variant="default"
                      size="lg"
                      rightIcon={
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      }
                      className="group-hover:shadow-2xl group-hover:shadow-blue-500/25 transition-shadow duration-300"
                    >
                      View all articles
                    </Button>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                </div>
              </motion.div>
            </motion.div>

            {/* Articles Alert Card */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              className="group"
            >
              <motion.div
                variants={cardHoverVariants}
                className="relative h-full"
              >
                {/* Card Background with Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-[2px]">
                  <div className="h-full bg-white rounded-3xl" />
                </div>

                {/* Card Content */}
                <div className="relative h-full p-8 sm:p-10 lg:p-12 flex flex-col">
                  {/* Icon */}
                  <motion.div
                    variants={iconVariants}
                    className="mb-8 flex justify-center lg:justify-start"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                      <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
                        <Bell className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                      Articles Alert
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      Stay updated with real-time notifications about new
                      publications, breaking medical news, and important updates
                      in your field.
                    </p>
                  </div>

                  {/* Button */}
                  <div className="flex justify-center lg:justify-start">
                    <Button
                      variant="secondary"
                      size="lg"
                      rightIcon={
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                          }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      }
                      className="group-hover:shadow-2xl group-hover:shadow-emerald-500/25 transition-shadow duration-300"
                    >
                      View all article alerts
                    </Button>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-300" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ArticlesPage;

// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import {
//   FileText,
//   Bell,
//   ArrowRight,
//   BookOpen,
//   Target,
//   Search,
// } from "lucide-react";
// import { Button } from "@/app/components/common/Button";

// const ArticlesPage = () => {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//         delayChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         ease: "easeOut",
//       },
//     },
//   };

//   const cardHoverVariants = {
//     hover: {
//       y: -8,
//       scale: 1.02,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 20,
//       },
//     },
//   };

//   const iconVariants = {
//     hover: {
//       scale: 1.1,
//       rotate: [0, -10, 10, 0],
//       transition: {
//         duration: 0.5,
//         ease: "easeInOut",
//       },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
//       {/* Hero Section */}
//       <motion.section
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="w-full ml-8 sm:ml-12 lg:ml-16" // Added left margin
//       >
//         <div className="relative overflow-hidden bg-gradient-to-r from-[#136fb7] to-[#0a2c75] rounded-l-[4rem] sm:rounded-l-[5rem] lg:rounded-l-[6rem]">
//           {/* Subtle animated background */}
//           <div className="absolute inset-0 opacity-5">
//             <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
//             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-pulse delay-1000" />
//           </div>

//           <div className="relative px-8 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-18">
//             <motion.div
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               className="flex flex-col lg:flex-row items-center max-w-7xl pr-8 sm:pr-12 lg:pr-16"
//             >
//               {/* Image Container */}
//               <motion.div variants={itemVariants} className="flex-shrink-0">
//                 <div className="relative">
//                   {/* <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 rounded-2xl blur-md" /> */}
//                   {/* <div className="relative bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl shadow-xl"> */}
//                   <img
//                     src="/icons/articles-icon.svg"
//                     alt="Articles Icon"
//                     className="w-full h-full  object-contain filter brightness-0 invert"
//                   />
//                   {/* </div> */}
//                 </div>
//               </motion.div>

//               {/* Content */}
//               <motion.div
//                 variants={itemVariants}
//                 className="text-center lg:text-left flex-1"
//               >
//                 <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 lg:mb-4 leading-tight">
//                   Articles Sections
//                 </h1>
//                 <p className="text-lg sm:text-xl text-blue-100/80 font-medium mb-8">
//                   Browse Articles Sections of DaleelFM
//                 </p>
//               </motion.div>

//               {/* Search Input - Right Side */}
//               <motion.div
//                 variants={itemVariants}
//                 className="flex-shrink-0 lg:ml-8"
//               >
//                 <div className="bg-white rounded-full flex items-center overflow-hidden shadow-lg max-w-md">
//                   <div className="flex items-center flex-1">
//                     <div className="pl-4 flex items-center pointer-events-none">
//                       <Search className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       placeholder="Search in Articles"
//                       className="flex-1 px-3 py-3 text-gray-700 focus:outline-none bg-transparent min-w-0"
//                     />
//                   </div>
//                   <button
//                     className="px-8 py-3 m-1 font-semibold text-white transition-colors rounded-full"
//                     style={{ backgroundColor: "#136FB7" }}
//                   >
//                     Search
//                   </button>
//                 </div>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </motion.section>

//       {/* Cards Section */}
//       <motion.section
//         variants={containerVariants}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, margin: "-100px" }}
//         className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24"
//       >
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24">
//             {/* Articles Summaries Card */}
//             <motion.div
//               variants={itemVariants}
//               whileHover="hover"
//               className="group"
//             >
//               <motion.div
//                 variants={cardHoverVariants}
//                 className="relative h-full"
//               >
//                 {/* Card Background with Gradient Border */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-[2px]">
//                   <div className="h-full bg-white rounded-3xl" />
//                 </div>

//                 {/* Card Content */}
//                 <div className="relative h-full p-8 sm:p-10 lg:p-12 flex flex-col">
//                   {/* Icon */}
//                   <motion.div
//                     variants={iconVariants}
//                     className="mb-8 flex justify-center lg:justify-start"
//                   >
//                     <div className="relative">
//                       <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
//                       <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg">
//                         <FileText className="w-8 h-8 text-white" />
//                       </div>
//                     </div>
//                   </motion.div>

//                   {/* Content */}
//                   <div className="flex-1 text-center lg:text-left">
//                     <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
//                       Articles Summaries
//                     </h2>
//                     <p className="text-gray-600 text-lg mb-8 leading-relaxed">
//                       Discover comprehensive summaries of the latest medical
//                       articles, research papers, and clinical studies in family
//                       medicine.
//                     </p>
//                   </div>

//                   {/* Button */}
//                   <div className="flex justify-center lg:justify-start">
//                     <Button
//                       variant="default"
//                       size="lg"
//                       rightIcon={
//                         <motion.div
//                           animate={{ x: [0, 4, 0] }}
//                           transition={{
//                             duration: 1.5,
//                             repeat: Infinity,
//                             ease: "easeInOut",
//                           }}
//                         >
//                           <ArrowRight className="w-5 h-5" />
//                         </motion.div>
//                       }
//                       className="group-hover:shadow-2xl group-hover:shadow-blue-500/25 transition-shadow duration-300"
//                     >
//                       View all articles
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Floating Elements */}
//                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
//                 </div>
//               </motion.div>
//             </motion.div>

//             {/* Articles Alert Card */}
//             <motion.div
//               variants={itemVariants}
//               whileHover="hover"
//               className="group"
//             >
//               <motion.div
//                 variants={cardHoverVariants}
//                 className="relative h-full"
//               >
//                 {/* Card Background with Gradient Border */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-[2px]">
//                   <div className="h-full bg-white rounded-3xl" />
//                 </div>

//                 {/* Card Content */}
//                 <div className="relative h-full p-8 sm:p-10 lg:p-12 flex flex-col">
//                   {/* Icon */}
//                   <motion.div
//                     variants={iconVariants}
//                     className="mb-8 flex justify-center lg:justify-start"
//                   >
//                     <div className="relative">
//                       <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
//                       <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
//                         <Bell className="w-8 h-8 text-white" />
//                       </div>
//                     </div>
//                   </motion.div>

//                   {/* Content */}
//                   <div className="flex-1 text-center lg:text-left">
//                     <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
//                       Articles Alert
//                     </h2>
//                     <p className="text-gray-600 text-lg mb-8 leading-relaxed">
//                       Stay updated with real-time notifications about new
//                       publications, breaking medical news, and important updates
//                       in your field.
//                     </p>
//                   </div>

//                   {/* Button */}
//                   <div className="flex justify-center lg:justify-start">
//                     <Button
//                       variant="secondary"
//                       size="lg"
//                       rightIcon={
//                         <motion.div
//                           animate={{ x: [0, 4, 0] }}
//                           transition={{
//                             duration: 1.5,
//                             repeat: Infinity,
//                             ease: "easeInOut",
//                             delay: 0.5,
//                           }}
//                         >
//                           <ArrowRight className="w-5 h-5" />
//                         </motion.div>
//                       }
//                       className="group-hover:shadow-2xl group-hover:shadow-emerald-500/25 transition-shadow duration-300"
//                     >
//                       View all article alerts
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Floating Elements */}
//                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-300" />
//                 </div>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </motion.section>
//     </div>
//   );
// };

// export default ArticlesPage;
