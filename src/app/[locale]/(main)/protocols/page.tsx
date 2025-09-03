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
import { SidebarConfig, SidebarItem } from "../flow/sidebar";
import PageHeader from "@/app/components/common/PageHeader";
import GenericSidebar from "../flow/GenericSidebar";

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
            {/* <div className="md:hidden mb-4">
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
            </div> */}

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
