"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Menu, FileText, Loader2, Search } from "lucide-react";
import EmptyState from "./components/EmptyState";
import EssentialsContent from "./components/EssentialsContent";
import EssentialsChapterContent from "./components/EssentialsChapterContent";
import {
  esGetChapters,
  esGetLessons,
  esGetSections,
} from "@/lib/api/essentials.service";
import { qk } from "@/lib/queryKeys";

import PageHeader from "@/app/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeepSidebar, {
  DeepSidebarConfig,
  DeepSidebarItem,
} from "../flow/SidebarTreeDeep";
import GenericSidebar, { SidebarConfig, SidebarItem } from "./../flow/sidebar";

type ReadMode = "lesson" | "chapter";

export default function EssentialsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const selectedSection = searchParams.get("sec") || undefined;
  const selectedChapter = searchParams.get("ch") || undefined;
  const selectedLesson = searchParams.get("ls") || undefined;
  const readMode = (searchParams.get("mode") as ReadMode) || "chapter";

  const {
    data: sections,
    isLoading: secLoading,
    isError: secError,
  } = useQuery({
    queryKey: qk.essentials.sections,
    queryFn: ({ signal }) => esGetSections(signal),
    staleTime: 5 * 60_000,
  });

  // Deep sidebar items for lesson mode
  const initialDeepItems = useMemo<DeepSidebarItem[]>(
    () =>
      (sections || []).map((s: any) => ({
        id: s.slug,
        title: s.title,
        meta: { type: "section", sectionSlug: s.slug },
        icon: FileText,
      })),
    [sections]
  );

  // Generic sidebar items for chapter mode
  const initialGenericItems = useMemo<SidebarItem[]>(
    () =>
      (sections || []).map((s: any) => ({
        id: s.slug,
        title: s.title,
        icon: FileText,
      })),
    [sections]
  );

  const [deepItems, setDeepItems] =
    useState<DeepSidebarItem[]>(initialDeepItems);
  const [genericItems, setGenericItems] =
    useState<SidebarItem[]>(initialGenericItems);
  const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [initialExpandedIds, setInitialExpandedIds] = useState<
    string[] | undefined
  >(undefined);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // Sidebar configurations
  const deepSidebarConfig: DeepSidebarConfig = {
    title: "The Essentials",
    subtitle: "Browse by lessons",
    defaultIcon: FileText,
    loadingText: "Loading content...",
    emptyText: "No sections available",
    className: "h-full",
  };

  const genericSidebarConfig: SidebarConfig = {
    title: "The Essentials",
    subtitle: "Browse by chapters",
    defaultIcon: FileText,
    loadingText: "Loading chapters...",
    emptyText: "No sections available",
    className: "h-full",
  };

  useEffect(() => {
    setDeepItems(initialDeepItems);
  }, [initialDeepItems]);

  useEffect(() => {
    setGenericItems(initialGenericItems);
  }, [initialGenericItems]);

  const updateQuery = (params: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v == null || v === "") sp.delete(k);
      else sp.set(k, v);
    });
    router.replace(`${pathname}?${sp.toString()}`);
  };

  const handleModeChange = (newMode: ReadMode) => {
    updateQuery({
      mode: newMode,
      sec: undefined,
      ch: undefined,
      ls: undefined,
    });
  };

  // Helper to update children for deep sidebar
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

  // Helper to update children for generic sidebar
  const setGenericNodeChildren = (
    arr: SidebarItem[],
    id: string,
    children: SidebarItem[]
  ): SidebarItem[] => {
    return arr.map((n) => {
      if (n.id === id) return { ...n, children };
      if (n.children)
        return {
          ...n,
          children: setGenericNodeChildren(n.children, id, children),
        };
      return n;
    });
  };

  // Auto-load & expand path for lesson mode
  useEffect(() => {
    if (readMode !== "lesson") return;

    (async () => {
      if (!sections || !sections.length) return;
      if (!selectedSection) return;

      let nextItems = deepItems;
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
        setDeepItems(nextItems);
        setLoadingNodeId(null);
      }

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
          setDeepItems(nextItems);
          setLoadingNodeId(null);
        }
      }

      const expanded: string[] = [];
      if (selectedSection) expanded.push(selectedSection);
      if (selectedChapter) expanded.push(selectedChapter);
      setInitialExpandedIds(expanded);
    })();
  }, [
    sections?.length,
    selectedSection,
    selectedChapter,
    readMode,
    deepItems,
    queryClient,
  ]);

  // Handle deep sidebar toggle (lesson mode)
  const onDeepToggle = async (item: DeepSidebarItem, willExpand: boolean) => {
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
      return find(deepItems)?.children;
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
        setDeepItems((prev) => setNodeChildren(prev, item.id, children));
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
        setDeepItems((prev) => setNodeChildren(prev, item.id, children));
      }
    } finally {
      setLoadingNodeId(null);
    }
  };

  // Handle generic sidebar category toggle (chapter mode)
  const onCategoryToggle = async (
    categorySlug: string,
    willExpand: boolean
  ) => {
    if (willExpand) {
      setExpandedCategories((prev) => new Set([...prev, categorySlug]));

      // Load chapters if not already loaded
      const categoryNode = genericItems.find(
        (item) => item.id === categorySlug
      );
      if (categoryNode && !categoryNode.children) {
        setLoadingNodeId(categorySlug);
        try {
          const chapters = await queryClient.fetchQuery({
            queryKey: qk.essentials.chapters(categorySlug),
            queryFn: ({ signal }) => esGetChapters(categorySlug, signal),
            staleTime: 120_000,
          });
          const chapterChildren = (chapters || []).map((c: any) => ({
            id: c.slug,
            title: c.title,
          }));
          setGenericItems((prev) =>
            setGenericNodeChildren(prev, categorySlug, chapterChildren)
          );
        } finally {
          setLoadingNodeId(null);
        }
      }
    } else {
      setExpandedCategories((prev) => {
        const next = new Set(prev);
        next.delete(categorySlug);
        return next;
      });
    }
  };

  // Handle deep sidebar leaf click (lesson mode)
  const onDeepLeafClick = (item: DeepSidebarItem) => {
    if (item.meta?.type !== "lesson") return;
    updateQuery({
      mode: "lesson",
      sec: item.meta.sectionSlug,
      ch: item.meta.chapterSlug,
      ls: item.meta.lessonSlug,
    });
    setIsMobileSidebarOpen(false);
  };

  // Handle generic sidebar item click (chapter mode)
  const onGenericItemClick = (item: SidebarItem) => {
    // Find the parent section
    const parentSection = genericItems.find((section) =>
      section.children?.some((child) => child.id === item.id)
    );

    if (parentSection) {
      // This is a chapter click
      updateQuery({
        mode: "chapter",
        sec: parentSection.id,
        ch: item.id,
        ls: undefined,
      });
    }
    setIsMobileSidebarOpen(false);
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [selectedLesson, selectedChapter]);

  const renderSidebar = () => {
    if (secLoading) {
      return (
        <div className="h-full bg-white border-r border-gray-200 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm text-gray-600">Loading content...</span>
          </div>
        </div>
      );
    }

    if (secError) {
      return (
        <div className="h-full bg-white border-r border-gray-200 flex items-center justify-center p-4">
          <div className="text-center text-sm text-red-600">
            Failed to load sections.
          </div>
        </div>
      );
    }

    if (readMode === "lesson") {
      return (
        <DeepSidebar
          items={deepItems}
          onLeafClick={onDeepLeafClick}
          activeLeafId={selectedLesson}
          config={deepSidebarConfig}
          isOpen={true}
          onClose={() => {}}
          onToggle={onDeepToggle}
          loadingNodeId={loadingNodeId}
          initialExpandedIds={initialExpandedIds}
        />
      );
    } else {
      return (
        <GenericSidebar
          items={genericItems}
          selectedItemId={selectedChapter}
          onItemClick={onGenericItemClick}
          onCategoryToggle={onCategoryToggle}
          loadingCategoryId={loadingNodeId}
          expandedCategories={expandedCategories}
          config={genericSidebarConfig}
          isOpen={true}
          onClose={() => {}}
        />
      );
    }
  };

  const renderMobileSidebar = () => {
    if (secLoading) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm text-gray-600">Loading content...</span>
          </div>
        </div>
      );
    }

    if (secError) {
      return (
        <div className="h-full flex items-center justify-center p-4">
          <div className="text-center text-sm text-red-600">
            Failed to load sections.
          </div>
        </div>
      );
    }

    if (readMode === "lesson") {
      return (
        <DeepSidebar
          items={deepItems}
          onLeafClick={onDeepLeafClick}
          activeLeafId={selectedLesson}
          config={deepSidebarConfig}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          onToggle={onDeepToggle}
          loadingNodeId={loadingNodeId}
          initialExpandedIds={initialExpandedIds}
        />
      );
    } else {
      return (
        <GenericSidebar
          items={genericItems}
          selectedItemId={selectedChapter}
          onItemClick={onGenericItemClick}
          onCategoryToggle={onCategoryToggle}
          loadingCategoryId={loadingNodeId}
          expandedCategories={expandedCategories}
          config={genericSidebarConfig}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      );
    }
  };

  const renderMainContent = () => {
    if (secLoading) {
      return (
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border shadow-sm p-6 animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
            <div className="h-4 w-full bg-gray-200 rounded mb-2" />
            <div className="h-4 w-11/12 bg-gray-200 rounded" />
          </div>
        </div>
      );
    }

    if (secError) {
      return (
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
            Failed to load sections.
          </div>
        </div>
      );
    }

    if (readMode === "lesson") {
      if (!(selectedSection && selectedChapter && selectedLesson)) {
        return <EmptyState />;
      }
      return (
        <div className="max-w-5xl mx-auto">
          <EssentialsContent
            sectionSlug={selectedSection}
            chapterSlug={selectedChapter}
            lessonSlug={selectedLesson}
          />
        </div>
      );
    } else {
      if (!(selectedSection && selectedChapter)) {
        return (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200/60 p-8 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Select a Chapter
              </h2>
              <p className="text-gray-600">
                Choose a section and chapter from the sidebar to view all
                lessons in that chapter.
              </p>
            </div>
          </div>
        );
      }
      return (
        <div className="max-w-5xl mx-auto">
          <EssentialsChapterContent
            sectionSlug={selectedSection}
            chapterSlug={selectedChapter}
          />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <PageHeader
        title="The Essentials"
        description="Browse comprehensive family medicine essentials"
        iconAlt="Essentials Icon"
        showSearch={true}
        searchPlaceholder="Search in Essentials"
        onSearch={() => {}}
      />

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          {renderSidebar()}
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
            {renderMobileSidebar()}
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="p-4 lg:p-8">
            {/* Reading Mode Tabs */}
            <div className="mb-6">
              <Tabs
                value={readMode}
                onValueChange={(value) => handleModeChange(value as ReadMode)}
              >
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                  <TabsTrigger value="chapter" className="text-sm">
                    Read by Chapter
                  </TabsTrigger>
                  <TabsTrigger value="lesson" className="text-sm">
                    Read by Lesson
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {renderMainContent()}
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
// import { Menu, FileText, Loader2, Search } from "lucide-react";
// import EmptyState from "./components/EmptyState";
// import EssentialsContent from "./components/EssentialsContent";
// import EssentialsChapterContent from "./components/EssentialsChapterContent";
// import {
//   esGetChapters,
//   esGetLessons,
//   esGetSections,
// } from "@/lib/api/essentials.service";
// import { qk } from "@/lib/queryKeys";

// import PageHeader from "@/app/components/common/PageHeader";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import DeepSidebar, {
//   DeepSidebarConfig,
//   DeepSidebarItem,
// } from "../flow/SidebarTreeDeep";
// import GenericSidebar, { SidebarConfig, SidebarItem } from "./../flow/sidebar";

// type ReadMode = "lesson" | "chapter";

// export default function EssentialsPage() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const queryClient = useQueryClient();

//   const selectedSection = searchParams.get("sec") || undefined;
//   const selectedChapter = searchParams.get("ch") || undefined;
//   const selectedLesson = searchParams.get("ls") || undefined;
//   const readMode = (searchParams.get("mode") as ReadMode) || "lesson";

//   const {
//     data: sections,
//     isLoading: secLoading,
//     isError: secError,
//   } = useQuery({
//     queryKey: qk.essentials.sections,
//     queryFn: ({ signal }) => esGetSections(signal),
//     staleTime: 5 * 60_000,
//   });

//   // Deep sidebar items for lesson mode
//   const initialDeepItems = useMemo<DeepSidebarItem[]>(
//     () =>
//       (sections || []).map((s: any) => ({
//         id: s.slug,
//         title: s.title,
//         meta: { type: "section", sectionSlug: s.slug },
//         icon: FileText,
//       })),
//     [sections]
//   );

//   // Generic sidebar items for chapter mode
//   const initialGenericItems = useMemo<SidebarItem[]>(
//     () =>
//       (sections || []).map((s: any) => ({
//         id: s.slug,
//         title: s.title,
//         icon: FileText,
//       })),
//     [sections]
//   );

//   const [deepItems, setDeepItems] =
//     useState<DeepSidebarItem[]>(initialDeepItems);
//   const [genericItems, setGenericItems] =
//     useState<SidebarItem[]>(initialGenericItems);
//   const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null);
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
//   const [initialExpandedIds, setInitialExpandedIds] = useState<
//     string[] | undefined
//   >(undefined);
//   const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
//     new Set()
//   );

//   // Sidebar configurations
//   const deepSidebarConfig: DeepSidebarConfig = {
//     title: "The Essentials",
//     subtitle: "Browse by lessons",
//     defaultIcon: FileText,
//     loadingText: "Loading content...",
//     emptyText: "No sections available",
//     className: "h-full",
//   };

//   const genericSidebarConfig: SidebarConfig = {
//     title: "The Essentials",
//     subtitle: "Browse by chapters",
//     defaultIcon: FileText,
//     loadingText: "Loading chapters...",
//     emptyText: "No sections available",
//     className: "h-full",
//   };

//   useEffect(() => {
//     setDeepItems(initialDeepItems);
//   }, [initialDeepItems]);

//   useEffect(() => {
//     setGenericItems(initialGenericItems);
//   }, [initialGenericItems]);

//   const updateQuery = (params: Record<string, string | undefined>) => {
//     const sp = new URLSearchParams(searchParams.toString());
//     Object.entries(params).forEach(([k, v]) => {
//       if (v == null || v === "") sp.delete(k);
//       else sp.set(k, v);
//     });
//     router.replace(`${pathname}?${sp.toString()}`);
//   };

//   const handleModeChange = (newMode: ReadMode) => {
//     updateQuery({
//       mode: newMode,
//       sec: undefined,
//       ch: undefined,
//       ls: undefined,
//     });
//   };

//   // Helper to update children for deep sidebar
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

//   // Helper to update children for generic sidebar
//   const setGenericNodeChildren = (
//     arr: SidebarItem[],
//     id: string,
//     children: SidebarItem[]
//   ): SidebarItem[] => {
//     return arr.map((n) => {
//       if (n.id === id) return { ...n, children };
//       if (n.children)
//         return {
//           ...n,
//           children: setGenericNodeChildren(n.children, id, children),
//         };
//       return n;
//     });
//   };

//   // Auto-load & expand path for lesson mode
//   useEffect(() => {
//     if (readMode !== "lesson") return;

//     (async () => {
//       if (!sections || !sections.length) return;
//       if (!selectedSection) return;

//       let nextItems = deepItems;
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
//         setDeepItems(nextItems);
//         setLoadingNodeId(null);
//       }

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
//           setDeepItems(nextItems);
//           setLoadingNodeId(null);
//         }
//       }

//       const expanded: string[] = [];
//       if (selectedSection) expanded.push(selectedSection);
//       if (selectedChapter) expanded.push(selectedChapter);
//       setInitialExpandedIds(expanded);
//     })();
//   }, [
//     sections?.length,
//     selectedSection,
//     selectedChapter,
//     readMode,
//     deepItems,
//     queryClient,
//   ]);

//   // Handle deep sidebar toggle (lesson mode)
//   const onDeepToggle = async (item: DeepSidebarItem, willExpand: boolean) => {
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
//       return find(deepItems)?.children;
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
//         setDeepItems((prev) => setNodeChildren(prev, item.id, children));
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
//         setDeepItems((prev) => setNodeChildren(prev, item.id, children));
//       }
//     } finally {
//       setLoadingNodeId(null);
//     }
//   };

//   // Handle generic sidebar category toggle (chapter mode)
//   const onCategoryToggle = async (
//     categorySlug: string,
//     willExpand: boolean
//   ) => {
//     if (willExpand) {
//       setExpandedCategories((prev) => new Set([...prev, categorySlug]));

//       // Load chapters if not already loaded
//       const categoryNode = genericItems.find(
//         (item) => item.id === categorySlug
//       );
//       if (categoryNode && !categoryNode.children) {
//         setLoadingNodeId(categorySlug);
//         try {
//           const chapters = await queryClient.fetchQuery({
//             queryKey: qk.essentials.chapters(categorySlug),
//             queryFn: ({ signal }) => esGetChapters(categorySlug, signal),
//             staleTime: 120_000,
//           });
//           const chapterChildren = (chapters || []).map((c: any) => ({
//             id: c.slug,
//             title: c.title,
//           }));
//           setGenericItems((prev) =>
//             setGenericNodeChildren(prev, categorySlug, chapterChildren)
//           );
//         } finally {
//           setLoadingNodeId(null);
//         }
//       }
//     } else {
//       setExpandedCategories((prev) => {
//         const next = new Set(prev);
//         next.delete(categorySlug);
//         return next;
//       });
//     }
//   };

//   // Handle deep sidebar leaf click (lesson mode)
//   const onDeepLeafClick = (item: DeepSidebarItem) => {
//     if (item.meta?.type !== "lesson") return;
//     updateQuery({
//       mode: "lesson",
//       sec: item.meta.sectionSlug,
//       ch: item.meta.chapterSlug,
//       ls: item.meta.lessonSlug,
//     });
//     setIsMobileSidebarOpen(false);
//   };

//   // Handle generic sidebar item click (chapter mode)
//   const onGenericItemClick = (item: SidebarItem) => {
//     // Find the parent section
//     const parentSection = genericItems.find((section) =>
//       section.children?.some((child) => child.id === item.id)
//     );

//     if (parentSection) {
//       // This is a chapter click
//       updateQuery({
//         mode: "chapter",
//         sec: parentSection.id,
//         ch: item.id,
//         ls: undefined,
//       });
//     }
//     setIsMobileSidebarOpen(false);
//   };

//   // Close mobile sidebar on route change
//   useEffect(() => {
//     setIsMobileSidebarOpen(false);
//   }, [selectedLesson, selectedChapter]);

//   const renderSidebar = () => {
//     if (secLoading) {
//       return (
//         <div className="h-full bg-white border-r border-gray-200 flex items-center justify-center">
//           <div className="flex items-center gap-2">
//             <Loader2 className="h-5 w-5 animate-spin" />
//             <span className="text-sm text-gray-600">Loading content...</span>
//           </div>
//         </div>
//       );
//     }

//     if (secError) {
//       return (
//         <div className="h-full bg-white border-r border-gray-200 flex items-center justify-center p-4">
//           <div className="text-center text-sm text-red-600">
//             Failed to load sections.
//           </div>
//         </div>
//       );
//     }

//     if (readMode === "lesson") {
//       return (
//         <DeepSidebar
//           items={deepItems}
//           onLeafClick={onDeepLeafClick}
//           activeLeafId={selectedLesson}
//           config={deepSidebarConfig}
//           isOpen={true}
//           onClose={() => {}}
//           onToggle={onDeepToggle}
//           loadingNodeId={loadingNodeId}
//           initialExpandedIds={initialExpandedIds}
//         />
//       );
//     } else {
//       return (
//         <GenericSidebar
//           items={genericItems}
//           selectedItemId={selectedChapter}
//           onItemClick={onGenericItemClick}
//           onCategoryToggle={onCategoryToggle}
//           loadingCategoryId={loadingNodeId}
//           expandedCategories={expandedCategories}
//           config={genericSidebarConfig}
//           isOpen={true}
//           onClose={() => {}}
//         />
//       );
//     }
//   };

//   const renderMobileSidebar = () => {
//     if (secLoading) {
//       return (
//         <div className="h-full flex items-center justify-center">
//           <div className="flex items-center gap-2">
//             <Loader2 className="h-5 w-5 animate-spin" />
//             <span className="text-sm text-gray-600">Loading content...</span>
//           </div>
//         </div>
//       );
//     }

//     if (secError) {
//       return (
//         <div className="h-full flex items-center justify-center p-4">
//           <div className="text-center text-sm text-red-600">
//             Failed to load sections.
//           </div>
//         </div>
//       );
//     }

//     if (readMode === "lesson") {
//       return (
//         <DeepSidebar
//           items={deepItems}
//           onLeafClick={onDeepLeafClick}
//           activeLeafId={selectedLesson}
//           config={deepSidebarConfig}
//           isOpen={isMobileSidebarOpen}
//           onClose={() => setIsMobileSidebarOpen(false)}
//           onToggle={onDeepToggle}
//           loadingNodeId={loadingNodeId}
//           initialExpandedIds={initialExpandedIds}
//         />
//       );
//     } else {
//       return (
//         <GenericSidebar
//           items={genericItems}
//           selectedItemId={selectedChapter}
//           onItemClick={onGenericItemClick}
//           onCategoryToggle={onCategoryToggle}
//           loadingCategoryId={loadingNodeId}
//           expandedCategories={expandedCategories}
//           config={genericSidebarConfig}
//           isOpen={isMobileSidebarOpen}
//           onClose={() => setIsMobileSidebarOpen(false)}
//         />
//       );
//     }
//   };

//   const renderMainContent = () => {
//     if (secLoading) {
//       return (
//         <div className="max-w-5xl mx-auto">
//           <div className="bg-white rounded-2xl border shadow-sm p-6 animate-pulse">
//             <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
//             <div className="h-4 w-full bg-gray-200 rounded mb-2" />
//             <div className="h-4 w-11/12 bg-gray-200 rounded" />
//           </div>
//         </div>
//       );
//     }

//     if (secError) {
//       return (
//         <div className="max-w-5xl mx-auto">
//           <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
//             Failed to load sections.
//           </div>
//         </div>
//       );
//     }

//     if (readMode === "lesson") {
//       if (!(selectedSection && selectedChapter && selectedLesson)) {
//         return <EmptyState />;
//       }
//       return (
//         <div className="max-w-5xl mx-auto">
//           <EssentialsContent
//             sectionSlug={selectedSection}
//             chapterSlug={selectedChapter}
//             lessonSlug={selectedLesson}
//           />
//         </div>
//       );
//     } else {
//       if (!(selectedSection && selectedChapter)) {
//         return (
//           <div className="max-w-5xl mx-auto">
//             <div className="bg-white rounded-3xl shadow-xl border border-gray-200/60 p-8 text-center">
//               <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//               <h2 className="text-xl font-semibold text-gray-700 mb-2">
//                 Select a Chapter
//               </h2>
//               <p className="text-gray-600">
//                 Choose a section and chapter from the sidebar to view all
//                 lessons in that chapter.
//               </p>
//             </div>
//           </div>
//         );
//       }
//       return (
//         <div className="max-w-5xl mx-auto">
//           <EssentialsChapterContent
//             sectionSlug={selectedSection}
//             chapterSlug={selectedChapter}
//           />
//         </div>
//       );
//     }
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

//       <div className="flex min-h-[calc(100vh-80px)]">
//         {/* Desktop Sidebar */}
//         <aside className="hidden lg:block w-80 flex-shrink-0">
//           {renderSidebar()}
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
//             {renderMobileSidebar()}
//           </SheetContent>
//         </Sheet>

//         {/* Main Content */}
//         <main className="flex-1 min-w-0">
//           <div className="p-4 lg:p-8">
//             {/* Reading Mode Tabs */}
//             <div className="mb-6">
//               <Tabs
//                 value={readMode}
//                 onValueChange={(value) => handleModeChange(value as ReadMode)}
//               >
//                 <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
//                   <TabsTrigger value="lesson" className="text-sm">
//                     Read by Lesson
//                   </TabsTrigger>
//                   <TabsTrigger value="chapter" className="text-sm">
//                     Read by Chapter
//                   </TabsTrigger>
//                 </TabsList>
//               </Tabs>
//             </div>

//             {renderMainContent()}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
