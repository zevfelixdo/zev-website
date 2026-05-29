export default function WritingLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <div className="h-4 w-16 bg-surface-alt rounded mb-4" />
          <div className="h-14 w-72 bg-surface-alt rounded mb-6" />
          <div className="h-6 w-full max-w-lg bg-surface-alt rounded" />
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="section-y container-content">
        <div className="max-w-3xl space-y-8">
          {/* Featured skeleton */}
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="h-56 w-full bg-surface-alt" />
            <div className="p-6 space-y-3">
              <div className="h-3 w-32 bg-surface-alt rounded" />
              <div className="h-7 w-4/5 bg-surface-alt rounded" />
              <div className="h-4 w-full bg-surface-alt rounded" />
              <div className="h-4 w-3/4 bg-surface-alt rounded" />
            </div>
          </div>

          {/* List skeletons */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-6 py-7 border-t border-border items-start">
              <div className="w-24 h-24 rounded-md bg-surface-alt flex-shrink-0 hidden sm:block" />
              <div className="flex-1 space-y-3">
                <div className="h-3 w-32 bg-surface-alt rounded" />
                <div className="h-6 w-4/5 bg-surface-alt rounded" />
                <div className="h-4 w-full bg-surface-alt rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
