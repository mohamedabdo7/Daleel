"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Loader2, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface DeepSidebarItemMeta {
  /** "section" | "chapter" | "lesson" | custom */
  type?: string;
  /** force leaf if needed */
  isLeaf?: boolean;
  [k: string]: any;
}

export interface DeepSidebarItem {
  id: string; // unique key (slug)
  title: string;
  children?: DeepSidebarItem[];
  meta?: DeepSidebarItemMeta;
  icon?: React.ComponentType<{ className?: string }>; // Optional custom icon
}

export interface DeepSidebarConfig {
  title: string;
  subtitle?: string;
  defaultIcon?: React.ComponentType<{ className?: string }>;
  loadingText?: string;
  emptyText?: string;
  className?: string;
}

interface DeepSidebarProps {
  items: DeepSidebarItem[];
  onLeafClick: (item: DeepSidebarItem) => void;
  activeLeafId?: string;
  config: DeepSidebarConfig;
  isOpen?: boolean;
  onClose?: () => void;
  /** called when a node toggles (useful for lazy loading) */
  onToggle?: (item: DeepSidebarItem, willExpand: boolean) => void;
  loadingNodeId?: string | null;
  /** Expand these ids on mount / when they change (e.g., section+chapter from URL) */
  initialExpandedIds?: string[];
}

