"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../common/Button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "The Essential" },
    { href: "/handbook", label: "The Handbook" },
    { href: "/articles", label: "Articles" },
    { href: "/mcqs", label: "MCQs" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link href="/" className="flex items-center space-x-3">
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
                    <span className="relative z-10 text-primary group-hover:text-primary transition-colors duration-300 font-[">
                      {link.label}
                    </span>
                    {/* Modern animated underline */}
                    <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 w-0 h-0.5 bg-primary group-hover:w-[100% rounded-full transition-all duration-300 group-hover:w-8"></span>
                  </Link>
                </motion.div>
              ))}
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
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl border-l border-gray-200 z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
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

                {/* Mobile Menu Links */}
                <div className="flex-1 px-6 py-8 space-y-2">
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

                  {/* Mobile Auth Buttons */}
                  <div className="pt-6 space-y-3 border-t border-gray-200 mt-6">
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
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
export default Navbar;
