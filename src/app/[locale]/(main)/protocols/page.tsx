"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Menu, Loader2, Search, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  getProtocolCategories,
  getProtocolsByCategorySlug,
} from "@/lib/api/protocols.service";
import { qk } from "@/lib/queryKeys";
import EmptyState from "./components/emptyState";
import ProtocolContent from "./components/protocolContent";
import GenericSidebar, { SidebarConfig, SidebarItem } from "../flow/sidebar";
import PageHeader from "@/app/components/common/PageHeader";

export default function ProtocolsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const selectedCategory = searchParams.get("cat") || undefined;
  const selectedProtocol = searchParams.get("sec") || undefined;

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(
    null
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fetch categories
  const {
    data: categories,
    isLoading: catsLoading,
    isError: catsError,
  } = useQuery({
    queryKey: qk.protocols.categories,
    queryFn: ({ signal }) => getProtocolCategories(signal),
    staleTime: 5 * 60_000,
  });

  // Prepare sidebar items
  const sidebarItems = useMemo<SidebarItem[]>(
    () =>
      (categories || []).map((c) => ({
        id: c.slug,
        title: c.title,
        icon: Activity, // Custom icon for protocol categories
      })),
    [categories]
  );

  // Sidebar configuration
  const sidebarConfig: SidebarConfig = {
    title: "Clinical Protocols",
    subtitle: "Medical procedures and guidelines",
    defaultIcon: FileText,
    loadingText: "Loading protocols...",
    emptyText: "No protocols available",
  };

  // Update URL parameters
  const updateQuery = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v == null || v === "") sp.delete(k);
      else sp.set(k, v);
    });
    router.replace(`${pathname}?${sp.toString()}`);
  };

  // Handle search
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Implement search logic here
  };

  // Handle category toggle
  const onCategoryToggle = async (
    categorySlug: string,
    willExpand: boolean
  ) => {
    if (willExpand) {
      setExpandedCategories((prev) => new Set(prev).add(categorySlug));

      // Check if already loaded
      const existingItem = sidebarItems.find(
        (item) => item.id === categorySlug
      );
      if (existingItem?.children && existingItem.children.length > 0) {
        return;
      }

      setLoadingCategoryId(categorySlug);
      try {
        const protocols = await queryClient.fetchQuery({
          queryKey: qk.protocols.sections(categorySlug),
          queryFn: ({ signal }) =>
            getProtocolsByCategorySlug(categorySlug, signal),
          staleTime: 60_000,
        });

        // Update the specific item with children
        const itemIndex = sidebarItems.findIndex(
          (item) => item.id === categorySlug
        );
        if (itemIndex !== -1) {
          sidebarItems[itemIndex].children = (protocols || []).map((p) => ({
            id: p.slug,
            title: p.title,
            icon: FileText, // Icon for individual protocols
          }));
        }

        // Auto-select first protocol if none selected
        if (!selectedProtocol && protocols && protocols[0]) {
          updateQuery({ cat: categorySlug, sec: protocols[0].slug });
        }
      } finally {
        setLoadingCategoryId(null);
      }
    } else {
      setExpandedCategories((prev) => {
        const newSet = new Set(prev);
        newSet.delete(categorySlug);
        return newSet;
      });
    }
  };

  // Handle protocol selection
  const onProtocolClick = (item: SidebarItem) => {
    const parentCategory = sidebarItems.find((cat) =>
      cat.children?.some((child) => child.id === item.id)
    );
    const categorySlug = parentCategory?.id || selectedCategory;

    updateQuery({ cat: categorySlug, sec: item.id });
    setIsMobileSidebarOpen(false);
  };

  // Auto-expand selected category
  useEffect(() => {
    if (selectedCategory && !expandedCategories.has(selectedCategory)) {
      onCategoryToggle(selectedCategory, true);
    }
  }, [selectedCategory]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [selectedProtocol]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Page Header */}
      <PageHeader
        title="Power Points"
        description="Power Points are interactive PowerPoint presentations that help you learn and understand medical concepts in a fun and engaging way."
        showSearch={true}
        searchPlaceholder="Search in Power Points"
        onSearch={() => {}}
      />

      {/* Main Content Layout */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          {catsLoading ? (
            <div className="h-full bg-white border-r border-gray-200 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm text-gray-600">
                  {sidebarConfig.loadingText}
                </span>
              </div>
            </div>
          ) : catsError ? (
            <div className="h-full bg-white border-r border-gray-200 flex items-center justify-center p-4">
              <div className="text-center text-sm text-red-600">
                Failed to load categories
              </div>
            </div>
          ) : (
            <GenericSidebar
              items={sidebarItems}
              selectedItemId={selectedProtocol}
              onItemClick={onProtocolClick}
              onCategoryToggle={onCategoryToggle}
              loadingCategoryId={loadingCategoryId}
              expandedCategories={expandedCategories}
              config={sidebarConfig}
            />
          )}
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="default"
              size="lg"
              className="fixed bottom-6 right-6 z-50 lg:hidden shadow-lg rounded-full h-14 w-14 p-0"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            {catsLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm text-gray-600">
                    {sidebarConfig.loadingText}
                  </span>
                </div>
              </div>
            ) : catsError ? (
              <div className="h-full flex items-center justify-center p-4">
                <div className="text-center text-sm text-red-600">
                  Failed to load categories
                </div>
              </div>
            ) : (
              <GenericSidebar
                items={sidebarItems}
                selectedItemId={selectedProtocol}
                onItemClick={onProtocolClick}
                onCategoryToggle={onCategoryToggle}
                loadingCategoryId={loadingCategoryId}
                expandedCategories={expandedCategories}
                config={sidebarConfig}
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
              />
            )}
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="p-4 lg:p-8">
            {/* Mobile Search */}
            <div className="md:hidden mb-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const query = formData.get("query") as string;
                  handleSearch(query);
                }}
              >
                <div className="bg-white rounded-full flex items-center overflow-hidden shadow-sm border">
                  <div className="pl-4">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="query"
                    placeholder="Search in Protocols"
                    className="flex-1 px-3 py-3 text-sm text-gray-700 focus:outline-none bg-transparent"
                  />
                  <Button type="submit" size="sm" className="m-1 rounded-full">
                    Search
                  </Button>
                </div>
              </form>
            </div>

            {catsLoading ? (
              <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl border shadow-sm p-6 animate-pulse">
                  <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
                  <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-11/12 bg-gray-200 rounded" />
                </div>
              </div>
            ) : catsError ? (
              <div className="max-w-5xl mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
                  Failed to load categories.
                </div>
              </div>
            ) : !selectedProtocol ? (
              <EmptyState />
            ) : (
              <div className="max-w-5xl mx-auto">
                <ProtocolContent protocolSlug={selectedProtocol} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { Menu, Loader2, Search } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import {
//   getProtocolCategories,
//   getProtocolsByCategorySlug,
// } from "@/lib/api/protocols.service";
// import { qk } from "@/lib/queryKeys";
// import EmptyState from "./components/emptyState";
// import ProtocolContent from "./components/protocolContent";
// import Sidebar, { SidebarItem } from "../flow/sidebar";
// import PageHeader from "../flow/PageHeader";

// export default function ProtocolsPage() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const queryClient = useQueryClient();

//   const selectedCategory = searchParams.get("cat") || undefined;
//   const selectedProtocol = searchParams.get("sec") || undefined;

//   const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
//     new Set()
//   );
//   const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(
//     null
//   );
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

//   // Fetch categories
//   const {
//     data: categories,
//     isLoading: catsLoading,
//     isError: catsError,
//   } = useQuery({
//     queryKey: qk.protocols.categories,
//     queryFn: ({ signal }) => getProtocolCategories(signal),
//     staleTime: 5 * 60_000,
//   });

//   // Prepare sidebar items
//   const sidebarItems = useMemo<SidebarItem[]>(
//     () => (categories || []).map((c) => ({ id: c.slug, title: c.title })),
//     [categories]
//   );

//   // Update URL parameters
//   const updateQuery = (params: Record<string, string | undefined>) => {
//     const sp = new URLSearchParams(searchParams.toString());
//     Object.entries(params).forEach(([k, v]) => {
//       if (v == null || v === "") sp.delete(k);
//       else sp.set(k, v);
//     });
//     router.replace(`${pathname}?${sp.toString()}`);
//   };

//   // Handle search
//   const handleSearch = (query: string) => {
//     console.log("Search query:", query);
//     // Implement search logic here
//   };

//   // Handle category toggle
//   const onCategoryToggle = async (
//     categorySlug: string,
//     willExpand: boolean
//   ) => {
//     if (willExpand) {
//       setExpandedCategories((prev) => new Set(prev).add(categorySlug));

//       // Check if already loaded
//       const existingItem = sidebarItems.find(
//         (item) => item.id === categorySlug
//       );
//       if (existingItem?.children && existingItem.children.length > 0) {
//         return;
//       }

//       setLoadingCategoryId(categorySlug);
//       try {
//         const protocols = await queryClient.fetchQuery({
//           queryKey: qk.protocols.sections(categorySlug),
//           queryFn: ({ signal }) =>
//             getProtocolsByCategorySlug(categorySlug, signal),
//           staleTime: 60_000,
//         });

//         // Update the specific item with children
//         const itemIndex = sidebarItems.findIndex(
//           (item) => item.id === categorySlug
//         );
//         if (itemIndex !== -1) {
//           sidebarItems[itemIndex].children = (protocols || []).map((p) => ({
//             id: p.slug,
//             title: p.title,
//           }));
//         }

//         // Auto-select first protocol if none selected
//         if (!selectedProtocol && protocols && protocols[0]) {
//           updateQuery({ cat: categorySlug, sec: protocols[0].slug });
//         }
//       } finally {
//         setLoadingCategoryId(null);
//       }
//     } else {
//       setExpandedCategories((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(categorySlug);
//         return newSet;
//       });
//     }
//   };

//   // Handle protocol selection
//   const onProtocolClick = (item: SidebarItem) => {
//     const parentCategory = sidebarItems.find((cat) =>
//       cat.children?.some((child) => child.id === item.id)
//     );
//     const categorySlug = parentCategory?.id || selectedCategory;

//     updateQuery({ cat: categorySlug, sec: item.id });
//     setIsMobileSidebarOpen(false);
//   };

//   // Auto-expand selected category
//   useEffect(() => {
//     if (selectedCategory && !expandedCategories.has(selectedCategory)) {
//       onCategoryToggle(selectedCategory, true);
//     }
//   }, [selectedCategory]);

//   // Close mobile sidebar on route change
//   useEffect(() => {
//     setIsMobileSidebarOpen(false);
//   }, [selectedProtocol]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Page Header */}
//       <PageHeader onSearch={handleSearch} />

//       {/* Main Content Layout */}
//       <div className="flex min-h-[calc(100vh-80px)]">
//         {/* Desktop Sidebar */}
//         <aside className="hidden lg:block w-80 flex-shrink-0">
//           {catsLoading ? (
//             <div className="h-full bg-white border-r border-gray-200 flex items-center justify-center">
//               <div className="flex items-center gap-2">
//                 <Loader2 className="h-5 w-5 animate-spin" />
//                 <span className="text-sm text-gray-600">
//                   Loading categories...
//                 </span>
//               </div>
//             </div>
//           ) : catsError ? (
//             <div className="h-full bg-white border-r border-gray-200 flex items-center justify-center p-4">
//               <div className="text-center text-sm text-red-600">
//                 Failed to load categories
//               </div>
//             </div>
//           ) : (
//             <Sidebar
//               items={sidebarItems}
//               selectedProtocol={selectedProtocol}
//               onItemClick={onProtocolClick}
//               onCategoryToggle={onCategoryToggle}
//               loadingCategoryId={loadingCategoryId}
//               expandedCategories={expandedCategories}
//             />
//           )}
//         </aside>

//         {/* Mobile Sidebar */}
//         <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
//           <SheetTrigger asChild>
//             <Button
//               variant="default"
//               size="lg"
//               className="fixed bottom-6 right-6 z-50 lg:hidden shadow-lg rounded-full h-14 w-14 p-0"
//             >
//               <Menu className="h-6 w-6" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="p-0 w-80">
//             {catsLoading ? (
//               <div className="h-full flex items-center justify-center">
//                 <div className="flex items-center gap-2">
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                   <span className="text-sm text-gray-600">Loading...</span>
//                 </div>
//               </div>
//             ) : catsError ? (
//               <div className="h-full flex items-center justify-center p-4">
//                 <div className="text-center text-sm text-red-600">
//                   Failed to load categories
//                 </div>
//               </div>
//             ) : (
//               <Sidebar
//                 items={sidebarItems}
//                 selectedProtocol={selectedProtocol}
//                 onItemClick={onProtocolClick}
//                 onCategoryToggle={onCategoryToggle}
//                 loadingCategoryId={loadingCategoryId}
//                 expandedCategories={expandedCategories}
//               />
//             )}
//           </SheetContent>
//         </Sheet>

//         {/* Main Content */}
//         <main className="flex-1 min-w-0">
//           <div className="p-4 lg:p-8">
//             {/* Mobile Search */}
//             <div className="md:hidden mb-4">
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   const formData = new FormData(e.currentTarget);
//                   const query = formData.get("query") as string;
//                   handleSearch(query);
//                 }}
//               >
//                 <div className="bg-white rounded-full flex items-center overflow-hidden shadow-sm border">
//                   <div className="pl-4">
//                     <Search className="h-4 w-4 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     name="query"
//                     placeholder="Search in Protocols"
//                     className="flex-1 px-3 py-3 text-sm text-gray-700 focus:outline-none bg-transparent"
//                   />
//                   <Button type="submit" size="sm" className="m-1 rounded-full">
//                     Search
//                   </Button>
//                 </div>
//               </form>
//             </div>

//             {catsLoading ? (
//               <div className="max-w-5xl mx-auto">
//                 <div className="bg-white rounded-2xl border shadow-sm p-6 animate-pulse">
//                   <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
//                   <div className="h-4 w-full bg-gray-200 rounded mb-2" />
//                   <div className="h-4 w-11/12 bg-gray-200 rounded" />
//                 </div>
//               </div>
//             ) : catsError ? (
//               <div className="max-w-5xl mx-auto">
//                 <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
//                   Failed to load categories.
//                 </div>
//               </div>
//             ) : !selectedProtocol ? (
//               <EmptyState />
//             ) : (
//               <div className="max-w-5xl mx-auto">
//                 <ProtocolContent protocolSlug={selectedProtocol} />
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import {
//   Menu,
//   X,
//   ChevronDown,
//   ChevronRight,
//   Loader2,
//   FileText,
//   Search,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import {
//   getProtocolCategories,
//   getProtocolsByCategorySlug,
// } from "@/lib/api/protocols.service";
// import { qk } from "@/lib/queryKeys";
// import EmptyState from "./components/emptyState";
// import ProtocolContent from "./components/protocolContent";
// import PageHeader from "@/app/components/common/PageHeader";

// interface SidebarItem {
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

// // Sidebar Component
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

// // Main Protocols Page Component
// export default function ProtocolsPage() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const queryClient = useQueryClient();

//   const selectedCategory = searchParams.get("cat") || undefined;
//   const selectedProtocol = searchParams.get("sec") || undefined;

//   const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
//     new Set()
//   );
//   const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(
//     null
//   );
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

//   // Fetch categories
//   const {
//     data: categories,
//     isLoading: catsLoading,
//     isError: catsError,
//   } = useQuery({
//     queryKey: qk.protocols.categories,
//     queryFn: ({ signal }) => getProtocolCategories(signal),
//     staleTime: 5 * 60_000,
//   });

//   // Prepare sidebar items
//   const sidebarItems = useMemo<SidebarItem[]>(
//     () => (categories || []).map((c) => ({ id: c.slug, title: c.title })),
//     [categories]
//   );

//   // Update URL parameters
//   const updateQuery = (params: Record<string, string | undefined>) => {
//     const sp = new URLSearchParams(searchParams.toString());
//     Object.entries(params).forEach(([k, v]) => {
//       if (v == null || v === "") sp.delete(k);
//       else sp.set(k, v);
//     });
//     router.replace(`${pathname}?${sp.toString()}`);
//   };

//   // Handle category toggle
//   const onCategoryToggle = async (
//     categorySlug: string,
//     willExpand: boolean
//   ) => {
//     if (willExpand) {
//       setExpandedCategories((prev) => new Set(prev).add(categorySlug));

//       // Check if already loaded
//       const existingItem = sidebarItems.find(
//         (item) => item.id === categorySlug
//       );
//       if (existingItem?.children && existingItem.children.length > 0) {
//         return;
//       }

//       setLoadingCategoryId(categorySlug);
//       try {
//         const protocols = await queryClient.fetchQuery({
//           queryKey: qk.protocols.sections(categorySlug),
//           queryFn: ({ signal }) =>
//             getProtocolsByCategorySlug(categorySlug, signal),
//           staleTime: 60_000,
//         });

//         // Update the specific item with children
//         const itemIndex = sidebarItems.findIndex(
//           (item) => item.id === categorySlug
//         );
//         if (itemIndex !== -1) {
//           sidebarItems[itemIndex].children = (protocols || []).map((p) => ({
//             id: p.slug,
//             title: p.title,
//           }));
//         }

//         // Auto-select first protocol if none selected
//         if (!selectedProtocol && protocols && protocols[0]) {
//           updateQuery({ cat: categorySlug, sec: protocols[0].slug });
//         }
//       } finally {
//         setLoadingCategoryId(null);
//       }
//     } else {
//       setExpandedCategories((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(categorySlug);
//         return newSet;
//       });
//     }
//   };

//   // Handle protocol selection
//   const onProtocolClick = (item: SidebarItem) => {
//     const parentCategory = sidebarItems.find((cat) =>
//       cat.children?.some((child) => child.id === item.id)
//     );
//     const categorySlug = parentCategory?.id || selectedCategory;

//     updateQuery({ cat: categorySlug, sec: item.id });
//     setIsMobileSidebarOpen(false);
//   };

//   // Auto-expand selected category
//   useEffect(() => {
//     if (selectedCategory && !expandedCategories.has(selectedCategory)) {
//       onCategoryToggle(selectedCategory, true);
//     }
//   }, [selectedCategory]);

//   // Close mobile sidebar on route change
//   useEffect(() => {
//     setIsMobileSidebarOpen(false);
//   }, [selectedProtocol]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Compact Page Header */}
//       <div className="bg-gradient-to-r from-[#136fb7] to-[#0a2c75] px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center">
//               <FileText className="w-6 h-6 text-blue-900" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-white">Protocols</h1>
//               <p className="text-blue-100 text-sm">Browse Clinical Protocols</p>
//             </div>
//           </div>
//           <div className="hidden md:flex">
//             <div className="bg-white rounded-full flex items-center overflow-hidden shadow-lg max-w-md">
//               <div className="pl-4">
//                 <Search className="h-4 w-4 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search in Protocols"
//                 className="flex-1 px-3 py-2 text-sm text-gray-700 focus:outline-none bg-transparent"
//               />
//               <Button size="sm" className="m-1 rounded-full">
//                 Search
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Layout */}
//       <div className="flex min-h-[calc(100vh-80px)]">
//         {/* Desktop Sidebar */}
//         <aside className="hidden lg:block w-80 flex-shrink-0">
//           {catsLoading ? (
//             <div className="h-full bg-white border-r border-gray-200 flex items-center justify-center">
//               <div className="flex items-center gap-2">
//                 <Loader2 className="h-5 w-5 animate-spin" />
//                 <span className="text-sm text-gray-600">
//                   Loading categories...
//                 </span>
//               </div>
//             </div>
//           ) : catsError ? (
//             <div className="h-full bg-white border-r border-gray-200 flex items-center justify-center p-4">
//               <div className="text-center text-sm text-red-600">
//                 Failed to load categories
//               </div>
//             </div>
//           ) : (
//             <Sidebar
//               items={sidebarItems}
//               selectedProtocol={selectedProtocol}
//               onItemClick={onProtocolClick}
//               onCategoryToggle={onCategoryToggle}
//               loadingCategoryId={loadingCategoryId}
//               expandedCategories={expandedCategories}
//             />
//           )}
//         </aside>

//         {/* Mobile Sidebar */}
//         <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
//           <SheetTrigger asChild>
//             <Button
//               variant="default"
//               size="lg"
//               className="fixed bottom-6 right-6 z-50 lg:hidden shadow-lg rounded-full h-14 w-14 p-0"
//             >
//               <Menu className="h-6 w-6" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="p-0 w-80">
//             {catsLoading ? (
//               <div className="h-full flex items-center justify-center">
//                 <div className="flex items-center gap-2">
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                   <span className="text-sm text-gray-600">Loading...</span>
//                 </div>
//               </div>
//             ) : catsError ? (
//               <div className="h-full flex items-center justify-center p-4">
//                 <div className="text-center text-sm text-red-600">
//                   Failed to load categories
//                 </div>
//               </div>
//             ) : (
//               <Sidebar
//                 items={sidebarItems}
//                 selectedProtocol={selectedProtocol}
//                 onItemClick={onProtocolClick}
//                 onCategoryToggle={onCategoryToggle}
//                 loadingCategoryId={loadingCategoryId}
//                 expandedCategories={expandedCategories}
//               />
//             )}
//           </SheetContent>
//         </Sheet>

//         {/* Main Content */}
//         <main className="flex-1 min-w-0">
//           <div className="p-4 lg:p-8">
//             {/* Mobile Search */}
//             <div className="md:hidden mb-4">
//               <div className="bg-white rounded-full flex items-center overflow-hidden shadow-sm border">
//                 <div className="pl-4">
//                   <Search className="h-4 w-4 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search in Protocols"
//                   className="flex-1 px-3 py-3 text-sm text-gray-700 focus:outline-none bg-transparent"
//                 />
//                 <Button size="sm" className="m-1 rounded-full">
//                   Search
//                 </Button>
//               </div>
//             </div>

//             {catsLoading ? (
//               <div className="max-w-5xl mx-auto">
//                 <div className="bg-white rounded-2xl border shadow-sm p-6 animate-pulse">
//                   <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
//                   <div className="h-4 w-full bg-gray-200 rounded mb-2" />
//                   <div className="h-4 w-11/12 bg-gray-200 rounded" />
//                 </div>
//               </div>
//             ) : catsError ? (
//               <div className="max-w-5xl mx-auto">
//                 <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
//                   Failed to load categories.
//                 </div>
//               </div>
//             ) : !selectedProtocol ? (
//               <EmptyState />
//             ) : (
//               <div className="max-w-5xl mx-auto">
//                 <ProtocolContent protocolSlug={selectedProtocol} />
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";

// import {
//   getProtocolCategories,
//   getProtocolsByCategorySlug,
// } from "@/lib/api/protocols.service";
// import { qk } from "@/lib/queryKeys";
// import SidebarTree, { SidebarItem } from "../flow/sidebar";
// import EmptyState from "./components/emptyState";
// import ProtocolContent from "./components/protocolContent";
// import PageHeader from "@/app/components/common/PageHeader";

// export default function ProtocolsPage() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const queryClient = useQueryClient();

//   const selectedCategory = searchParams.get("cat") || undefined; // category slug
//   const selectedProtocol = searchParams.get("sec") || undefined; // protocol slug

//   const {
//     data: categories,
//     isLoading: catsLoading,
//     isError: catsError,
//   } = useQuery({
//     queryKey: qk.protocols.categories,
//     queryFn: ({ signal }) => getProtocolCategories(signal),
//     staleTime: 5 * 60_000,
//   });

//   const initialItems = useMemo<SidebarItem[]>(
//     () => (categories || []).map((c) => ({ id: c.slug, title: c.title })),
//     [categories]
//   );
//   const [items, setItems] = useState<SidebarItem[]>(initialItems);
//   const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(
//     null
//   );
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   useEffect(() => {
//     setItems(initialItems);
//   }, [initialItems]);

//   const updateQuery = (params: Record<string, string | undefined>) => {
//     const sp = new URLSearchParams(searchParams.toString());
//     Object.entries(params).forEach(([k, v]) => {
//       if (v == null || v === "") sp.delete(k);
//       else sp.set(k, v);
//     });
//     router.replace(`${pathname}?${sp.toString()}`);
//   };

//   const onCategoryToggle = async (
//     categorySlug: string,
//     willExpand: boolean
//   ) => {
//     if (!willExpand) return;
//     const already = items.find((i) => i.id === categorySlug)?.children;
//     if (already && already.length) return;

//     setLoadingCategoryId(categorySlug);
//     try {
//       const list = await queryClient.fetchQuery({
//         queryKey: qk.protocols.sections(categorySlug),
//         queryFn: ({ signal }) =>
//           getProtocolsByCategorySlug(categorySlug, signal),
//         staleTime: 60_000,
//       });

//       setItems((prev) =>
//         prev.map((it) =>
//           it.id === categorySlug
//             ? {
//                 ...it,
//                 children: (list || []).map((a) => ({
//                   id: a.slug,
//                   title: a.title,
//                 })),
//               }
//             : it
//         )
//       );

//       if (!selectedProtocol && list && list[0])
//         updateQuery({ cat: categorySlug, sec: list[0].slug });
//     } finally {
//       setLoadingCategoryId(null);
//     }
//   };

//   const onChildClick = (item: SidebarItem) => {
//     const parent = items.find((it) =>
//       it.children?.some((c) => c.id === item.id)
//     );
//     const catSlug = parent?.id || selectedCategory || undefined;
//     updateQuery({ cat: catSlug, sec: item.id });
//     setIsSidebarOpen(false);
//   };

//   const selectedCategoryTitle = useMemo(
//     () => categories?.find((c: any) => c.slug === selectedCategory)?.title,
//     [categories, selectedCategory]
//   );
//   const selectedProtocolTitle = useMemo(() => {
//     if (!selectedProtocol) return undefined;
//     const parent = items.find((it) =>
//       it.children?.some((c) => c.id === selectedProtocol)
//     );
//     const child = parent?.children?.find((c) => c.id === selectedProtocol);
//     return child?.title;
//   }, [items, selectedProtocol]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <PageHeader
//         title="Protocols"
//         description="Browse Clinical Protocols of family medicine guide"
//         showSearch={true}
//         searchPlaceholder="Search in Protocols"
//         onSearch={() => {}}
//       />
//       {/* Mobile menu button */}
//       <div className="lg:hidden fixed bottom-4 right-4 z-[55]">
//         <button
//           onClick={() => setIsSidebarOpen(true)}
//           className="bg-[#1D4671] text-white p-3 rounded-full shadow-lg hover:bg-[#153654] transition-colors"
//           aria-label="Open menu"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 6h16M4 12h16M4 18h16"
//             />
//           </svg>
//         </button>
//       </div>

//       <div className="flex relative">
//         {/* Sidebar - Fixed on mobile, static on desktop */}
//         <div className="fixed lg:static top-0 left-0 z-[70] w-full max-w-sm sm:w-80 lg:w-96 h-screen lg:h-auto transform transition-transform duration-300 ease-in-out lg:transform-none">
//           <SidebarTree
//             title="Clinical Protocols"
//             items={items}
//             onItemClick={onChildClick}
//             activeItemId={selectedProtocol}
//             isOpen={isSidebarOpen}
//             onClose={() => setIsSidebarOpen(false)}
//             onCategoryToggle={onCategoryToggle}
//             loadingCategoryId={loadingCategoryId}
//             className="h-full"
//           />
//         </div>

//         {/* Main content */}
//         <main className="flex-1 lg:ml-0 w-full min-w-0">
//           <div className="p-3 sm:p-4 lg:p-8 min-h-screen">
//             {catsLoading && (
//               <div className="max-w-5xl mx-auto">
//                 <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-2xl border shadow-sm animate-pulse">
//                   <div className="h-4 sm:h-5 lg:h-6 w-32 sm:w-40 lg:w-48 bg-gray-200 rounded mb-3 lg:mb-4" />
//                   <div className="h-3 sm:h-4 w-full bg-gray-200 rounded mb-2" />
//                   <div className="h-3 sm:h-4 w-11/12 bg-gray-200 rounded" />
//                 </div>
//               </div>
//             )}

//             {catsError && (
//               <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm sm:text-base">
//                 Failed to load categories.
//               </div>
//             )}

//             {!selectedProtocol ? (
//               <EmptyState />
//             ) : (
//               <div className="max-w-5xl mx-auto">
//                 <ProtocolContent protocolSlug={selectedProtocol} />
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
