// app/pictionary/loading.tsx
export default function Loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-3 p-4 border rounded-xl">
          <div className="h-5 w-1/2 bg-muted rounded" />
          <div className="aspect-[4/3] w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
