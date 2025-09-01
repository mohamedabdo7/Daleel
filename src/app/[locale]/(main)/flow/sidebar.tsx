"use client";

import React from "react";
import { ChevronDown, ChevronRight, Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface SidebarItem {
  id: string;
  title: string;
  children?: SidebarItem[];
  icon?: React.ComponentType<{ className?: string }>; // Optional custom icon
}

export interface SidebarConfig {
  title: string;
  subtitle?: string;
  defaultIcon?: React.ComponentType<{ className?: string }>;
  loadingText?: string;
  emptyText?: string;
  className?: string;
}

interface GenericSidebarProps {
  items: SidebarItem[];
  selectedItemId?: string;
  onItemClick: (item: SidebarItem) => void;
  onCategoryToggle: (categorySlug: string, willExpand: boolean) => void;
  loadingCategoryId: string | null;
  expandedCategories: Set<string>;
  config: SidebarConfig;
  isOpen?: boolean; // For mobile sidebar
  onClose?: () => void; // For mobile sidebar
}

const GenericSidebar: React.FC<GenericSidebarProps> = ({
  items,
  selectedItemId,
  onItemClick,
  onCategoryToggle,
  loadingCategoryId,
  expandedCategories,
  config,
  isOpen = true,
  onClose,
}) => {
  const {
    title,
    subtitle,
    defaultIcon: DefaultIcon = FileText,
    loadingText = "Loading...",
    emptyText = "No items available",
    className = "",
  } = config;

  const handleCategoryClick = (categoryId: string) => {
    const isExpanded = expandedCategories.has(categoryId);
    onCategoryToggle(categoryId, !isExpanded);
  };

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const isExpanded = expandedCategories.has(item.id);
    const isLoading = loadingCategoryId === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isCategory = level === 0;
    const isSelected = selectedItemId === item.id;
    const ItemIcon = item.icon || DefaultIcon;

    if (isCategory) {
      return (
        <div key={item.id} className="mb-2">
          <Button
            variant="ghost"
            onClick={() => handleCategoryClick(item.id)}
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

    return (
      <Button
        key={item.id}
        variant={isSelected ? "default" : "ghost"}
        onClick={() => onItemClick(item)}
        className={cn(
          "w-full justify-start h-auto p-2 text-left text-sm font-normal rounded-md transition-colors group",
          isSelected
            ? "bg-[#0A2C75] text-white hover:bg-[#0A2C75]/90"
            : "text-gray-600 hover:bg-[#03847D]/10 hover:text-[#03847D]"
        )}
        title={item.title} // Tooltip for full text
      >
        <ItemIcon className="h-4 w-4 mr-2 flex-shrink-0" />
        <span className="flex-1 text-left break-words leading-tight">
          {item.title}
        </span>
      </Button>
    );
  };

  const sidebarContent = (
    <div
      className={cn(
        "h-full flex flex-col bg-white border-r border-gray-200",
        className
      )}
    >
      <div
        className={cn(
          "p-4 border-b border-gray-200 bg-gradient-to-r from-[#0A2C75]/5 to-[#03847D]/5"
        )}
      >
        <h2 className="text-lg font-semibold text-[#0A2C75] truncate">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[#03847D] mt-1 truncate">{subtitle}</p>
        )}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden absolute top-3 right-3 p-2"
          >
            ×
          </Button>
        )}
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

  // Mobile overlay
  if (onClose) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        <div
          className={cn(
            "fixed top-0 left-0 z-50 w-80 h-full transform transition-transform duration-300 ease-in-out lg:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return sidebarContent;
};

export default GenericSidebar;

// import React from "react";
// import { ChevronDown, ChevronRight, Loader2, FileText } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";

// export interface SidebarItem {
//   id: string;
//   title: string;
//   children?: SidebarItem[];
// }

// interface SidebarProps {
//   items: SidebarItem[];
//   selectedProtocol?: string;
//   onItemClick: (item: SidebarItem) => void;
//   onCategoryToggle: (categorySlug: string, willExpand: boolean) => void;
//   loadingCategoryId: string | null;
//   expandedCategories: Set<string>;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   items,
//   selectedProtocol,
//   onItemClick,
//   onCategoryToggle,
//   loadingCategoryId,
//   expandedCategories,
// }) => {
//   const handleCategoryClick = (categoryId: string) => {
//     const isExpanded = expandedCategories.has(categoryId);
//     onCategoryToggle(categoryId, !isExpanded);
//   };

//   const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
//     const isExpanded = expandedCategories.has(item.id);
//     const isLoading = loadingCategoryId === item.id;
//     const hasChildren = item.children && item.children.length > 0;
//     const isCategory = level === 0;
//     const isSelected = selectedProtocol === item.id;

//     if (isCategory) {
//       return (
//         <div key={item.id} className="mb-2">
//           <Button
//             variant="ghost"
//             onClick={() => handleCategoryClick(item.id)}
//             className={cn(
//               "w-full justify-between h-auto p-3 text-left font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group",
//               isExpanded && "bg-blue-50 text-blue-700"
//             )}
//           >
//             <span className="flex-1 text-left break-words pr-2 leading-tight">
//               {item.title}
//             </span>
//             <div className="flex items-center gap-1 flex-shrink-0">
//               {isLoading ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <div className="transition-transform duration-200">
//                   {isExpanded ? (
//                     <ChevronDown className="h-4 w-4" />
//                   ) : (
//                     <ChevronRight className="h-4 w-4" />
//                   )}
//                 </div>
//               )}
//             </div>
//           </Button>
//           {isExpanded && hasChildren && (
//             <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
//               {item.children!.map((child) =>
//                 renderSidebarItem(child, level + 1)
//               )}
//             </div>
//           )}
//         </div>
//       );
//     }

//     return (
//       <Button
//         key={item.id}
//         variant={isSelected ? "default" : "ghost"}
//         onClick={() => onItemClick(item)}
//         className={cn(
//           "w-full justify-start h-auto p-2 text-left text-sm font-normal rounded-md transition-colors group",
//           isSelected
//             ? "bg-blue-600 text-white hover:bg-blue-700"
//             : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
//         )}
//         title={item.title} // Tooltip for full text
//       >
//         <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
//         <span className="flex-1 text-left break-words leading-tight">
//           {item.title}
//         </span>
//       </Button>
//     );
//   };

//   return (
//     <div className="h-full flex flex-col bg-white border-r border-gray-200">
//       <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
//         <h2 className="text-lg font-semibold text-blue-900 truncate">
//           Clinical Protocols
//         </h2>
//       </div>
//       <ScrollArea className="flex-1">
//         <div className="p-4 space-y-2">
//           {items.map((item) => renderSidebarItem(item))}
//         </div>
//       </ScrollArea>
//     </div>
//   );
// };

// export default Sidebar;

// "use client";

// import React, { useState, useEffect } from "react";

// // --- Simple icons ---
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

// // === Types ===
// export interface SidebarItem {
//   id: string;
//   title: string;
//   children?: SidebarItem[];
// }

// export interface SidebarTreeProps {
//   title: string;
//   items: SidebarItem[];
//   onItemClick: (item: SidebarItem) => void;
//   activeItemId?: string;
//   className?: string;
//   isOpen?: boolean;
//   onClose?: () => void;
//   onCategoryToggle?: (categoryId: string, willExpand: boolean) => void;
//   loadingCategoryId?: string | null;
// }

// const SidebarTree: React.FC<SidebarTreeProps> = ({
//   title,
//   items,
//   onItemClick,
//   activeItemId,
//   className = "",
//   isOpen = false,
//   onClose,
//   onCategoryToggle,
//   loadingCategoryId = null,
// }) => {
//   const [expanded, setExpanded] = useState(new Set<string>());
//   const [isScrolled, setIsScrolled] = useState(false);

//   // Handle scroll detection for header styling
//   useEffect(() => {
//     const handleScroll = (e: Event) => {
//       const target = e.target as HTMLElement;
//       if (target) {
//         setIsScrolled(target.scrollTop > 10);
//       }
//     };

//     const sidebarElement = document.getElementById("sidebar-content");
//     if (sidebarElement) {
//       sidebarElement.addEventListener("scroll", handleScroll);
//       return () => sidebarElement.removeEventListener("scroll", handleScroll);
//     }
//   }, []);

//   const toggle = (id: string) => {
//     const next = new Set(expanded);
//     const willExpand = !next.has(id);
//     if (willExpand) next.add(id);
//     else next.delete(id);
//     setExpanded(next);
//     onCategoryToggle?.(id, willExpand);
//   };

//   const Node: React.FC<{ item: SidebarItem; level?: number }> = ({
//     item,
//     level = 0,
//   }) => {
//     const isExpanded = expanded.has(item.id);
//     const hasChildren = Boolean(item.children?.length);
//     const isActiveChild = activeItemId === item.id && level > 0;
//     const isParent = level === 0;

//     const handleClick = (e: React.MouseEvent) => {
//       e.stopPropagation();
//       if (isParent) toggle(item.id);
//       else {
//         onItemClick(item);
//         if (window.innerWidth < 1024 && onClose) onClose();
//       }
//     };

//     return (
//       <div className="relative">
//         <button
//           onClick={handleClick}
//           className={`w-full text-left group relative overflow-hidden transform transition-all duration-300 hover:scale-[1.02] ${
//             isParent
//               ? `p-3 sm:p-4 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 shadow-sm border ${
//                   isExpanded
//                     ? "bg-gradient-to-r from-[#1D4671] to-[#153654] text-white border-[#1D4671] shadow-lg shadow-[#1D4671]/25"
//                     : "bg-white hover:bg-gradient-to-r hover:from-[#E8F2FF] hover:to-[#F5F9FF] text-gray-700 border-gray-200 hover:border-[#1D4671] hover:shadow-md"
//                 }`
//               : `p-2 sm:p-3 rounded-lg sm:rounded-xl mb-1 sm:mb-2 ml-3 sm:ml-4 border-l-4 transform transition-all duration-200 hover:translate-x-1 ${
//                   isActiveChild
//                     ? "bg-[#E8F2FF] border-[#1D4671] text-[#153654] shadow-sm"
//                     : "bg-white border-transparent hover:bg-[#E8F2FF] hover:border-[#1D4671] text-gray-600 hover:text-[#153654]"
//                 }`
//           }`}
//         >
//           <div className="flex items-center justify-between relative z-10">
//             <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
//               {isParent && (
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
//               {!isParent && (
//                 <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current opacity-50 flex-shrink-0" />
//               )}
//               <span
//                 className={`font-medium truncate ${
//                   isParent ? "text-sm sm:text-base" : "text-xs sm:text-sm"
//                 }`}
//                 title={item.title}
//               >
//                 {item.title}
//               </span>
//             </div>

//             {isParent && (
//               <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
//                 {loadingCategoryId === item.id && (
//                   <span className="inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#1D4671] border-t-transparent animate-spin" />
//                 )}
//                 <div
//                   className={`flex-shrink-0 transition-transform duration-200 ${
//                     isExpanded ? "rotate-180" : "rotate-0"
//                   }`}
//                 >
//                   <ChevronDown
//                     className={`w-3 h-3 sm:w-4 sm:h-4 ${
//                       isExpanded ? "text-white" : "text-gray-400"
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
//           id="sidebar-content"
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
//           #sidebar-content::-webkit-scrollbar {
//             width: 4px;
//           }
//           #sidebar-content::-webkit-scrollbar-track {
//             background: transparent;
//           }
//           #sidebar-content::-webkit-scrollbar-thumb {
//             background: #1d4671;
//             border-radius: 2px;
//           }
//           #sidebar-content::-webkit-scrollbar-thumb:hover {
//             background: #153654;
//           }
//         `}</style>
//       </aside>
//     </>
//   );
// };

// export default SidebarTree;
