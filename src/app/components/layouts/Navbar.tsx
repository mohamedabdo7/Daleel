"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../common/Button";
import { ROUTES } from "@/app/constants/routes";
import { SimpleLogoutButton } from "@/app/[locale]/(main)/login/components/ogout-button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const params = useParams();
  const lang = params?.lang || "en"; // Get current language from URL params

  // Helper function to create localized routes
  const getLocalizedRoute = (route: string) => {
    if (route === "/") {
      return `/${lang}`;
    }
    return `/${lang}${route}`;
  };

  const navLinks = [
    { href: getLocalizedRoute(ROUTES.THE_ESSENTIALS), label: "The Essential" },
    { href: getLocalizedRoute(ROUTES.THE_HANDBOOK), label: "The Handbook" },
    { href: getLocalizedRoute(ROUTES.NEW_ARTICLES), label: "Articles" },
    { href: getLocalizedRoute(ROUTES.POWER_POINTS), label: "Power Points" },
    { href: getLocalizedRoute(ROUTES.PROTOCOLS), label: "Protocols" },
  ];

  // More dropdown links using ROUTES constants
  const moreLinks = [
    { href: getLocalizedRoute(ROUTES.MCQS), label: "MCQs" },
    { href: getLocalizedRoute(ROUTES.FAME_25), label: "FAME 25" },
    { href: getLocalizedRoute(ROUTES.PRIVACY_POLICY), label: "Privacy policy" },
    { href: getLocalizedRoute(ROUTES.LECTURES), label: "Lectures" },
    { href: getLocalizedRoute(ROUTES.PICTIONARY), label: "Pictionary" },
    { href: getLocalizedRoute(ROUTES.POLICIES), label: "Policies" },
    { href: getLocalizedRoute(ROUTES.EVENTS), label: "Events" },
    {
      href: getLocalizedRoute(ROUTES.URGENT_CARE_MANUAL),
      label: "Urgent Care Manual",
    },
    {
      href: getLocalizedRoute(ROUTES.PHC_ANTIMICROBIAL_MANUAL),
      label: "PHC Antimicrobial Manual",
    },
    { href: getLocalizedRoute(ROUTES.FLASHCARDS), label: "Flashcards" },
    { href: getLocalizedRoute(ROUTES.ABOUT_US), label: "About Us" },
    {
      href: getLocalizedRoute(ROUTES.VOLUNTEERS_AUTHORS),
      label: "Volunteers / Authors D3",
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scroll when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  };

  const toggleMoreDropdown = () => setIsMoreDropdownOpen(!isMoreDropdownOpen);

  // Cleanup function to reset body overflow when component unmounts
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Close menu and reset body scroll when menu closes
  React.useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <SimpleLogoutButton />
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href={getLocalizedRoute(ROUTES.HOME)}
                className="flex items-center space-x-3"
              >
                <motion.img
                  src="/icons/logo.svg"
                  alt="GuideMe Logo"
                  className="h-8 lg:h-10 w-auto"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  whileHover={{
                    scale: 1.05,
                    rotate: [0, -2, 2, 0],
                    transition: {
                      scale: { duration: 0.2 },
                      rotate: { duration: 0.6, ease: "easeInOut" },
                    },
                  }}
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <Link
                    href={link.href}
                    className="relative px-4 py-2 rounded-lg transition-all duration-300 group"
                  >
                    <span className="relative z-10 text-primary group-hover:text-primary transition-colors duration-300 font-medium">
                      {link.label}
                    </span>
                    {/* Modern animated underline */}
                    <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 w-0 h-0.5 bg-primary group-hover:w-8 rounded-full transition-all duration-300"></span>
                  </Link>
                </motion.div>
              ))}

              {/* More Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="relative"
              >
                <motion.button
                  onClick={toggleMoreDropdown}
                  className="relative px-4 py-2 rounded-lg transition-all duration-300 group flex items-center space-x-1"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="relative z-10 text-primary group-hover:text-primary transition-colors duration-300 font-medium">
                    More
                  </span>
                  <motion.svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: isMoreDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                  <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 w-0 h-0.5 bg-primary group-hover:w-8 rounded-full transition-all duration-300"></span>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isMoreDropdownOpen && (
                    <>
                      {/* Backdrop for dropdown */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsMoreDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20"
                      >
                        <div className="max-h-80 overflow-y-auto">
                          {moreLinks.map((link, index) => (
                            <motion.div
                              key={link.href}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: index * 0.05,
                                duration: 0.2,
                              }}
                            >
                              <Link
                                href={link.href}
                                onClick={() => setIsMoreDropdownOpen(false)}
                                className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
                              >
                                {link.label}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Login & Sign Up Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button variant="default" size="md" className="w-[150px]">
                  Login
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button variant="secondary" size="md" className="w-[150px]">
                  Sign up
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <motion.button
                onClick={toggleMenu}
                className="relative p-2 text-gray-700 hover:text-[#1D4671] transition-colors duration-300 rounded-lg hover:bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={isMenuOpen ? "open" : "closed"}
                  className="w-6 h-6 flex flex-col justify-center items-center"
                >
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 6 },
                    }}
                    className="w-6 h-0.5 bg-current block absolute"
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 },
                    }}
                    className="w-6 h-0.5 bg-current block absolute"
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -6 },
                    }}
                    className="w-6 h-0.5 bg-current block absolute"
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl border-l border-gray-200 z-50 lg:hidden flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <motion.img
                    src="/icons/logo.svg"
                    alt="GuideMe Logo"
                    className="h-6 w-auto"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2,
                      ease: "easeOut",
                    }}
                  />
                </div>
                <motion.button
                  onClick={toggleMenu}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto">
                {/* Mobile Menu Links */}
                <div className="px-6 py-8 space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={toggleMenu}
                        className="group block px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gray-100"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 group-hover:text-[#1D4671] transition-colors duration-300 font-medium text-lg">
                            {link.label}
                          </span>
                          <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            whileHover={{ x: 0, opacity: 1 }}
                            className="text-primary"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </motion.div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}

                  {/* More Links Section in Mobile */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1, duration: 0.3 }}
                    className="pt-4"
                  >
                    <div className="mb-3 px-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        More
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {moreLinks.map((link, index) => (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: navLinks.length * 0.1 + index * 0.05,
                            duration: 0.2,
                          }}
                        >
                          <Link
                            href={link.href}
                            onClick={toggleMenu}
                            className="block px-4 py-2 text-gray-600 hover:text-[#1D4671] hover:bg-gray-50 rounded-lg transition-colors duration-200"
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Mobile Auth Buttons - Fixed at bottom */}
              <div className="flex-shrink-0 p-6 space-y-3 border-t border-gray-200 bg-gray-50">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <Button variant="default" size="lg" fullWidth>
                    Login
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  <Button variant="secondary" size="lg" fullWidth>
                    Sign up
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "../common/Button";
// import { ROUTES } from "@/app/constants/routes";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
//   const params = useParams();
//   const lang = params?.lang || "en"; // Get current language from URL params

