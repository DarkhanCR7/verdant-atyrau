export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-5 py-16">
      <div className="bg-line h-4 w-32 rounded" />
      <div className="bg-line mt-3 h-10 w-2/3 rounded" />
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-line/60 h-40 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