const DeepSidebar: React.FC<DeepSidebarProps> = ({
  items,
  onLeafClick,
  activeLeafId,
  config,
  isOpen = true,
  onClose,
  onToggle,
  loadingNodeId = null,
  initialExpandedIds,
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const {
    title,
    subtitle,
    defaultIcon: DefaultIcon = FileText,
    loadingText = "Loading...",
    emptyText = "No items available",
    className = "",
  } = config;

  // Sync initialExpandedIds → expanded (union, no reset)
  useEffect(() => {
    if (!initialExpandedIds || initialExpandedIds.length === 0) return;
    setExpanded((prev) => {
      const ids = new Set(prev);
      for (const id of initialExpandedIds) ids.add(id);
      return ids;
    });
  }, [initialExpandedIds?.join("|")]);

  // Auto-expand ancestors of the active leaf when items change (e.g., after lazy loads)
  useEffect(() => {
    if (!activeLeafId) return;
    const path: string[] = [];
    const dfs = (
      arr: DeepSidebarItem[],
      target: string,
      acc: string[]
    ): boolean => {
      for (const n of arr) {
        const nextAcc = [...acc, n.id];
        if (n.id === target) {
          path.push(...nextAcc);
          return true;
        }
        if (n.children && n.children.length) {
          if (dfs(n.children, target, nextAcc)) return true;
        }
      }
      return false;
    };
    dfs(items, activeLeafId, []);
    if (path.length) {
      setExpanded((prev) => {
        const ids = new Set(prev);
        for (const id of path) ids.add(id);
        return ids;
      });
    }
  }, [items, activeLeafId]);

  const toggle = (item: DeepSidebarItem) => {
    const next = new Set(expanded);
    const willExpand = !next.has(item.id);
    if (willExpand) next.add(item.id);
    else next.delete(item.id);
    setExpanded(next);
    onToggle?.(item, willExpand);
  };

  const handleItemClick = (item: DeepSidebarItem) => {
    const isLeaf = item.meta?.type === "lesson" || item.meta?.isLeaf === true;
    if (isLeaf) {
      onLeafClick(item);
      if (window.innerWidth < 1024 && onClose) onClose();
    } else {
      toggle(item);
    }
  };

  const renderSidebarItem = (item: DeepSidebarItem, level: number = 0) => {
    const isExpanded = expanded.has(item.id);
    const isLoading = loadingNodeId === item.id;
    const hasChildren = Boolean(item.children?.length);
    const isLeaf = item.meta?.type === "lesson" || item.meta?.isLeaf === true;
    const isSelected = activeLeafId === item.id && isLeaf;
    const ItemIcon = item.icon || DefaultIcon;

    // Categories (level 0) - match GenericSidebar exactly
    if (level === 0) {
      return (
        <div key={item.id} className="mb-2">
          <Button
            variant="ghost"
            onClick={() => handleItemClick(item)}
            className={cn(
              "w-full justify-between h-auto p-3 text-left font-medium text-gray-700 hover:bg-[#03847D]/10 rounded-lg transition-colors group",
              isExpanded &&
                "bg-[#0A2C75]/10 text-[#0A2C75] border border-[#0A2C75]/20"
            )}
          >
            <div className="flex items-center flex-1 min-w-0">
              <ItemIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="flex-1 text-left break-words pr-2 leading-tight">
                {item.title}
              </span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="transition-transform duration-200">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              )}
            </div>
          </Button>
          {isExpanded && hasChildren && (
            <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
              {item.children!.map((child) =>
                renderSidebarItem(child, level + 1)
              )}
            </div>
          )}
        </div>
      );
    }

    // Deep nested items (level 1+) - enhanced for multiple levels
    const getNestedClasses = () => {
      if (level === 1) {
        return cn(
          "w-full justify-between h-auto p-2 text-left text-sm font-normal transition-colors group",
          !isLeaf && hasChildren
            ? isExpanded
              ? "bg-[#0A2C75]/5 text-[#0A2C75]"
              : "text-gray-600 hover:bg-[#03847D]/10 hover:text-[#03847D]"
            : isSelected
            ? "bg-[#0A2C75] text-white hover:bg-[#0A2C75]/90"
            : "text-gray-600 hover:bg-[#03847D]/10 hover:text-[#03847D]"
        );
      } else {
        // Level 2+ - progressively smaller and more indented
        return cn(
          "w-full justify-start h-auto p-2 text-left text-xs font-normal rounded-md transition-colors group",
          `ml-${(level - 1) * 2}`,
          isSelected
            ? "bg-[#0A2C75] text-white hover:bg-[#0A2C75]/90"
            : "text-gray-600 hover:bg-[#03847D]/10 hover:text-[#03847D]"
        );
      }
    };

    return (
      <div key={item.id} className="relative">
        <Button
          variant={isSelected ? "default" : "ghost"}
          onClick={() => handleItemClick(item)}
          className={getNestedClasses()}
          title={item.title}
        >
          <div className="flex items-center justify-between w-full min-w-0">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <ItemIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="flex-1 text-left break-words leading-tight">
                {item.title}
              </span>
            </div>

            {!isLeaf && hasChildren && (
              <div className="flex items-center gap-1 flex-shrink-0">
                {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                <div
                  className={cn(
                    "transition-transform duration-200",
                    isExpanded ? "rotate-90" : "rotate-0"
                  )}
                >
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </Button>

        {hasChildren && !isLeaf && (
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div
              className={cn(
                "mt-1 space-y-1",
                level === 1 && "border-l-2 border-gray-200 pl-4"
              )}
            >
              {item.children?.map((child) =>
                renderSidebarItem(child, level + 1)
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div
      className={cn(
        "h-full flex flex-col bg-white border-r border-gray-200",
        className
      )}
    >
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#0A2C75]/5 to-[#03847D]/5">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-[#0A2C75] truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-[#03847D] mt-1 truncate">{subtitle}</p>
            )}
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden p-2 flex-shrink-0"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              {emptyText}
            </div>
          ) : (
            items.map((item) => renderSidebarItem(item))
          )}
        </div>
      </ScrollArea>
    </div>
  );

  // Mobile overlay - only when onClose is provided AND on mobile
  return (
    <>
      {onClose && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          onClose
            ? cn(
                "fixed top-0 left-0 z-50 w-80 h-full transform transition-transform duration-300 ease-in-out lg:relative lg:w-full lg:max-w-none lg:transform-none lg:z-auto",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
              )
            : "w-full h-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default DeepSidebar;

// "use client";

// import React, { useEffect, useState } from "react";

// const ChevronDown = ({ className }: { className?: string }) => (
//   <svg
//     className={className}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M19 9l-7 7-7-7"
//     />
//   </svg>
// );

// const FileText = ({ className }: { className?: string }) => (
//   <svg
//     className={className}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//     />
//   </svg>
// );

// const CloseIcon = ({ className }: { className?: string }) => (
//   <svg
//     className={className}
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M6 18L18 6M6 6l12 12"
//     />
//   </svg>
// );

// export interface SidebarDeepItemMeta {
//   /** "section" | "chapter" | "lesson" | custom */
//   type?: string;
//   /** force leaf if needed */
//   isLeaf?: boolean;
//   [k: string]: any;
// }

// export interface SidebarDeepItem {
//   id: string; // unique key (slug)
//   title: string;
//   children?: SidebarDeepItem[];
//   meta?: SidebarDeepItemMeta;
// }

// export interface SidebarTreeDeepProps {
//   title: string;
//   items: SidebarDeepItem[];
//   onLeafClick: (item: SidebarDeepItem) => void;
//   activeLeafId?: string;
//   className?: string;
//   isOpen?: boolean;
//   onClose?: () => void;
//   /** called when a node toggles (useful for lazy loading) */
//   onToggle?: (item: SidebarDeepItem, willExpand: boolean) => void;
//   loadingNodeId?: string | null;
//   /** Expand these ids on mount / when they change (e.g., section+chapter from URL) */
//   initialExpandedIds?: string[];
// }

// export default function SidebarTreeDeep({
//   title,
//   items,
//   onLeafClick,
//   activeLeafId,
//   className = "",
//   isOpen = false,
//   onClose,
//   onToggle,
//   loadingNodeId = null,
//   initialExpandedIds,
// }: SidebarTreeDeepProps) {
//   const [expanded, setExpanded] = useState<Set<string>>(new Set());
//   const [isScrolled, setIsScrolled] = useState(false);

//   // Handle scroll detection for header styling
//   useEffect(() => {
//     const handleScroll = (e: Event) => {
//       const target = e.target as HTMLElement;
//       if (target) {
//         setIsScrolled(target.scrollTop > 10);
//       }
//     };

//     const sidebarElement = document.getElementById("sidebar-deep-content");
//     if (sidebarElement) {
//       sidebarElement.addEventListener("scroll", handleScroll);
//       return () => sidebarElement.removeEventListener("scroll", handleScroll);
//     }
//   }, []);

//   // Sync initialExpandedIds → expanded (union, no reset)
//   useEffect(() => {
//     if (!initialExpandedIds || initialExpandedIds.length === 0) return;
//     setExpanded((prev) => {
//       const ids = new Set(prev);
//       for (const id of initialExpandedIds) ids.add(id);
//       return ids;
//     });
//   }, [initialExpandedIds?.join("|")]);

//   // Auto-expand ancestors of the active leaf when items change (e.g., after lazy loads)
//   useEffect(() => {
//     if (!activeLeafId) return;
//     const path: string[] = [];
//     const dfs = (
//       arr: SidebarDeepItem[],
//       target: string,
//       acc: string[]
//     ): boolean => {
//       for (const n of arr) {
//         const nextAcc = [...acc, n.id];
//         if (n.id === target) {
//           path.push(...nextAcc);
//           return true;
//         }
//         if (n.children && n.children.length) {
//           if (dfs(n.children, target, nextAcc)) return true;
//         }
//       }
//       return false;
//     };
//     dfs(items, activeLeafId, []);
//     if (path.length) {
//       setExpanded((prev) => {
//         const ids = new Set(prev);
//         for (const id of path) ids.add(id);
//         return ids;
//       });
//     }
//   }, [items, activeLeafId]);

//   const toggle = (item: SidebarDeepItem) => {
//     const next = new Set(expanded);
//     const willExpand = !next.has(item.id);
//     if (willExpand) next.add(item.id);
//     else next.delete(item.id);
//     setExpanded(next);
//     onToggle?.(item, willExpand);
//   };

//   const Node: React.FC<{ item: SidebarDeepItem; level?: number }> = ({
//     item,
//     level = 0,
//   }) => {
//     const isExpanded = expanded.has(item.id);
//     const hasChildren = Boolean(item.children?.length);
//     // Leaf ONLY when explicitly typed as lesson (or flagged isLeaf)
//     const isLeaf = item.meta?.type === "lesson" || item.meta?.isLeaf === true;
//     const isActiveLeaf = activeLeafId === item.id && isLeaf;

//     const handleClick = (e: React.MouseEvent) => {
//       e.stopPropagation();
//       if (isLeaf) {
//         onLeafClick(item);
//         if (window.innerWidth < 1024 && onClose) onClose();
//       } else {
//         toggle(item);
//       }
//     };

//     // Level-based responsive visual styles
//     const btnClass =
//       level === 0
//         ? `p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 shadow-sm border transform transition-all duration-300 hover:scale-[1.02] ${
//             isExpanded
//               ? "bg-gradient-to-r from-[#1D4671] to-[#153654] text-white border-[#1D4671] shadow-lg shadow-[#1D4671]/25"
//               : "bg-white hover:bg-gradient-to-r hover:from-[#E8F2FF] hover:to-[#F5F9FF] text-gray-700 border-gray-200 hover:border-[#1D4671] hover:shadow-md"
//           }`
//         : level === 1
//         ? `p-2 sm:p-3 rounded-lg sm:rounded-xl mb-1 sm:mb-2 ml-3 sm:ml-4 border-l-4 transform transition-all duration-200 hover:translate-x-1 ${
//             isLeaf
//               ? isActiveLeaf
//                 ? "bg-[#E8F2FF] border-[#1D4671] text-[#153654] shadow-sm"
//                 : "bg-white border-transparent hover:bg-[#E8F2FF] hover:border-[#1D4671] text-gray-700 hover:text-[#153654]"
//               : isExpanded
//               ? "bg-[#F0F6FF] border-[#1D4671] text-[#153654]"
//               : "bg-white border-transparent hover:bg-[#E8F2FF] hover:border-[#1D4671] text-gray-700 hover:text-[#153654]"
//           }`
//         : `p-2 rounded-lg mb-1 ml-6 sm:ml-8 border-l-2 transform transition-all duration-200 hover:translate-x-1 ${
//             isActiveLeaf
//               ? "bg-[#E8F2FF] border-[#1D4671] text-[#153654] shadow-sm"
//               : "bg-white border-transparent hover:bg-[#EEF6FF] hover:border-[#B6D4FF] text-gray-600 hover:text-[#153654]"
//           }`;

//     const dotClass =
//       level === 0
//         ? ""
//         : level === 1
//         ? "w-1.5 h-1.5 sm:w-2.5 sm:h-2.5"
//         : "w-1.5 h-1.5 sm:w-2 sm:h-2";

//     return (
//       <div className="relative">
//         <button
//           onClick={handleClick}
//           className={`w-full text-left group relative overflow-hidden ${btnClass}`}
//         >
//           <div className="flex items-center justify-between relative z-10">
//             <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
//               {level === 0 && (
//                 <div
//                   className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-colors flex-shrink-0 ${
//                     isExpanded
//                       ? "bg-white/20"
//                       : "bg-[#E8F2FF] group-hover:bg-[#F5F9FF]"
//                   }`}
//                 >
//                   <div className={isExpanded ? "text-white" : "text-[#1D4671]"}>
//                     <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
//                   </div>
//                 </div>
//               )}
//               {level > 0 && (
//                 <div
//                   className={`${dotClass} rounded-full bg-current opacity-60 flex-shrink-0`}
//                 />
//               )}
//               <span
//                 className={`font-medium truncate ${
//                   level === 0
//                     ? "text-sm sm:text-base"
//                     : level === 1
//                     ? "text-xs sm:text-[15px]"
//                     : "text-xs sm:text-sm"
//                 }`}
//                 title={item.title}
//               >
//                 {item.title}
//               </span>
//             </div>

//             {!isLeaf && (
//               <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
//                 {loadingNodeId === item.id && (
//                   <span className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#1D4671] border-t-transparent animate-spin" />
//                 )}
//                 <div
//                   className={`flex-shrink-0 transition-transform duration-200 ${
//                     isExpanded ? "rotate-180" : "rotate-0"
//                   }`}
//                 >
//                   <ChevronDown
//                     className={`w-3 h-3 sm:w-4 sm:h-4 ${
//                       level === 0 && isExpanded ? "text-white" : "text-gray-400"
//                     }`}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </button>

//         {hasChildren && (
//           <div
//             className={`overflow-hidden transition-all duration-300 ease-in-out ${
//               isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
//             }`}
//           >
//             <div className="pb-2">
//               {item.children?.map((child) => (
//                 <Node key={child.id} item={child} level={level + 1} />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       {/* Backdrop overlay for mobile - LOWER z-index than navbar */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[40] lg:hidden"
//           onClick={onClose}
//         />
//       )}

//       <aside
//         className={`bg-gradient-to-b from-gray-50 to-white border-r border-gray-200/60 shadow-xl backdrop-blur-sm h-full fixed lg:static top-0 left-0 transform transition-all duration-500 ease-out z-[45] w-full ${
//           isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         } ${className}`}
//       >
//         {/* Floating Header - positioned relative to sidebar content */}
//         <div
//           className={`relative z-10 transition-all duration-300 ${
//             isScrolled
//               ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/60"
//               : "bg-transparent"
//           }`}
//         >
//           <div className="p-4 sm:p-6">
//             <div className="flex items-center justify-between">
//               <h2
//                 className={`text-lg sm:text-xl font-bold truncate transition-colors duration-300 ${
//                   isScrolled ? "text-gray-800" : "text-gray-800"
//                 }`}
//               >
//                 {title}
//               </h2>
//               {/* Close button - only visible on mobile */}
//               <button
//                 onClick={onClose}
//                 className={`lg:hidden p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${
//                   isScrolled
//                     ? "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
//                     : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
//                 }`}
//                 aria-label="Close menu"
//               >
//                 <CloseIcon className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Scrollable Content area - with proper scroll handling */}
//         <div
//           id="sidebar-deep-content"
//           className="absolute inset-0 pt-[88px] sm:pt-[104px] overflow-y-auto overscroll-contain"
//           style={{
//             scrollbarWidth: "thin",
//             scrollbarColor: "#1D4671 transparent",
//           }}
//         >
//           <div className="p-3 sm:p-6 space-y-2 pb-20 lg:pb-6">
//             {items.map((item) => (
//               <Node key={item.id} item={item} />
//             ))}

//             {/* Empty state when no items */}
//             {items.length === 0 && (
//               <div className="text-center py-8">
//                 <p className="text-gray-500 text-sm">No categories available</p>
//               </div>
//             )}
//           </div>

//           {/* Bottom gradient fade effect */}
//           <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none" />
//         </div>

//         {/* Custom scrollbar styles */}
//         <style jsx>{`
//           #sidebar-deep-content::-webkit-scrollbar {
//             width: 4px;
//           }
//           #sidebar-deep-content::-webkit-scrollbar-track {
//             background: transparent;
//           }
//           #sidebar-deep-content::-webkit-scrollbar-thumb {
//             background: #1d4671;
//             border-radius: 2px;
//           }
//           #sidebar-deep-content::-webkit-scrollbar-thumb:hover {
//             background: #153654;
//           }
//         `}</style>
//       </aside>
//     </>
//   );
// }
