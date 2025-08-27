// app/flashcards/[slug]/page.tsx
// RSC + client pagination via searchParams (?page=)
import { fetchFlashcardsByCategorySlug } from "@/lib/api/flashcards.service";
import EmptyState from "../components/EmptyState";
import FlashcardItemCard from "../components/FlashcardCard";
import ClientPager from "../components/ClientPager";
export const revalidate = 0;

export default async function FlashcardsBySlug(props: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const slug = props.params.slug;
  const page = Number(props.searchParams?.page ?? 1) || 1;

  let payload: Awaited<
    ReturnType<typeof fetchFlashcardsByCategorySlug>
  > | null = null;
  try {
    payload = await fetchFlashcardsByCategorySlug(slug, page);
  } catch (e) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4 capitalize">
          {slug.replaceAll("-", " ")}
        </h1>
        <EmptyState
          title="Couldn't load flashcards"
          description="Please try again."
        />
      </div>
    );
  }

  const items = payload?.data ?? [];
  const meta = payload?.meta;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold capitalize">
          {slug.replaceAll("-", " ")}
        </h1>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No flashcards found"
          description="This category has no flashcards yet."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((fc) => (
              <FlashcardItemCard key={fc.uuid} item={fc} />
            ))}
          </div>

          {meta && meta.last_page > 1 && (
            <div className="mt-6 flex justify-center">
              <ClientPager
                currentPage={meta.current_page}
                totalPages={meta.last_page}
                totalItems={meta.total}
                itemsPerPage={meta.per_page}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export const metadata = { title: "Flashcards Category | Daleel FM" };
