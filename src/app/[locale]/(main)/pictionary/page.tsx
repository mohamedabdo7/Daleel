// app/pictionary/page.tsx
import { fetchPhotos } from "@/lib/api/pictionary.service";
// import EmptyState from "@/app/flashcards/components/EmptyState";
import PictionaryCard from "./components/PictionaryCard";
import ClientPager from "../flashcards/components/ClientPager";
import EmptyState from "./components/EmptyState";

export const revalidate = 0;

export default async function PictionaryPage(props: {
  searchParams?: { page?: string };
}) {
  const page = Number(props?.searchParams?.page ?? 1) || 1;

  let payload: Awaited<ReturnType<typeof fetchPhotos>> | null = null;
  try {
    payload = await fetchPhotos(page);
  } catch (e) {
    return (
      <div className="container mx-auto p-4">
        <EmptyState
          title="Couldn't load photos"
          description="Please try again shortly."
        />
      </div>
    );
  }

  const items = payload?.data ?? [];
  const meta = payload?.meta;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Pictionary</h1>
      </div>

      {items.length === 0 ? (
        <div>No photos yet</div>
      ) : (
        // <EmptyState title="No photos yet" description="Check back soon." />
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((it) => (
              <PictionaryCard key={it.uuid} item={it} />
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

export const metadata = { title: "Pictionary | Daleel FM" };