//   // Helper function to create localized routes
//   const getLocalizedRoute = (route: string) => {
//     if (route === "/") {
//       return `/${lang}`;
//     }
//     return `/${lang}${route}`;
//   };

//   const navLinks = [
//     { href: getLocalizedRoute(ROUTES.THE_ESSENTIALS), label: "The Essential" },
//     { href: getLocalizedRoute(ROUTES.THE_HANDBOOK), label: "The Handbook" },
//     { href: getLocalizedRoute(ROUTES.NEW_ARTICLES), label: "Articles" },
//     { href: getLocalizedRoute(ROUTES.POWER_POINTS), label: "Power Points" },
//     { href: getLocalizedRoute(ROUTES.PROTOCOLS), label: "Protocols" },
//   ];

//   // More dropdown links
//   const moreLinks = [
//     { href: `/${lang}/mcqs`, label: "MCQs" },
//     { href: `/${lang}/fame-25`, label: "FAME 25" },
//     { href: `/${lang}/privacy-policy`, label: "Privacy policy" },
//     { href: `/${lang}/lectures`, label: "Lectures" },
//     { href: `/${lang}/pictionary`, label: "Pictionary" },
//     { href: `/${lang}/policies`, label: "Policies" },
//     { href: `/${lang}/events`, label: "Events" },
//     { href: `/${lang}/urgent-care-manual`, label: "Urgent Care Manual" },
//     {
//       href: `/${lang}/phc-antimicrobial-manual`,
//       label: "PHC Antimicrobial Manual",
//     },
//     { href: `/${lang}/flashcards`, label: "Flashcards" },
//     { href: `/${lang}/about-us`, label: "About Us" },
//     { href: `/${lang}/volunteers-authors`, label: "Volunteers / Authors D3" },
//   ];

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//     // Prevent body scroll when menu is open
//     if (!isMenuOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }
//   };

//   const toggleMoreDropdown = () => setIsMoreDropdownOpen(!isMoreDropdownOpen);

//   // Cleanup function to reset body overflow when component unmounts
//   React.useEffect(() => {
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, []);

