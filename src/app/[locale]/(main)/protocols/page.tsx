"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  getProtocolCategories,
  getProtocolsByCategorySlug,
} from "@/lib/api/protocols.service";
import { qk } from "@/lib/queryKeys";
import SidebarTree, { SidebarItem } from "../flow/sidebar";
import EmptyState from "./components/emptyState";
import ProtocolContent from "./components/protocolContent";
import PageHeader from "@/app/components/common/PageHeader";

export default function ProtocolsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const selectedCategory = searchParams.get("cat") || undefined; // category slug
  const selectedProtocol = searchParams.get("sec") || undefined; // protocol slug

  const {
    data: categories,
    isLoading: catsLoading,
    isError: catsError,
  } = useQuery({
    queryKey: qk.protocols.categories,
    queryFn: ({ signal }) => getProtocolCategories(signal),
    staleTime: 5 * 60_000,
  });

  const initialItems = useMemo<SidebarItem[]>(
    () => (categories || []).map((c) => ({ id: c.slug, title: c.title })),
    [categories]
  );
  const [items, setItems] = useState<SidebarItem[]>(initialItems);
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(
    null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const onCategoryToggle = async (
    categorySlug: string,
    willExpand: boolean
  ) => {
    if (!willExpand) return;
    const already = items.find((i) => i.id === categorySlug)?.children;
    if (already && already.length) return;

    setLoadingCategoryId(categorySlug);
    try {
      const list = await queryClient.fetchQuery({
        queryKey: qk.protocols.sections(categorySlug),
        queryFn: ({ signal }) =>
          getProtocolsByCategorySlug(categorySlug, signal),
        staleTime: 60_000,
      });

      setItems((prev) =>
        prev.map((it) =>
          it.id === categorySlug
            ? {
                ...it,
                children: (list || []).map((a) => ({
                  id: a.slug,
                  title: a.title,
                })),
              }
            : it
        )
      );

      if (!selectedProtocol && list && list[0])
        updateQuery({ cat: categorySlug, sec: list[0].slug });
    } finally {
      setLoadingCategoryId(null);
    }
  };

  const onChildClick = (item: SidebarItem) => {
    const parent = items.find((it) =>
      it.children?.some((c) => c.id === item.id)
    );
    const catSlug = parent?.id || selectedCategory || undefined;
    updateQuery({ cat: catSlug, sec: item.id });
    setIsSidebarOpen(false);
  };

  const selectedCategoryTitle = useMemo(
    () => categories?.find((c: any) => c.slug === selectedCategory)?.title,
    [categories, selectedCategory]
  );
  const selectedProtocolTitle = useMemo(() => {
    if (!selectedProtocol) return undefined;
    const parent = items.find((it) =>
      it.children?.some((c) => c.id === selectedProtocol)
    );
    const child = parent?.children?.find((c) => c.id === selectedProtocol);
    return child?.title;
  }, [items, selectedProtocol]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <PageHeader
        title="Protocols"
        description="Browse Clinical Protocols of family medicine guide"
        showSearch={true}
        searchPlaceholder="Search in Protocols"
        onSearch={() => {}}
      />
      {/* Mobile menu button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-[55]">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="bg-[#1D4671] text-white p-3 rounded-full shadow-lg hover:bg-[#153654] transition-colors"
          aria-label="Open menu"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex relative">
        {/* Sidebar - Fixed on mobile, static on desktop */}
        <div className="fixed lg:static top-0 left-0 z-[70] w-full max-w-sm sm:w-80 lg:w-96 h-screen lg:h-auto transform transition-transform duration-300 ease-in-out lg:transform-none">
          <SidebarTree
            title="Clinical Protocols"
            items={items}
            onItemClick={onChildClick}
            activeItemId={selectedProtocol}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onCategoryToggle={onCategoryToggle}
            loadingCategoryId={loadingCategoryId}
            className="h-full"
          />
        </div>

        {/* Main content */}
        <main className="flex-1 lg:ml-0 w-full min-w-0">
          <div className="p-3 sm:p-4 lg:p-8 min-h-screen">
            {catsLoading && (
              <div className="max-w-5xl mx-auto">
                <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-2xl border shadow-sm animate-pulse">
                  <div className="h-4 sm:h-5 lg:h-6 w-32 sm:w-40 lg:w-48 bg-gray-200 rounded mb-3 lg:mb-4" />
                  <div className="h-3 sm:h-4 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-3 sm:h-4 w-11/12 bg-gray-200 rounded" />
                </div>
              </div>
            )}

            {catsError && (
              <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm sm:text-base">
                Failed to load categories.
              </div>
            )}

            {!selectedProtocol ? (
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
