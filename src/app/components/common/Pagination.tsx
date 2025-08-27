import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  className?: string;
}

export interface PaginationInfo {
  from: number;
  to: number;
  total: number;
  currentPage: number;
  totalPages: number;
}

export const usePagination = (
  currentPage: number,
  totalItems: number,
  itemsPerPage: number
): PaginationInfo => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const from = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  return {
    from,
    to,
    total: totalItems,
    currentPage,
    totalPages,
  };
};

const generatePageNumbers = (
  current: number,
  total: number,
  windowSize: number = 2
): (number | "ellipsis")[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];
  const start = Math.max(2, current - windowSize);
  const end = Math.min(total - 1, current + windowSize);

  // Always show first page
  pages.push(1);

  // Add ellipsis if there's a gap
  if (start > 2) {
    pages.push("ellipsis");
  }

  // Add middle pages
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Add ellipsis if there's a gap
  if (end < total - 1) {
    pages.push("ellipsis");
  }

  // Always show last page (if total > 1)
  if (total > 1) {
    pages.push(total);
  }

  return pages;
};

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  className,
}: PaginationProps) {
  const { from, to } = usePagination(currentPage, totalItems, itemsPerPage);
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center gap-4 rounded-xl border bg-card p-6 shadow-sm sm:flex-row sm:justify-between",
        className
      )}
    >
      {/* Results Info */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground"
        >
          {totalItems > 0 ? (
            <>
              Showing{" "}
              <span className="font-medium text-foreground">{from}</span> to{" "}
              <span className="font-medium text-foreground">{to}</span> of{" "}
              <span className="font-medium text-foreground">{totalItems}</span>{" "}
              results
            </>
          ) : (
            "No results found"
          )}
        </motion.div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-1 px-3"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          <AnimatePresence mode="wait">
            {pageNumbers.map((page, index) => (
              <motion.div
                key={`${page}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
              >
                {page === "ellipsis" ? (
                  <div className="flex h-9 w-9 items-center justify-center">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </div>
                ) : (
                  <Button
                    variant={page === currentPage ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className={cn(
                      "h-9 w-9 p-0 font-medium transition-all duration-200",
                      page === currentPage
                        ? "shadow-sm"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {page}
                  </Button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1 px-3"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export default Pagination;