//   // Close menu and reset body scroll when menu closes
//   React.useEffect(() => {
//     if (!isMenuOpen) {
//       document.body.style.overflow = "unset";
//     }
//   }, [isMenuOpen]);

//   return (
//     <>
//       <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16 lg:h-20">
//             {/* Logo */}
//             <motion.div
//               className="flex items-center space-x-3 cursor-pointer"
//               whileHover={{ scale: 1.05 }}
//               transition={{ type: "spring", stiffness: 400, damping: 17 }}
//             >
//               <Link
//                 href={getLocalizedRoute(ROUTES.HOME)}
//                 className="flex items-center space-x-3"
//               >
//                 <motion.img
//                   src="/icons/logo.svg"
//                   alt="GuideMe Logo"
//                   className="h-8 lg:h-10 w-auto"
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.8, ease: "easeOut" }}
//                   whileHover={{
//                     scale: 1.05,
//                     rotate: [0, -2, 2, 0],
//                     transition: {
//                       scale: { duration: 0.2 },
//                       rotate: { duration: 0.6, ease: "easeInOut" },
//                     },
//                   }}
//                 />
//               </Link>
//             </motion.div>

//             {/* Desktop Navigation Links */}
//             <div className="hidden lg:flex items-center space-x-1">
//               {navLinks.map((link, index) => (
//                 <motion.div
//                   key={link.href}
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="relative"
//                 >
//                   <Link
//                     href={link.href}
//                     className="relative px-4 py-2 rounded-lg transition-all duration-300 group"
//                   >
//                     <span className="relative z-10 text-primary group-hover:text-primary transition-colors duration-300 font-medium">
//                       {link.label}
//                     </span>
//                     {/* Modern animated underline */}
//                     <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 w-0 h-0.5 bg-primary group-hover:w-8 rounded-full transition-all duration-300"></span>
//                   </Link>
//                 </motion.div>
//               ))}

//               {/* More Dropdown */}
//               <motion.div
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: navLinks.length * 0.1 }}
//                 className="relative"
//               >
//                 <motion.button
//                   onClick={toggleMoreDropdown}
//                   className="relative px-4 py-2 rounded-lg transition-all duration-300 group flex items-center space-x-1"
//                   whileHover={{ scale: 1.02 }}
//                 >
//                   <span className="relative z-10 text-primary group-hover:text-primary transition-colors duration-300 font-medium">
//                     More
//                   </span>
//                   <motion.svg
//                     className="w-4 h-4 text-primary"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     animate={{ rotate: isMoreDropdownOpen ? 180 : 0 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </motion.svg>
//                   <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 w-0 h-0.5 bg-primary group-hover:w-8 rounded-full transition-all duration-300"></span>
//                 </motion.button>

//                 {/* Dropdown Menu */}
//                 <AnimatePresence>
//                   {isMoreDropdownOpen && (
//                     <>
//                       {/* Backdrop for dropdown */}
//                       <div
//                         className="fixed inset-0 z-10"
//                         onClick={() => setIsMoreDropdownOpen(false)}
//                       />
//                       <motion.div
//                         initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                         transition={{ duration: 0.2 }}
//                         className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20"
//                       >
//                         <div className="max-h-80 overflow-y-auto">
//                           {moreLinks.map((link, index) => (
//                             <motion.div
//                               key={link.href}
//                               initial={{ opacity: 0, x: -10 }}
//                               animate={{ opacity: 1, x: 0 }}
//                               transition={{
//                                 delay: index * 0.05,
//                                 duration: 0.2,
//                               }}
//                             >
//                               <Link
//                                 href={link.href}
//                                 onClick={() => setIsMoreDropdownOpen(false)}
//                                 className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
//                               >
//                                 {link.label}
//                               </Link>
//                             </motion.div>
//                           ))}
//                         </div>
//                       </motion.div>
//                     </>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             </div>

//             {/* Login & Sign Up Buttons */}
//             <div className="hidden lg:flex items-center space-x-3">
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.5, duration: 0.5 }}
//               >
//                 <Button variant="default" size="md" className="w-[150px]">
//                   Login
//                 </Button>
//               </motion.div>
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.6, duration: 0.5 }}
//               >
//                 <Button variant="secondary" size="md" className="w-[150px]">
//                   Sign up
//                 </Button>
//               </motion.div>
//             </div>

