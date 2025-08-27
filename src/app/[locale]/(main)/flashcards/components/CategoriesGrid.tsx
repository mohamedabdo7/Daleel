"use client";

import { AnimatePresence, motion } from "framer-motion";
import CategoryCard from "./CategoryCard";
import type { FlashcardCategory } from "@/lib/api/flashcards.service";
import EmptyState from "./EmptyState";

export default function CategoriesGrid({
  items,
}: {
  items: FlashcardCategory[];
}) {
  if (!items?.length) {
    return (
      <EmptyState title="No categories yet" description="Check back soon." />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
        >
          {items.map((cat) => (
            <motion.div
              key={cat.uuid}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.35 }}
            >
              <CategoryCard category={cat} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
