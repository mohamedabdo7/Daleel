// volunteers/page.tsx
"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Users, AlertCircle, Search } from "lucide-react";
import { getAboutData } from "@/lib/api/about.service";
import { qk } from "@/lib/queryKeys";
import VolunteerCard from "./components/VolunteerCard";

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Group Header Component
const GroupHeader = ({ name, count, isActive, onClick }: any) => (
  <motion.button
    onClick={onClick}
    className={`
      relative px-6 py-4 rounded-2xl font-medium transition-all duration-300 text-left overflow-hidden
      ${
        isActive
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
          : "bg-card text-muted-foreground hover:bg-primary/5 hover:text-primary border border-border"
      }
    `}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center justify-between relative z-10">
      <span className="text-lg">{name}</span>
      <span
        className={`
        text-sm px-3 py-1 rounded-full
        ${
          isActive
            ? "bg-primary-foreground/20 text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }
      `}
      >
        {count} members
      </span>
    </div>

    {isActive && (
      <motion.div
        className="absolute inset-0 rounded-2xl bg-primary"
        layoutId="activeTab"
        initial={false}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ zIndex: 0 }}
      />
    )}
  </motion.button>
);

export default function VolunteersPage() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(true);

  const {
    data: aboutData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: qk.about.data,
    queryFn: ({ signal }) => getAboutData(signal),
    staleTime: 30 * 60 * 1000,
  });

  // Calculate total volunteers count
  const totalVolunteers =
    aboutData?.volunteers?.reduce(
      (total, section) => total + section.data.length,
      0
    ) || 0;

  // Filter volunteers based on search and active group
  const filteredVolunteers =
    aboutData?.volunteers?.filter((group) => {
      if (!showAll && activeGroup && group.name !== activeGroup) return false;
      if (searchTerm) {
        return group.data.some(
          (member) =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (member.desc &&
              member.desc.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      return true;
    }) || [];

  // Get all volunteers for display
  const allVolunteersForDisplay = showAll
    ? filteredVolunteers.flatMap((group) =>
        group.data
          .filter(
            (member) =>
              !searchTerm ||
              member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (member.desc &&
                member.desc.toLowerCase().includes(searchTerm.toLowerCase()))
          )
          .map((member) => ({ ...member, groupName: group.name }))
      )
    : filteredVolunteers
        .filter((group) => group.name === activeGroup)[0]
        ?.data.filter(
          (member) =>
            !searchTerm ||
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (member.desc &&
              member.desc.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .map((member) => ({ ...member, groupName: activeGroup })) || [];

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        className="max-w-7xl mx-auto px-section-x py-8 lg:py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Hero Section */}
        <motion.section variants={itemVariants} className="text-center mb-12">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl mb-6"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Heart className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Our Volunteer Community
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Meet the passionate individuals driving excellence in family
            medicine
          </p>

          {!isLoading && totalVolunteers > 0 && (
            <motion.div
              className="inline-flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-border text-primary px-8 py-4 rounded-full font-medium shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Users className="w-5 h-5" />
              <span>{totalVolunteers} Dedicated Volunteers</span>
            </motion.div>
          )}
        </motion.section>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-3xl p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-2xl" />
                  <div className="flex-1">
                    <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted/50 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <motion.div
            className="text-center bg-card rounded-3xl border border-border shadow-sm p-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Failed to load volunteers
            </h3>
            <p className="text-muted-foreground">
              Please try refreshing the page or contact support.
            </p>
          </motion.div>
        )}

        {/* Main Content */}
        {!isLoading && !isError && aboutData?.volunteers && (
          <>
            {/* Controls Section */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-sm p-6">
                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search volunteers..."
                    className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-3">
                  <GroupHeader
                    name="All Groups"
                    count={totalVolunteers}
                    isActive={showAll}
                    onClick={() => {
                      setShowAll(true);
                      setActiveGroup(null);
                    }}
                  />

                  {aboutData.volunteers.map((group) => (
                    <GroupHeader
                      key={group.name}
                      name={group.name}
                      count={group.data.length}
                      isActive={!showAll && activeGroup === group.name}
                      onClick={() => {
                        setShowAll(false);
                        setActiveGroup(group.name);
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Volunteers Grid */}
            <motion.section variants={itemVariants}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${showAll}-${activeGroup}-${searchTerm}`}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  {allVolunteersForDisplay.map((member, index) => (
                    <VolunteerCard
                      key={`${member.name}-${index}`}
                      member={member}
                      groupName={member.groupName}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>

              {allVolunteersForDisplay.length === 0 && (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No volunteers found
                  </h3>
                  <p className="text-muted-foreground/70">
                    Try adjusting your search terms or filters.
                  </p>
                </motion.div>
              )}
            </motion.section>

            {/* Call to Action */}
            <motion.div
              className="bg-primary rounded-3xl p-8 text-primary-foreground text-center mt-16 relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary-foreground rounded-full -translate-x-16 -translate-y-16" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-foreground rounded-full translate-x-16 translate-y-16" />
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
                <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-lg">
                  Your expertise can shape the future of family medicine in
                  Saudi Arabia
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <motion.a
                    href="mailto:volunteers@daleelfm.com"
                    className="inline-flex items-center gap-3 bg-card text-primary px-8 py-4 rounded-2xl font-semibold hover:bg-primary/5 transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className="w-5 h-5" />
                    Become a Volunteer
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
