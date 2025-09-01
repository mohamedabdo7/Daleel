"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Menu, FileText, Loader2, Search } from "lucide-react";
import EmptyState from "./components/EmptyState";
import EssentialsContent from "./components/EssentialsContent";
import {
  esGetChapters,
  esGetLessons,
  esGetSections,
} from "@/lib/api/essentials.service";
import { qk } from "@/lib/queryKeys";

import PageHeader from "@/app/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DeepSidebar, {
  DeepSidebarConfig,
  DeepSidebarItem,
} from "../flow/SidebarTreeDeep";

export default function EssentialsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const selectedSection = searchParams.get("sec") || undefined;
  const selectedChapter = searchParams.get("ch") || undefined;
  const selectedLesson = searchParams.get("ls") || undefined;

  const {
    data: sections,
    isLoading: secLoading,
    isError: secError,
  } = useQuery({
    queryKey: qk.essentials.sections,
    queryFn: ({ signal }) => esGetSections(signal),
    staleTime: 5 * 60_000,
  });

  const initialItems = useMemo<DeepSidebarItem[]>(
    () =>
      (sections || []).map((s: any) => ({
        id: s.slug,
        title: s.title,
        meta: { type: "section", sectionSlug: s.slug },
        icon: FileText,
      })),
    [sections]
  );

  const [items, setItems] = useState<DeepSidebarItem[]>(initialItems);
  const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [initialExpandedIds, setInitialExpandedIds] = useState<
    string[] | undefined
  >(undefined);

  // Sidebar configuration
  const sidebarConfig: DeepSidebarConfig = {
    title: "The Essentials",
    subtitle: "Browse comprehensive family medicine essentials",
    defaultIcon: FileText,
    loadingText: "Loading content...",
    emptyText: "No sections available",
    className: "h-full",
  };

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const updateQuery = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v == null || v === "") sp.delete(k);
      else sp.set(k, v);
    });
    router.replace(`${pathname}?${sp.toString()}`);
  };

  const setNodeChildren = (
    arr: DeepSidebarItem[],
    id: string,
    children: DeepSidebarItem[]
  ): DeepSidebarItem[] => {
    return arr.map((n) => {
      if (n.id === id) return { ...n, children };
      if (n.children)
        return { ...n, children: setNodeChildren(n.children, id, children) };
      return n;
    });
  };

  // Handle search
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Implement search logic here
  };

  // Auto-build the path from URL (sec → ch → ls) and expand parents
  useEffect(() => {
    (async () => {
      if (!sections || !sections.length) return;
      if (!selectedSection) return;

      // ensure chapters
      let nextItems = items;
      const sectionNode = nextItems.find((n) => n.id === selectedSection);
      if (sectionNode && !sectionNode.children) {
        setLoadingNodeId(selectedSection);
        const chapters = await queryClient.fetchQuery({
          queryKey: qk.essentials.chapters(selectedSection),
          queryFn: ({ signal }) => esGetChapters(selectedSection, signal),
          staleTime: 120_000,
        });
        const chapterChildren = (chapters || []).map((c: any) => ({
          id: c.slug,
          title: c.title,
          meta: {
            type: "chapter",
            sectionSlug: selectedSection,
            chapterSlug: c.slug,
          },
        }));
        nextItems = setNodeChildren(
          nextItems,
          selectedSection,
          chapterChildren
        );
        setItems(nextItems);
        setLoadingNodeId(null);
      }

      // ensure lessons
      if (selectedChapter) {
        const chapterNode = nextItems
          .find((n) => n.id === selectedSection)
          ?.children?.find((c) => c.id === selectedChapter);
        if (chapterNode && !chapterNode.children) {
          setLoadingNodeId(selectedChapter);
          const lessons = await queryClient.fetchQuery({
            queryKey: qk.essentials.lessons(selectedSection, selectedChapter),
            queryFn: ({ signal }) =>
              esGetLessons(selectedSection, selectedChapter, signal),
            staleTime: 120_000,
          });
          const lessonChildren = (lessons || []).map((l: any) => ({
            id: l.slug,
            title: l.title,
            meta: {
              type: "lesson",
              sectionSlug: selectedSection,
              chapterSlug: selectedChapter,
              lessonSlug: l.slug,
            },
          }));
          nextItems = setNodeChildren(
            nextItems,
            selectedChapter,
            lessonChildren
          );
          setItems(nextItems);
          setLoadingNodeId(null);
        }
      }

      const expanded: string[] = [];
      if (selectedSection) expanded.push(selectedSection);
      if (selectedChapter) expanded.push(selectedChapter);
      setInitialExpandedIds(expanded);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections?.length, selectedSection, selectedChapter]);

  const onToggle = async (item: DeepSidebarItem, willExpand: boolean) => {
    if (!willExpand) return;
    const already = (() => {
      const find = (arr: DeepSidebarItem[]): DeepSidebarItem | undefined => {
        for (const n of arr) {
          if (n.id === item.id) return n;
          if (n.children) {
            const f = find(n.children);
            if (f) return f;
          }
        }
      };
      return find(items)?.children;
    })();
    if (already && already.length) return;

    setLoadingNodeId(item.id);
    try {
      if (item.meta?.type === "section") {
        const list = await queryClient.fetchQuery({
          queryKey: qk.essentials.chapters(item.meta.sectionSlug),
          queryFn: ({ signal }) => esGetChapters(item.meta.sectionSlug, signal),
          staleTime: 120_000,
        });
        const children = (list || []).map((c: any) => ({
          id: c.slug,
          title: c.title,
          meta: {
            type: "chapter",
            sectionSlug: item.meta!.sectionSlug,
            chapterSlug: c.slug,
          },
        }));
        setItems((prev) => setNodeChildren(prev, item.id, children));
      } else if (item.meta?.type === "chapter") {
        const list = await queryClient.fetchQuery({
          queryKey: qk.essentials.lessons(
            item.meta.sectionSlug,
            item.meta.chapterSlug
          ),
          queryFn: ({ signal }) =>
            esGetLessons(item.meta.sectionSlug, item.meta.chapterSlug, signal),
          staleTime: 120_000,
        });
        const children = (list || []).map((l: any) => ({
          id: l.slug,
          title: l.title,
          meta: {
            type: "lesson",
            sectionSlug: item.meta!.sectionSlug,
            chapterSlug: item.meta!.chapterSlug,
            lessonSlug: l.slug,
          },
        }));
        setItems((prev) => setNodeChildren(prev, item.id, children));
      }
    } finally {
      setLoadingNodeId(null);
    }
  };

  const onLeafClick = (item: DeepSidebarItem) => {
    if (item.meta?.type !== "lesson") return;
    updateQuery({
      sec: item.meta.sectionSlug,
      ch: item.meta.chapterSlug,
      ls: item.meta.lessonSlug,
    });
    setIsMobileSidebarOpen(false);
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [selectedLesson]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Page Header */}
      <PageHeader
        title="The Essentials"
        description="Browse comprehensive family medicine essentials"
        iconAlt="Essentials Icon"
        showSearch={true}
        searchPlaceholder="Search in Essentials"
        onSearch={() => {}}
      />

      {/* Main Content Layout */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          {secLoading ? (
            <div className="h-full bg-white border-r border-gray-200 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm text-gray-600">
                  {sidebarConfig.loadingText}
                </span>
              </div>
            </div>
          ) : secError ? (
            <div className="h-full bg-white border-r border-gray-200 flex items-center justify-center p-4">
              <div className="text-center text-sm text-red-600">
                Failed to load sections.
              </div>
            </div>
          ) : (
            <DeepSidebar
              items={items}
              onLeafClick={onLeafClick}
              activeLeafId={selectedLesson}
              config={sidebarConfig}
              isOpen={true}
              onClose={() => {}}
              onToggle={onToggle}
              loadingNodeId={loadingNodeId}
              initialExpandedIds={initialExpandedIds}
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
            {secLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm text-gray-600">
                    {sidebarConfig.loadingText}
                  </span>
                </div>
              </div>
            ) : secError ? (
              <div className="h-full flex items-center justify-center p-4">
                <div className="text-center text-sm text-red-600">
                  Failed to load sections.
                </div>
              </div>
            ) : (
              <DeepSidebar
                items={items}
                onLeafClick={onLeafClick}
                activeLeafId={selectedLesson}
                config={sidebarConfig}
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
                onToggle={onToggle}
                loadingNodeId={loadingNodeId}
                initialExpandedIds={initialExpandedIds}
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
                  // Handle search logic here
                }}
              >
                <div className="bg-white rounded-full flex items-center overflow-hidden shadow-sm border">
                  <div className="pl-4">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="query"
                    placeholder="Search in Essentials"
                    className="flex-1 px-3 py-3 text-sm text-gray-700 focus:outline-none bg-transparent"
                  />
                  <Button type="submit" size="sm" className="m-1 rounded-full">
                    Search
                  </Button>
                </div>
              </form>
            </div>

            {secLoading ? (
              <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl border shadow-sm p-6 animate-pulse">
                  <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
                  <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-11/12 bg-gray-200 rounded" />
                </div>
              </div>
            ) : secError ? (
              <div className="max-w-5xl mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
                  Failed to load sections.
                </div>
              </div>
            ) : !(selectedSection && selectedChapter && selectedLesson) ? (
              <EmptyState />
            ) : (
              <div className="max-w-5xl mx-auto">
                <EssentialsContent
                  sectionSlug={selectedSection}
                  chapterSlug={selectedChapter}
                  lessonSlug={selectedLesson}
                />
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
// import { Menu, FileText } from "lucide-react";
// import EmptyState from "./components/EmptyState";
// import EssentialsContent from "./components/EssentialsContent";
// import {
//   esGetChapters,
//   esGetLessons,
//   esGetSections,
// } from "@/lib/api/essentials.service";
// import { qk } from "@/lib/queryKeys";

// import PageHeader from "@/app/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import DeepSidebar, {
//   DeepSidebarConfig,
//   DeepSidebarItem,
// } from "../flow/SidebarTreeDeep";

// export default function EssentialsPage() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const queryClient = useQueryClient();

//   const selectedSection = searchParams.get("sec") || undefined;
//   const selectedChapter = searchParams.get("ch") || undefined;
//   const selectedLesson = searchParams.get("ls") || undefined;

//   const {
//     data: sections,
//     isLoading: secLoading,
//     isError: secError,
//   } = useQuery({
//     queryKey: qk.essentials.sections,
//     queryFn: ({ signal }) => esGetSections(signal),
//     staleTime: 5 * 60_000,
//   });

//   const initialItems = useMemo<DeepSidebarItem[]>(
//     () =>
//       (sections || []).map((s: any) => ({
//         id: s.slug,
//         title: s.title,
//         meta: { type: "section", sectionSlug: s.slug },
//         icon: FileText,
//       })),
//     [sections]
//   );

//   const [items, setItems] = useState<DeepSidebarItem[]>(initialItems);
//   const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [initialExpandedIds, setInitialExpandedIds] = useState<
//     string[] | undefined
//   >(undefined);

//   // Sidebar configuration
//   const sidebarConfig: DeepSidebarConfig = {
//     title: "The Essentials",
//     subtitle: "Browse comprehensive family medicine essentials",
//     defaultIcon: FileText,
//     loadingText: "Loading content...",
//     emptyText: "No sections available",
//     className: "h-full",
//   };

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

//   const setNodeChildren = (
//     arr: DeepSidebarItem[],
//     id: string,
//     children: DeepSidebarItem[]
//   ): DeepSidebarItem[] => {
//     return arr.map((n) => {
//       if (n.id === id) return { ...n, children };
//       if (n.children)
//         return { ...n, children: setNodeChildren(n.children, id, children) };
//       return n;
//     });
//   };

//   // Auto-build the path from URL (sec → ch → ls) and expand parents
//   useEffect(() => {
//     (async () => {
//       if (!sections || !sections.length) return;
//       if (!selectedSection) return;

//       // ensure chapters
//       let nextItems = items;
//       const sectionNode = nextItems.find((n) => n.id === selectedSection);
//       if (sectionNode && !sectionNode.children) {
//         setLoadingNodeId(selectedSection);
//         const chapters = await queryClient.fetchQuery({
//           queryKey: qk.essentials.chapters(selectedSection),
//           queryFn: ({ signal }) => esGetChapters(selectedSection, signal),
//           staleTime: 120_000,
//         });
//         const chapterChildren = (chapters || []).map((c: any) => ({
//           id: c.slug,
//           title: c.title,
//           meta: {
//             type: "chapter",
//             sectionSlug: selectedSection,
//             chapterSlug: c.slug,
//           },
//         }));
//         nextItems = setNodeChildren(
//           nextItems,
//           selectedSection,
//           chapterChildren
//         );
//         setItems(nextItems);
//         setLoadingNodeId(null);
//       }

//       // ensure lessons
//       if (selectedChapter) {
//         const chapterNode = nextItems
//           .find((n) => n.id === selectedSection)
//           ?.children?.find((c) => c.id === selectedChapter);
//         if (chapterNode && !chapterNode.children) {
//           setLoadingNodeId(selectedChapter);
//           const lessons = await queryClient.fetchQuery({
//             queryKey: qk.essentials.lessons(selectedSection, selectedChapter),
//             queryFn: ({ signal }) =>
//               esGetLessons(selectedSection, selectedChapter, signal),
//             staleTime: 120_000,
//           });
//           const lessonChildren = (lessons || []).map((l: any) => ({
//             id: l.slug,
//             title: l.title,
//             meta: {
//               type: "lesson",
//               sectionSlug: selectedSection,
//               chapterSlug: selectedChapter,
//               lessonSlug: l.slug,
//             },
//           }));
//           nextItems = setNodeChildren(
//             nextItems,
//             selectedChapter,
//             lessonChildren
//           );
//           setItems(nextItems);
//           setLoadingNodeId(null);
//         }
//       }

//       const expanded: string[] = [];
//       if (selectedSection) expanded.push(selectedSection);
//       if (selectedChapter) expanded.push(selectedChapter);
//       setInitialExpandedIds(expanded);
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [sections?.length, selectedSection, selectedChapter]);

//   const onToggle = async (item: DeepSidebarItem, willExpand: boolean) => {
//     if (!willExpand) return;
//     const already = (() => {
//       const find = (arr: DeepSidebarItem[]): DeepSidebarItem | undefined => {
//         for (const n of arr) {
//           if (n.id === item.id) return n;
//           if (n.children) {
//             const f = find(n.children);
//             if (f) return f;
//           }
//         }
//       };
//       return find(items)?.children;
//     })();
//     if (already && already.length) return;

//     setLoadingNodeId(item.id);
//     try {
//       if (item.meta?.type === "section") {
//         const list = await queryClient.fetchQuery({
//           queryKey: qk.essentials.chapters(item.meta.sectionSlug),
//           queryFn: ({ signal }) => esGetChapters(item.meta.sectionSlug, signal),
//           staleTime: 120_000,
//         });
//         const children = (list || []).map((c: any) => ({
//           id: c.slug,
//           title: c.title,
//           meta: {
//             type: "chapter",
//             sectionSlug: item.meta!.sectionSlug,
//             chapterSlug: c.slug,
//           },
//         }));
//         setItems((prev) => setNodeChildren(prev, item.id, children));
//       } else if (item.meta?.type === "chapter") {
//         const list = await queryClient.fetchQuery({
//           queryKey: qk.essentials.lessons(
//             item.meta.sectionSlug,
//             item.meta.chapterSlug
//           ),
//           queryFn: ({ signal }) =>
//             esGetLessons(item.meta.sectionSlug, item.meta.chapterSlug, signal),
//           staleTime: 120_000,
//         });
//         const children = (list || []).map((l: any) => ({
//           id: l.slug,
//           title: l.title,
//           meta: {
//             type: "lesson",
//             sectionSlug: item.meta!.sectionSlug,
//             chapterSlug: item.meta!.chapterSlug,
//             lessonSlug: l.slug,
//           },
//         }));
//         setItems((prev) => setNodeChildren(prev, item.id, children));
//       }
//     } finally {
//       setLoadingNodeId(null);
//     }
//   };

//   const onLeafClick = (item: DeepSidebarItem) => {
//     if (item.meta?.type !== "lesson") return;
//     updateQuery({
//       sec: item.meta.sectionSlug,
//       ch: item.meta.chapterSlug,
//       ls: item.meta.lessonSlug,
//     });
//     setIsSidebarOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <PageHeader
//         title="The Essentials"
//         description="Browse comprehensive family medicine essentials"
//         iconAlt="Essentials Icon"
//         showSearch={true}
//         searchPlaceholder="Search in Essentials"
//         onSearch={() => {}}
//       />

//       {/* Mobile menu button */}
//       <div className="lg:hidden fixed bottom-4 right-4 z-[55]">
//         <Button
//           onClick={() => setIsSidebarOpen(true)}
//           className="bg-[#1D4671] text-white p-3 rounded-full shadow-lg hover:bg-[#153654] transition-colors"
//           aria-label="Open menu"
//         >
//           <Menu className="w-6 h-6" />
//         </Button>
//       </div>

//       <div className="flex relative">
//         {/* Sidebar */}
//         <div className="w-full max-w-sm sm:w-80 lg:w-96 lg:block">
//           <DeepSidebar
//             items={items}
//             onLeafClick={onLeafClick}
//             activeLeafId={selectedLesson}
//             config={sidebarConfig}
//             isOpen={isSidebarOpen}
//             onClose={() => setIsSidebarOpen(false)}
//             onToggle={onToggle}
//             loadingNodeId={loadingNodeId}
//             initialExpandedIds={initialExpandedIds}
//           />
//         </div>

//         {/* Main content */}
//         <main className="flex-1 lg:ml-0 w-full min-w-0">
//           <div className="p-3 sm:p-4 lg:p-8 min-h-screen">
//             {secLoading && (
//               <div className="max-w-5xl mx-auto">
//                 <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-2xl border shadow-sm animate-pulse">
//                   <div className="h-4 sm:h-5 lg:h-6 w-32 sm:w-40 lg:w-48 bg-gray-200 rounded mb-3 lg:mb-4" />
//                   <div className="h-3 sm:h-4 w-full bg-gray-200 rounded mb-2" />
//                   <div className="h-3 sm:h-4 w-11/12 bg-gray-200 rounded" />
//                 </div>
//               </div>
//             )}

//             {secError && (
//               <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm sm:text-base">
//                 Failed to load sections.
//               </div>
//             )}

//             {!(selectedSection && selectedChapter && selectedLesson) ? (
//               <EmptyState />
//             ) : (
//               <div className="max-w-5xl mx-auto">
//                 <EssentialsContent
//                   sectionSlug={selectedSection}
//                   chapterSlug={selectedChapter}
//                   lessonSlug={selectedLesson}
//                 />
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
// import EmptyState from "./components/EmptyState";
// import EssentialsContent from "./components/EssentialsContent";
// import {
//   esGetChapters,
//   esGetLessons,
//   esGetSections,
// } from "@/lib/api/essentials.service";
// import { qk } from "@/lib/queryKeys";
// import SidebarTreeDeep, { SidebarDeepItem } from "../flow/SidebarTreeDeep";
// import PageHeader from "@/app/components/common/PageHeader";

// export default function EssentialsPage() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const queryClient = useQueryClient();

//   const selectedSection = searchParams.get("sec") || undefined;
//   const selectedChapter = searchParams.get("ch") || undefined;
//   const selectedLesson = searchParams.get("ls") || undefined;

//   const {
//     data: sections,
//     isLoading: secLoading,
//     isError: secError,
//   } = useQuery({
//     queryKey: qk.essentials.sections,
//     queryFn: ({ signal }) => esGetSections(signal),
//     staleTime: 5 * 60_000,
//   });

//   const initialItems = useMemo<SidebarDeepItem[]>(
//     () =>
//       (sections || []).map((s: any) => ({
//         id: s.slug,
//         title: s.title,
//         meta: { type: "section", sectionSlug: s.slug },
//       })),
//     [sections]
//   );
//   const [items, setItems] = useState<SidebarDeepItem[]>(initialItems);
//   const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [initialExpandedIds, setInitialExpandedIds] = useState<
//     string[] | undefined
//   >(undefined);

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

//   const setNodeChildren = (
//     arr: SidebarDeepItem[],
//     id: string,
//     children: SidebarDeepItem[]
//   ): SidebarDeepItem[] => {
//     return arr.map((n) => {
//       if (n.id === id) return { ...n, children };
//       if (n.children)
//         return { ...n, children: setNodeChildren(n.children, id, children) };
//       return n;
//     });
//   };

//   // Auto-build the path from URL (sec → ch → ls) and expand parents
//   useEffect(() => {
//     (async () => {
//       if (!sections || !sections.length) return;
//       if (!selectedSection) return;

//       // ensure chapters
//       let nextItems = items;
//       const sectionNode = nextItems.find((n) => n.id === selectedSection);
//       if (sectionNode && !sectionNode.children) {
//         setLoadingNodeId(selectedSection);
//         const chapters = await queryClient.fetchQuery({
//           queryKey: qk.essentials.chapters(selectedSection),
//           queryFn: ({ signal }) => esGetChapters(selectedSection, signal),
//           staleTime: 120_000,
//         });
//         const chapterChildren = (chapters || []).map((c: any) => ({
//           id: c.slug,
//           title: c.title,
//           meta: {
//             type: "chapter",
//             sectionSlug: selectedSection,
//             chapterSlug: c.slug,
//           },
//         }));
//         nextItems = setNodeChildren(
//           nextItems,
//           selectedSection,
//           chapterChildren
//         );
//         setItems(nextItems);
//         setLoadingNodeId(null);
//       }

//       // ensure lessons
//       if (selectedChapter) {
//         const chapterNode = nextItems
//           .find((n) => n.id === selectedSection)
//           ?.children?.find((c) => c.id === selectedChapter);
//         if (chapterNode && !chapterNode.children) {
//           setLoadingNodeId(selectedChapter);
//           const lessons = await queryClient.fetchQuery({
//             queryKey: qk.essentials.lessons(selectedSection, selectedChapter),
//             queryFn: ({ signal }) =>
//               esGetLessons(selectedSection, selectedChapter, signal),
//             staleTime: 120_000,
//           });
//           const lessonChildren = (lessons || []).map((l: any) => ({
//             id: l.slug,
//             title: l.title,
//             meta: {
//               type: "lesson",
//               sectionSlug: selectedSection,
//               chapterSlug: selectedChapter,
//               lessonSlug: l.slug,
//             },
//           }));
//           nextItems = setNodeChildren(
//             nextItems,
//             selectedChapter,
//             lessonChildren
//           );
//           setItems(nextItems);
//           setLoadingNodeId(null);
//         }
//       }

//       const expanded: string[] = [];
//       if (selectedSection) expanded.push(selectedSection);
//       if (selectedChapter) expanded.push(selectedChapter);
//       setInitialExpandedIds(expanded);
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [sections?.length, selectedSection, selectedChapter]);

//   const onToggle = async (item: SidebarDeepItem, willExpand: boolean) => {
//     if (!willExpand) return;
//     const already = (() => {
//       const find = (arr: SidebarDeepItem[]): SidebarDeepItem | undefined => {
//         for (const n of arr) {
//           if (n.id === item.id) return n;
//           if (n.children) {
//             const f = find(n.children);
//             if (f) return f;
//           }
//         }
//       };
//       return find(items)?.children;
//     })();
//     if (already && already.length) return;

//     setLoadingNodeId(item.id);
//     try {
//       if (item.meta?.type === "section") {
//         const list = await queryClient.fetchQuery({
//           queryKey: qk.essentials.chapters(item.meta.sectionSlug),
//           queryFn: ({ signal }) => esGetChapters(item.meta.sectionSlug, signal),
//           staleTime: 120_000,
//         });
//         const children = (list || []).map((c: any) => ({
//           id: c.slug,
//           title: c.title,
//           meta: {
//             type: "chapter",
//             sectionSlug: item.meta!.sectionSlug,
//             chapterSlug: c.slug,
//           },
//         }));
//         setItems((prev) => setNodeChildren(prev, item.id, children));
//       } else if (item.meta?.type === "chapter") {
//         const list = await queryClient.fetchQuery({
//           queryKey: qk.essentials.lessons(
//             item.meta.sectionSlug,
//             item.meta.chapterSlug
//           ),
//           queryFn: ({ signal }) =>
//             esGetLessons(item.meta.sectionSlug, item.meta.chapterSlug, signal),
//           staleTime: 120_000,
//         });
//         const children = (list || []).map((l: any) => ({
//           id: l.slug,
//           title: l.title,
//           meta: {
//             type: "lesson",
//             sectionSlug: item.meta!.sectionSlug,
//             chapterSlug: item.meta!.chapterSlug,
//             lessonSlug: l.slug,
//           },
//         }));
//         setItems((prev) => setNodeChildren(prev, item.id, children));
//       }
//     } finally {
//       setLoadingNodeId(null);
//     }
//   };

//   const onLeafClick = (item: SidebarDeepItem) => {
//     if (item.meta?.type !== "lesson") return;
//     updateQuery({
//       sec: item.meta.sectionSlug,
//       ch: item.meta.chapterSlug,
//       ls: item.meta.lessonSlug,
//     });
//     setIsSidebarOpen(false);
//   };

//   // const selectedLessonTitle = useMemo(() => {
//   //   if (!selectedLesson) return undefined;
//   //   const findTitle = (arr: SidebarDeepItem[]): string | undefined => {
//   //     for (const n of arr) {
//   //       if (n.id === selectedLesson) return n.title;
//   //       if (n.children) {
//   //         const t = findTitle(n.children);
//   //         if (t) return t;
//   //       }
//   //     }
//   //   };
//   //   return findTitle(items);
//   // }, [items, selectedLesson]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <PageHeader
//         title="The Essentials"
//         description="Browse comprehensive family medicine essentials"
//         iconAlt="Essentials Icon"
//         showSearch={true}
//         searchPlaceholder="Search in Essentials"
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
//           <SidebarTreeDeep
//             key={
//               (initialExpandedIds && initialExpandedIds.join("|")) ||
//               "essentials"
//             }
//             title="The Essentials"
//             items={items}
//             onLeafClick={onLeafClick}
//             activeLeafId={selectedLesson}
//             isOpen={isSidebarOpen}
//             onClose={() => setIsSidebarOpen(false)}
//             onToggle={onToggle}
//             loadingNodeId={loadingNodeId}
//             initialExpandedIds={initialExpandedIds}
//             className="h-full"
//           />
//         </div>

//         {/* Main content */}
//         <main className="flex-1 lg:ml-0 w-full min-w-0">
//           <div className="p-3 sm:p-4 lg:p-8 min-h-screen">
//             {secLoading && (
//               <div className="max-w-5xl mx-auto">
//                 <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-2xl border shadow-sm animate-pulse">
//                   <div className="h-4 sm:h-5 lg:h-6 w-32 sm:w-40 lg:w-48 bg-gray-200 rounded mb-3 lg:mb-4" />
//                   <div className="h-3 sm:h-4 w-full bg-gray-200 rounded mb-2" />
//                   <div className="h-3 sm:h-4 w-11/12 bg-gray-200 rounded" />
//                 </div>
//               </div>
//             )}

//             {secError && (
//               <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm sm:text-base">
//                 Failed to load sections.
//               </div>
//             )}

//             {!(selectedSection && selectedChapter && selectedLesson) ? (
//               <EmptyState />
//             ) : (
//               <div className="max-w-5xl mx-auto">
//                 <EssentialsContent
//                   sectionSlug={selectedSection}
//                   chapterSlug={selectedChapter}
//                   lessonSlug={selectedLesson}
//                 />
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
