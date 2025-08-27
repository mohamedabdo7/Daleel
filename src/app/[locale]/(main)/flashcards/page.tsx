// app/flashcards/page.tsx
// Server component: lists flashcard categories (no pagination on this page)
import { fetchFlashcardsCategories } from "@/lib/api/flashcards.service";
import PageHeader from "@/app/components/common/PageHeader";
import EmptyState from "./components/EmptyState";
import CategoriesGrid from "./components/CategoriesGrid";

export const revalidate = 0; // ensure fresh

export default async function FlashcardsPage() {
  let categories: Awaited<ReturnType<typeof fetchFlashcardsCategories>> | null =
    null;

  try {
    categories = await fetchFlashcardsCategories();
  } catch (e) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <PageHeader
          title="Flashcards"
          description="High-yield cards organized by specialty"
          iconAlt="Flashcards Icon"
          showSearch={false}
        />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <EmptyState
            title="Couldn't load flashcards"
            description="Please try again shortly."
          />
        </main>
      </div>
    );
  }

  const items = categories?.data ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <PageHeader
        title="Flashcards"
        description="High-yield cards organized by specialty"
        iconAlt="Flashcards Icon"
        showSearch={false}
      />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Check back soon."
          />
        ) : (
          <CategoriesGrid items={items} />
        )}
      </main>
    </div>
  );
}

export const metadata = {
  title: "Flashcards | Daleel FM",
};
