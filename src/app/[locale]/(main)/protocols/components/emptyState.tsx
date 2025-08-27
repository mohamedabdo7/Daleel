"use client";

export default function EmptyState({
  title = "Select a protocol to begin",
  description = "Browse the clinical protocols by category",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-10 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
}
