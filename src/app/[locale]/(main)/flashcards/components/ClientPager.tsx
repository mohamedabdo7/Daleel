// components/flashcards/ClientPager.tsx
"use client";

import Pagination from "@/app/components/common/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function ClientPager({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: Props) {
  const router = useRouter();
  const search = useSearchParams();

  const onPageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(search?.toString());
      if (page <= 1) params.delete("page");
      else params.set("page", String(page));
      router.replace(`?${params.toString()}`);
    },
    [router, search]
  );

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      onPageChange={onPageChange}
      showInfo
    />
  );
}