//             {/* Mobile Menu Button */}
//             <div className="lg:hidden">
//               <motion.button
//                 onClick={toggleMenu}
//                 className="relative p-2 text-gray-700 hover:text-[#1D4671] transition-colors duration-300 rounded-lg hover:bg-gray-100"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <motion.div
//                   animate={isMenuOpen ? "open" : "closed"}
//                   className="w-6 h-6 flex flex-col justify-center items-center"
//                 >
//                   <motion.span
//                     variants={{
//                       closed: { rotate: 0, y: 0 },
//                       open: { rotate: 45, y: 6 },
//                     }}
//                     className="w-6 h-0.5 bg-current block absolute"
//                     transition={{ duration: 0.3 }}
//                   />
//                   <motion.span
//                     variants={{
//                       closed: { opacity: 1 },
//                       open: { opacity: 0 },
//                     }}
//                     className="w-6 h-0.5 bg-current block absolute"
//                     transition={{ duration: 0.3 }}
//                   />
//                   <motion.span
//                     variants={{
//                       closed: { rotate: 0, y: 0 },
//                       open: { rotate: -45, y: -6 },
//                     }}
//                     className="w-6 h-0.5 bg-current block absolute"
//                     transition={{ duration: 0.3 }}
//                   />
//                 </motion.div>
//               </motion.button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu Overlay */}
//       <AnimatePresence mode="wait">
//         {isMenuOpen && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={toggleMenu}
//               className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
//             />

//             {/* Mobile Menu */}
//             <motion.div
//               initial={{ opacity: 0, x: "100%" }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: "100%" }}
//               transition={{ type: "spring", damping: 25, stiffness: 200 }}
//               className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl border-l border-gray-200 z-50 lg:hidden flex flex-col"
//             >
//               {/* Mobile Menu Header */}
//               <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
//                 <div className="flex items-center space-x-3">
//                   <motion.img
//                     src="/icons/logo.svg"
//                     alt="GuideMe Logo"
//                     className="h-6 w-auto"
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{
//                       duration: 0.5,
//                       delay: 0.2,
//                       ease: "easeOut",
//                     }}
//                   />
//                 </div>
//                 <motion.button
//                   onClick={toggleMenu}
//                   className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </motion.button>
//               </div>

//               {/* Scrollable Content Area */}
//               <div className="flex-1 overflow-y-auto">
//                 {/* Mobile Menu Links */}
//                 <div className="px-6 py-8 space-y-2">
//                   {navLinks.map((link, index) => (
//                     <motion.div
//                       key={link.href}
//                       initial={{ opacity: 0, x: 20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.1, duration: 0.3 }}
//                     >
//                       <Link
//                         href={link.href}
//                         onClick={toggleMenu}
//                         className="group block px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gray-100"
//                       >
//                         <div className="flex items-center justify-between">
//                           <span className="text-gray-700 group-hover:text-[#1D4671] transition-colors duration-300 font-medium text-lg">
//                             {link.label}
//                           </span>
//                           <motion.div
//                             initial={{ x: -10, opacity: 0 }}
//                             whileHover={{ x: 0, opacity: 1 }}
//                             className="text-primary"
//                           >
//                             <svg
//                               className="w-5 h-5"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M9 5l7 7-7 7"
//                               />
//                             </svg>
//                           </motion.div>
//                         </div>
//                       </Link>
//                     </motion.div>
//                   ))}

//                   {/* More Links Section in Mobile */}
//                   <motion.div
//                     initial={{ opacity: 0, x: 20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: navLinks.length * 0.1, duration: 0.3 }}
//                     className="pt-4"
//                   >
//                     <div className="mb-3 px-4">
//                       <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
//                         More
//                       </h3>
//                     </div>
//                     <div className="space-y-1">
//                       {moreLinks.map((link, index) => (
//                         <motion.div
//                           key={link.href}
//                           initial={{ opacity: 0, x: 20 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{
//                             delay: navLinks.length * 0.1 + index * 0.05,
//                             duration: 0.2,
//                           }}
//                         >
//                           <Link
//                             href={link.href}
//                             onClick={toggleMenu}
//                             className="block px-4 py-2 text-gray-600 hover:text-[#1D4671] hover:bg-gray-50 rounded-lg transition-colors duration-200"
//                           >
//                             {link.label}
//                           </Link>
//                         </motion.div>
//                       ))}
//                     </div>
//                   </motion.div>
//                 </div>
//               </div>

//               {/* Mobile Auth Buttons - Fixed at bottom */}
//               <div className="flex-shrink-0 p-6 space-y-3 border-t border-gray-200 bg-gray-50">
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5, duration: 0.3 }}
//                 >
//                   <Button variant="default" size="lg" fullWidth>
//                     Login
//                   </Button>
//                 </motion.div>
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.6, duration: 0.3 }}
//                 >
//                   <Button variant="secondary" size="lg" fullWidth>
//                     Sign up
//                   </Button>
//                 </motion.div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default Navbar;
